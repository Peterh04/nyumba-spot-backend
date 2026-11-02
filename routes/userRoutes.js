import express from "express";
import { getUser } from "../controller/userController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/me", verifyToken, getUser);
export default router;
