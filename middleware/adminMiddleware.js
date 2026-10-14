import User from "../models/User.js";

const verifyIsAdmin = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ["id", "role"],
    });
    if (!user)
      return res.status(401).json({ message: "User account not found" });

    if (user.role !== "admin")
      return res.status(403).json({ message: "Only admin can access!" });
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to verify admin" });
  }
};

export default verifyIsAdmin;
