import User from "../models/User.js";
import Portfolio from "../models/Portfolio.js";
import Trade from "../models/Trade.js";

/**
 * Applies a BUY at a given price against a user's wallet + portfolio, and records
 * the trade. Must run inside a mongoose transaction (session) — caller commits/aborts.
 * Throws { statusCode: 400 } for business-rule failures (e.g. insufficient balance),
 * which callers can treat as terminal (no point retrying the same order).
 */
export const executeBuyTrade = async ({ session, userId, symbol, quantity, priceInPaise }) => {
  const user = await User.findById(userId).session(session);
  if (!user) {
    throw Object.assign(new Error("User not found"), { statusCode: 404 });
  }

  const totalCostInPaise = priceInPaise * quantity;
  if (user.virtualBalanceInPaise < totalCostInPaise) {
    throw Object.assign(new Error("Insufficient balance"), { statusCode: 400 });
  }

  const holding = await Portfolio.findOne({ userId: user._id, symbol }).session(session);
  if (holding) {
    const newQty = holding.quantity + quantity;
    holding.avgBuyPriceInPaise = Math.round(
      (holding.avgBuyPriceInPaise * holding.quantity + priceInPaise * quantity) / newQty
    );
    holding.quantity = newQty;
    await holding.save({ session });
  } else {
    await Portfolio.create(
      [{ userId: user._id, symbol, quantity, avgBuyPriceInPaise: priceInPaise }],
      { session }
    );
  }

  user.virtualBalanceInPaise -= totalCostInPaise;
  await user.save({ session });

  const [trade] = await Trade.create(
    [{ userId: user._id, symbol, type: "BUY", priceInPaise, quantity }],
    { session }
  );

  return { trade, totalInPaise: totalCostInPaise, virtualBalanceInPaise: user.virtualBalanceInPaise };
};

/**
 * Applies a SELL at a given price against a user's holdings + wallet, and records
 * the trade. Must run inside a mongoose transaction (session) — caller commits/aborts.
 * Throws { statusCode: 400 } for business-rule failures (e.g. not enough shares).
 */
export const executeSellTrade = async ({ session, userId, symbol, quantity, priceInPaise }) => {
  const holding = await Portfolio.findOne({ userId, symbol }).session(session);
  if (!holding || holding.quantity < quantity) {
    throw Object.assign(new Error("Not enough shares to sell"), { statusCode: 400 });
  }

  holding.quantity -= quantity;
  if (holding.quantity === 0) {
    await holding.deleteOne({ session });
  } else {
    await holding.save({ session });
  }

  const proceedsInPaise = priceInPaise * quantity;
  const user = await User.findByIdAndUpdate(
    userId,
    { $inc: { virtualBalanceInPaise: proceedsInPaise } },
    { new: true, session }
  );

  const [trade] = await Trade.create(
    [{ userId, symbol, type: "SELL", priceInPaise, quantity }],
    { session }
  );

  return { trade, totalInPaise: proceedsInPaise, virtualBalanceInPaise: user.virtualBalanceInPaise };
};
