import express from "express";
import {
  createProperty,
  deleteProperty,
  updateProperty,
  getAllProperties,
} from "../controller/propertyController.js";

const router = express.Router();

router.get("/", getAllProperties);
router.post("/", createProperty);
router.patch("/:propertyId", updateProperty);
router.delete("/:propertyId", deleteProperty);

export default router;
