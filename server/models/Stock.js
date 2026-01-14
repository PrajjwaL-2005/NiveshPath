import mongoose from "mongoose";

const stockSchema = new mongoose.Schema(
  {
    symbol: {
      type: String,
      required: true,
      uppercase: true,
      unique: true,
      index: true
    },
    name: {
      type: String,
      required: true
    },
    exchange: {
      type: String,
      enum: ["NSE", "BSE"],
      default: "NSE"
    },
    sector: {
      type: String
    },
    industry: {
      type: String
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

/* Text search */
stockSchema.index({ name: "text", symbol: "text" });

const Stock = mongoose.model("Stock", stockSchema);
export default Stock;
