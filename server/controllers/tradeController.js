import mongoose from "mongoose";
import { fetchStockPriceFromFinnhub } from "../utils/finnhubClient.js";
import { toPaise, toRupees } from "../utils/money.js";
import { executeBuyTrade, executeSellTrade } from "../services/tradeService.js";

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
  const session = await mongoose.startSession();

  try {
    let result;

    await session.withTransaction(async () => {
      result = await executeBuyTrade({ session, userId, symbol, quantity, priceInPaise });
    });

    return res.json({
      message: "Buy executed successfully",
      symbol,
      executedPrice: toRupees(priceInPaise),
      quantity,
      totalCost: toRupees(result.totalInPaise),
      virtualBalance: toRupees(result.virtualBalanceInPaise),
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
  const session = await mongoose.startSession();

  try {
    let result;

    await session.withTransaction(async () => {
      result = await executeSellTrade({ session, userId, symbol, quantity, priceInPaise });
    });

    return res.json({
      message: "Sell executed successfully",
      symbol,
      executedPrice: toRupees(priceInPaise),
      quantity,
      creditedAmount: toRupees(result.totalInPaise),
      virtualBalance: toRupees(result.virtualBalanceInPaise),
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
