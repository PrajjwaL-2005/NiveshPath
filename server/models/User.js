import mongoose from "mongoose";
import { isIntegerPaise } from "../utils/money.js";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true, select: false },
    virtualBalanceInPaise: { type: Number, default: 10000000, validate: isIntegerPaise }
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
