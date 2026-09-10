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

const router = express.Router();

router.get("/", getAllProperties);
router.get("/search", searchProperty);
router.get("/:propertyId", getPropertyById);
router.post("/", createProperty);
router.patch("/:propertyId", updateProperty);
router.delete("/:propertyId", deleteProperty);

router.get("/:propertyId/amenities", getPropertyAmenities);
router.post("/:propertyId/amenities", addAmenityProperty);
router.delete("/:propertyId/amenities", removeAmenityProperty);

export default router;
