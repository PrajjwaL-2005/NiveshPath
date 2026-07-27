import mongoose from "mongoose";
import { isIntegerPaise } from "../utils/money.js";

const portfolioSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    symbol: { type: String, required: true, uppercase: true, trim: true },
    quantity: { type: Number, required: true, min: 0 },
    avgBuyPriceInPaise: { type: Number, required: true, min: 0, validate: isIntegerPaise }
  },
  { timestamps: true }
);

portfolioSchema.index({ userId: 1, symbol: 1 }, { unique: true });

export default mongoose.model("Portfolio", portfolioSchema);
