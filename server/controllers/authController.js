import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { generateToken } from "../utils/jwt.js";
import { toRupees } from "../utils/money.js";

const serializeUser = (user) => {
  const { password, virtualBalanceInPaise, ...safeUser } = user.toObject();
  return { ...safeUser, virtualBalance: toRupees(virtualBalanceInPaise) };
};

export const signup = async (req, res) => {
  const { name, email, password } = req.body;

  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json({ message: "User exists" });

  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hashed });

  res.json({
    token: generateToken(user),
    user: serializeUser(user)
  });
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");
  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ message: "Invalid credentials" });

  res.json({
    token: generateToken(user),
    user: serializeUser(user)
  });
};
