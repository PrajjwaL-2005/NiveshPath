import Portfolio from "../models/Portfolio.js";
import Trade from "../models/Trade.js";
import User from "../models/User.js";

export const getPortfolio = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id || req.user.userId;

    const holdings = await Portfolio.find({ userId });

    res.json({
      holdings,
    });
  } catch (error) {
    console.error("PORTFOLIO ERROR:", error);
    res.status(500).json({ message: "Failed to fetch portfolio" });
  }
};
export const getTrades = async (req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 20));

  const trades = await Trade.find({ userId: req.user.id })
    .sort({ timestamp: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  res.json(trades);
};
