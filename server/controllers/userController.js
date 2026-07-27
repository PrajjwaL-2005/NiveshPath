import User from "../models/User.js";
import { toRupees } from "../utils/money.js";

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select(
      "name email virtualBalanceInPaise"
    );

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      virtualBalance: toRupees(user.virtualBalanceInPaise),
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch user data" });
  }
};
