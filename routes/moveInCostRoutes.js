import express from "express";
import {
  createMoveInCost,
  deleteMoveInCosts,
  editMoveInCost,
} from "../controller/moveInCostController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import verifyIsAdmin from "../middleware/adminMiddleware.js";

const router = express.Router();

router.post("/", verifyToken, verifyIsAdmin, createMoveInCost);
router.delete("/:moveInCostId", verifyToken, verifyIsAdmin, deleteMoveInCosts);
router.put("/:moveInCostId", verifyToken, verifyIsAdmin, editMoveInCost);

export default router;
