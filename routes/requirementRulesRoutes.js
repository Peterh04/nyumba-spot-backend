import express from "express";
import {
  createRequirementRules,
  deleteRequirementRules,
  editRequirementRules,
} from "../controller/RequirementsRulesController.js";

import verifyToken from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", verifyToken, createRequirementRules);
router.delete("/", verifyToken, deleteRequirementRules);
router.patch("/:requirementRuleId", verifyToken, editRequirementRules);

export default router;
