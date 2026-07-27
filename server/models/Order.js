import mongoose from "mongoose";
import { isIntegerPaise } from "../utils/money.js";

// Status machine: PENDING -> PROCESSING -> FILLED | FAILED
//                 PENDING -> CANCELLED | EXPIRED
//                 PROCESSING -> PENDING (requeue after a crashed/stale worker claim)
// All other transitions are invalid. FILLED, CANCELLED, EXPIRED, FAILED are terminal.
export const ORDER_TRANSITIONS = {
  PENDING: ["PROCESSING", "CANCELLED", "EXPIRED"],
  PROCESSING: ["FILLED", "FAILED", "PENDING"],
  FILLED: [],
  CANCELLED: [],
  EXPIRED: [],
  FAILED: [],
};

export const canTransitionOrderStatus = (from, to) =>
  Array.isArray(ORDER_TRANSITIONS[from]) && ORDER_TRANSITIONS[from].includes(to);

const orderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    symbol: { type: String, required: true, uppercase: true, trim: true },
    side: { type: String, enum: ["BUY", "SELL"], required: true },
    orderType: { type: String, enum: ["LIMIT", "STOP_LOSS"], required: true },
    triggerPriceInPaise: { type: Number, required: true, min: 1, validate: isIntegerPaise },
    quantity: { type: Number, required: true, min: 1 },

    status: {
      type: String,
      enum: ["PENDING", "PROCESSING", "FILLED", "CANCELLED", "EXPIRED", "FAILED"],
      default: "PENDING",
      required: true,
    },

    // Claim bookkeeping — lets an atomic findOneAndUpdate act as a distributed lock
    // so two worker processes polling the same order can never both fill it.
    attempts: { type: Number, default: 0 },
    claimedAt: { type: Date, default: null },
    claimedBy: { type: String, default: null },
    lastError: { type: String, default: null },

    filledPriceInPaise: { type: Number, default: null, validate: { validator: (v) => v === null || Number.isInteger(v), message: "filledPriceInPaise must be an integer number of paise" } },
    filledAt: { type: Date, default: null },

    // Optional good-till-date; omit for a good-till-cancelled order.
    expiresAt: { type: Date, default: null },
  },
  { timestamps: true }
);

orderSchema.index({ status: 1, symbol: 1 });
orderSchema.index({ userId: 1, status: 1, createdAt: -1 });
orderSchema.index({ status: 1, claimedAt: 1 });

export default mongoose.model("Order", orderSchema);
