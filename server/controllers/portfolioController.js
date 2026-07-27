import Portfolio from "../models/Portfolio.js";
import Trade from "../models/Trade.js";
import User from "../models/User.js";
import { toRupees } from "../utils/money.js";

export const getPortfolio = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id || req.user.userId;

    const holdings = await Portfolio.find({ userId }).lean();

    res.json({
      holdings: holdings.map(({ avgBuyPriceInPaise, ...holding }) => ({
        ...holding,
        avgBuyPrice: toRupees(avgBuyPriceInPaise),
      })),
    });
  } catch (error) {
    console.error("PORTFOLIO ERROR:", error);
    res.status(500).json({ message: "Failed to fetch portfolio" });
  }
};
export const getTrades = async (req, res) => {
  const { page, limit } = req.query;

  const trades = await Trade.find({ userId: req.user.id })
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .lean();

  res.json(
    trades.map(({ priceInPaise, ...trade }) => ({
      ...trade,
      price: toRupees(priceInPaise),
    }))
  );
};
