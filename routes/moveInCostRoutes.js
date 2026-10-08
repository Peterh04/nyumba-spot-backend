import express from "express";
import {
  createMoveInCost,
  deleteMoveInCosts,
  editMoveInCost,
} from "../controller/moveInCost.js";
const router = express.Router();

router.post("/", createMoveInCost);
router.delete("/:moveInCostId", deleteMoveInCosts);
router.put("/:moveInCostId", editMoveInCost);

export default router;
