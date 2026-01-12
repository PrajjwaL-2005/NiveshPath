import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    virtualBalance: { type: Number, default: 100000 }
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
