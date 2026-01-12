import mongoose from "mongoose";

const tradeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  symbol: String,
  type: { type: String, enum: ["BUY", "SELL"] },
  price: Number,
  quantity: Number,
  timestamp: { type: Date, default: Date.now }
});

export default mongoose.model("Trade", tradeSchema);
