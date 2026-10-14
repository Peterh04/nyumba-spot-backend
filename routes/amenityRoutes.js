import express from "express";
import {
  createPropertyAmenity,
  deleteAmenity,
  getAllAmenities,
  updateAmenity,
} from "../controller/amenityController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import verifyIsAdmin from "../middleware/adminMiddleware.js";

const router = express.Router();

router.get("/", verifyToken, verifyIsAdmin, getAllAmenities);
router.post("/", verifyToken, verifyIsAdmin, createPropertyAmenity);
router.patch("/update/:amenityId", verifyToken, verifyIsAdmin, updateAmenity);
router.delete("/delete/:amenityId", verifyToken, verifyIsAdmin, deleteAmenity);

export default router;
