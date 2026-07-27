import mongoose from "mongoose";
import { isIntegerPaise } from "../utils/money.js";

const tradeSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    symbol: { type: String, required: true, uppercase: true, trim: true },
    type: { type: String, enum: ["BUY", "SELL"], required: true },
    priceInPaise: { type: Number, required: true, min: 0, validate: isIntegerPaise },
    quantity: { type: Number, required: true, min: 0 }
  },
  { timestamps: true }
);

export default mongoose.model("Trade", tradeSchema);
