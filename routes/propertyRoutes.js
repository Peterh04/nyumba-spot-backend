import express from "express";
import {
  createProperty,
  deleteProperty,
  updateProperty,
  getAllProperties,
  getPropertyById,
  searchProperty,
} from "../controller/propertyController.js";
import {
  getPropertyAmenities,
  addAmenityProperty,
  removeAmenityProperty,
} from "../controller/amenityController.js";

import {
  addPropertyMoveInCost,
  deletePropertyMoveInCost,
  editPropertyMoveInCost,
} from "../controller/moveInCostController.js";

import {
  addPropertyRequirementRules,
  removePropertyRequirementRules,
} from "../controller/RequirementsRulesController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import verifyIsAdmin from "../middleware/adminMiddleware.js";

const router = express.Router();

router.get("/", getAllProperties);
router.get("/search", searchProperty);
router.get("/:propertyId", getPropertyById);
router.post("/", verifyToken, verifyIsAdmin, createProperty);
router.patch("/:propertyId", verifyToken, verifyIsAdmin, updateProperty);
router.delete("/:propertyId", verifyToken, verifyIsAdmin, deleteProperty);

router.get("/:propertyId/amenities", getPropertyAmenities);
router.post(
  "/:propertyId/amenities",
  verifyToken,
  verifyIsAdmin,
  addAmenityProperty,
);
router.delete(
  "/:propertyId/amenities",
  verifyToken,
  verifyIsAdmin,
  removeAmenityProperty,
);

router.post(
  "/:propertyId/moveInCosts",
  verifyToken,
  verifyIsAdmin,
  addPropertyMoveInCost,
);
router.delete(
  "/:propertyId/moveInCosts",
  verifyToken,
  verifyIsAdmin,
  deletePropertyMoveInCost,
);
router.put(
  "/:propertyId/moveInCosts",
  verifyToken,
  verifyIsAdmin,
  editPropertyMoveInCost,
);

router.post(
  "/:propertyId/rules-requirements",
  verifyToken,
  verifyIsAdmin,
  addPropertyRequirementRules,
);
router.delete(
  "/:propertyId/rules-requirements",
  verifyToken,
  verifyIsAdmin,
  removePropertyRequirementRules,
);

export default router;
