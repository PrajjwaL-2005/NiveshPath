import mongoose from "mongoose";
import { isIntegerPaise } from "../utils/money.js";

const portfolioSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  symbol: String,
  quantity: Number,
  avgBuyPriceInPaise: { type: Number, validate: isIntegerPaise }
});

portfolioSchema.index({ userId: 1, symbol: 1 }, { unique: true });

export default mongoose.model("Portfolio", portfolioSchema);
