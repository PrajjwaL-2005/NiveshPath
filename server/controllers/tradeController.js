import User from "../models/User.js";
import Portfolio from "../models/Portfolio.js";
import Trade from "../models/Trade.js";
import { fetchStockPriceFromFinnhub } from "../utils/finnhubClient.js";

/* ============================
   BUY STOCK (MARKET ORDER)
============================ */
export const buyStock = async (req, res) => {
  try {
    const { symbol, quantity } = req.body;

    if (!symbol || !quantity || quantity <= 0) {
      return res.status(400).json({ message: "Invalid input" });
    }

    // 🔑 userId from decoded JWT (middleware sets req.user = decoded)
    const userId = req.user.id || req.user._id || req.user.userId;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // ✅ Fetch live market price
    const quote = await fetchStockPriceFromFinnhub(symbol);
    const price = quote?.c;

    if (!price || price <= 0) {
      return res.status(400).json({ message: "Price unavailable" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const totalCost = price * quantity;

    // ✅ Wallet check
    if (user.virtualBalance < totalCost) {
      return res.status(400).json({
        message: "Insufficient balance",
        required: totalCost,
        available: user.virtualBalance,
      });
    }

    // ✅ Update / Merge portfolio
    let holding = await Portfolio.findOne({
      userId: user._id,
      symbol,
    });

    if (holding) {
      const newQty = holding.quantity + quantity;
      const newAvgPrice =
        (holding.avgBuyPrice * holding.quantity + price * quantity) /
        newQty;

      holding.quantity = newQty;
      holding.avgBuyPrice = newAvgPrice;
      await holding.save();
    } else {
      await Portfolio.create({
        userId: user._id,
        symbol,
        quantity,
        avgBuyPrice: price,
      });
    }

    // ✅ Deduct wallet
    user.virtualBalance -= totalCost;
    await user.save();

    // ✅ Save trade history
    await Trade.create({
      userId: user._id,
      symbol,
      type: "BUY",
      price,
      quantity,
    });

    return res.json({
      message: "Buy executed successfully",
      symbol,
      executedPrice: price,
      quantity,
      totalCost,
      remainingBalance: user.virtualBalance,
    });
  } catch (error) {
    console.error("BUY ERROR:", error);
    return res.status(500).json({ message: "Buy order failed" });
  }
};

/* ============================
   SELL STOCK (MARKET ORDER)
============================ */
export const sellStock = async (req, res) => {
  try {
    const { symbol, quantity } = req.body;

    if (!symbol || !quantity || quantity <= 0) {
      return res.status(400).json({ message: "Invalid input" });
    }

    const userId = req.user.id || req.user._id || req.user.userId;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const holding = await Portfolio.findOne({
      userId,
      symbol,
    });

    // ✅ Quantity validation
    if (!holding || holding.quantity < quantity) {
      return res.status(400).json({
        message: "Not enough shares to sell",
      });
    }

    // ✅ Fetch live price
    const quote = await fetchStockPriceFromFinnhub(symbol);
    const price = quote?.c;

    if (!price || price <= 0) {
      return res.status(400).json({ message: "Price unavailable" });
    }

    const proceeds = price * quantity;

    // ✅ Update holding
    holding.quantity -= quantity;

    if (holding.quantity === 0) {
      await holding.deleteOne();
    } else {
      await holding.save();
    }

    // ✅ Credit wallet
    await User.findByIdAndUpdate(userId, {
      $inc: { virtualBalance: proceeds },
    });

    // ✅ Save trade history
    await Trade.create({
      userId,
      symbol,
      type: "SELL",
      price,
      quantity,
    });

    return res.json({
      message: "Sell executed successfully",
      symbol,
      executedPrice: price,
      quantity,
      creditedAmount: proceeds,
    });
  } catch (error) {
    console.error("SELL ERROR:", error);
    return res.status(500).json({ message: "Sell order failed" });
  }
};
