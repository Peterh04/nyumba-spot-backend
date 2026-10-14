import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader)
    return res
      .status(401)
      .json({ message: "A token is required for authentication" });

  if (!authHeader.startsWith("Bearer "))
    return res
      .status(401)
      .json({ message: "Invalid authorization header format" });

  const token = authHeader.split(" ")[1];
  if (!token)
    return res
      .status(401)
      .json({ message: "A token is required for authentication" });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err)
      return res.status(401).json({ message: "Invalid or expired token" });
    req.user = user;
    next();
  });
};

export const isEmailVerified = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ["id", "email_verified"],
    });
    if (!user)
      return res.status(401).json({ message: "User account not found" });

    if (user.email_verified !== true)
      return res
        .status(403)
        .json({ message: "Email not veified. Please veriify email" });
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to verify if email is verified" });
  }
};
