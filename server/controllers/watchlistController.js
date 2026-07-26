import Watchlist from "../models/Watchlist.js";

export const getWatchlist = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id || req.user.userId;
    const items = await Watchlist.find({ userId }).sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    console.error("WATCHLIST FETCH ERROR:", error);
    res.status(500).json({ message: "Failed to fetch watchlist" });
  }
};

export const addToWatchlist = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id || req.user.userId;
    const symbol = String(req.body.symbol || "").trim().toUpperCase();

    if (!symbol) {
      return res.status(400).json({ message: "Symbol is required" });
    }

    const item = await Watchlist.findOneAndUpdate(
      { userId, symbol },
      { userId, symbol },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.status(201).json(item);
  } catch (error) {
    console.error("WATCHLIST ADD ERROR:", error);
    res.status(500).json({ message: "Failed to add to watchlist" });
  }
};

export const removeFromWatchlist = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id || req.user.userId;
    const symbol = String(req.params.symbol || "").trim().toUpperCase();

    await Watchlist.findOneAndDelete({ userId, symbol });
    res.json({ message: "Removed from watchlist" });
  } catch (error) {
    console.error("WATCHLIST REMOVE ERROR:", error);
    res.status(500).json({ message: "Failed to remove from watchlist" });
  }
};
