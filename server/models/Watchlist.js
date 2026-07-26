import mongoose from "mongoose";

const watchlistSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    symbol: { type: String, required: true, uppercase: true, trim: true },
  },
  { timestamps: true }
);

watchlistSchema.index({ userId: 1, symbol: 1 }, { unique: true });

export default mongoose.model("Watchlist", watchlistSchema);
