import Portfolio from "../models/Portfolio.js";
import Trade from "../models/Trade.js";
import User from "../models/User.js";

export const getPortfolio = async (req, res) => {
  const holdings = await Portfolio.find({ userId: req.user.id });
  const user = await User.findById(req.user.id);
  res.json({ holdings, balance: user.virtualBalance });
};

export const getTrades = async (req, res) => {
  const trades = await Trade.find({ userId: req.user.id }).sort({ timestamp: -1 });
  res.json(trades);
};
