import mongoose from "mongoose";
import User from "../models/User.js";
import Portfolio from "../models/Portfolio.js";
import Trade from "../models/Trade.js";
import { fetchStockPriceFromFinnhub } from "../utils/finnhubClient.js";
import { toPaise, toRupees } from "../utils/money.js";

/* ============================
   BUY STOCK (MARKET ORDER)
============================ */
export const buyStock = async (req, res) => {
  const { symbol, quantity } = req.body;

  // 🔑 userId from decoded JWT (middleware sets req.user = decoded)
  const userId = req.user.id;
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // ✅ Fetch live market price
  const quote = await fetchStockPriceFromFinnhub(symbol);
  const price = quote?.c;

  if (!price || price <= 0) {
    return res.status(400).json({ message: "Price unavailable" });
  }

  const priceInPaise = toPaise(price);
  const totalCostInPaise = priceInPaise * quantity;
  const session = await mongoose.startSession();

  try {
    let finalBalanceInPaise;

    await session.withTransaction(async () => {
      const user = await User.findById(userId).session(session);
      if (!user) {
        throw Object.assign(new Error("User not found"), { statusCode: 404 });
      }

      // ✅ Wallet check
      if (user.virtualBalanceInPaise < totalCostInPaise) {
        throw Object.assign(new Error("Insufficient balance"), {
          statusCode: 400,
          details: {
            required: toRupees(totalCostInPaise),
            available: toRupees(user.virtualBalanceInPaise),
          },
        });
      }

      // ✅ Update / Merge portfolio
      const holding = await Portfolio.findOne({
        userId: user._id,
        symbol,
      }).session(session);

      if (holding) {
        const newQty = holding.quantity + quantity;
        const newAvgPriceInPaise = Math.round(
          (holding.avgBuyPriceInPaise * holding.quantity + priceInPaise * quantity) /
            newQty
        );

        holding.quantity = newQty;
        holding.avgBuyPriceInPaise = newAvgPriceInPaise;
        await holding.save({ session });
      } else {
        await Portfolio.create(
          [{ userId: user._id, symbol, quantity, avgBuyPriceInPaise: priceInPaise }],
          { session }
        );
      }

      // ✅ Deduct wallet
      user.virtualBalanceInPaise -= totalCostInPaise;
      await user.save({ session });

      // ✅ Save trade history
      await Trade.create(
        [{ userId: user._id, symbol, type: "BUY", priceInPaise, quantity }],
        { session }
      );

      finalBalanceInPaise = user.virtualBalanceInPaise;
    });

    return res.json({
      message: "Buy executed successfully",
      symbol,
      executedPrice: toRupees(priceInPaise),
      quantity,
      totalCost: toRupees(totalCostInPaise),
      virtualBalance: toRupees(finalBalanceInPaise),
    });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ message: error.message, ...error.details });
    }
    console.error("BUY ERROR:", error);
    return res.status(500).json({ message: "Buy order failed" });
  } finally {
    await session.endSession();
  }
};

/* ============================
   SELL STOCK (MARKET ORDER)
============================ */
export const sellStock = async (req, res) => {
  const { symbol, quantity } = req.body;

  const userId = req.user.id;
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // ✅ Fetch live price
  const quote = await fetchStockPriceFromFinnhub(symbol);
  const price = quote?.c;

  if (!price || price <= 0) {
    return res.status(400).json({ message: "Price unavailable" });
  }

  const priceInPaise = toPaise(price);
  const proceedsInPaise = priceInPaise * quantity;
  const session = await mongoose.startSession();

  try {
    let finalBalanceInPaise;

    await session.withTransaction(async () => {
      const holding = await Portfolio.findOne({
        userId,
        symbol,
      }).session(session);

      // ✅ Quantity validation
      if (!holding || holding.quantity < quantity) {
        throw Object.assign(new Error("Not enough shares to sell"), { statusCode: 400 });
      }

      // ✅ Update holding
      holding.quantity -= quantity;

      if (holding.quantity === 0) {
        await holding.deleteOne({ session });
      } else {
        await holding.save({ session });
      }

      // ✅ Credit wallet
      const user = await User.findByIdAndUpdate(
        userId,
        { $inc: { virtualBalanceInPaise: proceedsInPaise } },
        { new: true, session }
      );

      // ✅ Save trade history
      await Trade.create(
        [{ userId, symbol, type: "SELL", priceInPaise, quantity }],
        { session }
      );

      finalBalanceInPaise = user.virtualBalanceInPaise;
    });

    return res.json({
      message: "Sell executed successfully",
      symbol,
      executedPrice: toRupees(priceInPaise),
      quantity,
      creditedAmount: toRupees(proceedsInPaise),
      virtualBalance: toRupees(finalBalanceInPaise),
    });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    console.error("SELL ERROR:", error);
    return res.status(500).json({ message: "Sell order failed" });
  } finally {
    await session.endSession();
  }
};
