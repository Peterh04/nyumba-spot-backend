import express from "express";
import {
  googleLoginUser,
  loginUser,
  logoutUser,
  refreshToken,
  registerUser,
} from "../controller/authController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/token/refresh", refreshToken);
router.post("/google", googleLoginUser);

export default router;
