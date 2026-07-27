import mongoose from "mongoose";
import { isIntegerPaise } from "../utils/money.js";

const tradeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  symbol: String,
  type: { type: String, enum: ["BUY", "SELL"] },
  priceInPaise: { type: Number, validate: isIntegerPaise },
  quantity: Number,
  timestamp: { type: Date, default: Date.now }
});

export default mongoose.model("Trade", tradeSchema);
