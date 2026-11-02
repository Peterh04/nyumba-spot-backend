import User from "../models/User.js";

export const getUser = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findByPk(userId, {
      attributes: ["id", "name", "email", "role"],
    });

    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ message: "User retrieved successfully", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to get user" });
  }
};
