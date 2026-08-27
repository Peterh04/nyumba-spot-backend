import express from "express";
import {
  createProperty,
  deleteProperty,
  updateProperty,
  getAllProperties,
  getPropertyById,
  searchProperty,
} from "../controller/propertyController.js";

const router = express.Router();

router.get("/", getAllProperties);
router.get("/search", searchProperty);
router.get("/:propertyId", getPropertyById);
router.post("/", createProperty);
router.patch("/:propertyId", updateProperty);
router.delete("/:propertyId", deleteProperty);

export default router;
