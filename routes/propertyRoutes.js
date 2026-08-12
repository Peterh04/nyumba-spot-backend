import express from "express";
import {
  createProperty,
  deleteProperty,
  updateProperty,
} from "../controller/propertyController.js";

const router = express.Router();

router.post("/", createProperty);
router.patch("/:propertyId", updateProperty);
router.delete("/:propertyId", deleteProperty);

export default router;
