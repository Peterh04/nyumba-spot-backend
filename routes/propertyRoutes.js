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
import verifyToken from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getAllProperties);
router.get("/search", searchProperty);
router.get("/:propertyId", getPropertyById);
router.post("/", verifyToken, createProperty);
router.patch("/:propertyId", verifyToken, updateProperty);
router.delete("/:propertyId", verifyToken, deleteProperty);

router.get("/:propertyId/amenities", getPropertyAmenities);
router.post("/:propertyId/amenities", verifyToken, addAmenityProperty);
router.delete("/:propertyId/amenities", verifyToken, removeAmenityProperty);

router.post("/:propertyId/moveInCosts", verifyToken, addPropertyMoveInCost);
router.delete(
  "/:propertyId/moveInCosts",
  verifyToken,
  deletePropertyMoveInCost,
);
router.put("/:propertyId/moveInCosts", verifyToken, editPropertyMoveInCost);

router.post(
  "/:propertyId/rules-requirements",
  verifyToken,
  addPropertyRequirementRules,
);
router.delete(
  "/:propertyId/rules-requirements",
  verifyToken,
  removePropertyRequirementRules,
);

export default router;
