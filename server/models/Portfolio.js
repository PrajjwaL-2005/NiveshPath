import mongoose from "mongoose";

const portfolioSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  symbol: String,
  quantity: Number,
  avgBuyPrice: Number
});

export default mongoose.model("Portfolio", portfolioSchema);
