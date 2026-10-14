import express from "express";
import {
  createRequirementRules,
  deleteRequirementRules,
  editRequirementRules,
} from "../controller/RequirementsRulesController.js";

import { verifyToken } from "../middleware/authMiddleware.js";
import verifyIsAdmin from "../middleware/adminMiddleware.js";

const router = express.Router();

router.post("/", verifyToken, verifyIsAdmin, createRequirementRules);
router.delete("/", verifyToken, verifyIsAdmin, deleteRequirementRules);
router.patch(
  "/:requirementRuleId",
  verifyToken,
  verifyIsAdmin,
  editRequirementRules,
);

export default router;
