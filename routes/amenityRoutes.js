import express from "express";
import {
  createPropertyAmenity,
  deleteAmenity,
  getAllAmenities,
  updateAmenity,
} from "../controller/amenityController.js";
import verifyToken from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", verifyToken, getAllAmenities);
router.post("/", verifyToken, createPropertyAmenity);
router.patch("/update/:amenityId", verifyToken, updateAmenity);
router.delete("/delete/:amenityId", verifyToken, deleteAmenity);

export default router;
