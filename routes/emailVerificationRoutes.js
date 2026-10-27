import express from "express";
import {
  resendOTP,
  verifyOTP,
} from "../controller/emailVerificationController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/verify", verifyOTP);
router.post("/resend", resendOTP);

export default router;
