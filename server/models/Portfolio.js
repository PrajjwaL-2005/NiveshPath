import mongoose from "mongoose";

const portfolioSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  symbol: String,
  quantity: Number,
  avgBuyPrice: Number
});

portfolioSchema.index({ userId: 1, symbol: 1 }, { unique: true });

export default mongoose.model("Portfolio", portfolioSchema);
