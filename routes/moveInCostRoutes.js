import express from "express";
import {
  createMoveInCost,
  deleteMoveInCosts,
  editMoveInCost,
} from "../controller/moveInCostController.js";
import verifyToken from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", verifyToken, createMoveInCost);
router.delete("/:moveInCostId", verifyToken, deleteMoveInCosts);
router.put("/:moveInCostId", verifyToken, editMoveInCost);

export default router;
