import User from "../models/User.js";

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select(
      "name email virtualBalance"
    );

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch user data" });
  }
};
