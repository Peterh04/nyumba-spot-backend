import express from "express";
import {
  createPropertyAmenity,
  deleteAmenity,
  getAllAmenities,
  updateAmenity,
} from "../controller/amenityController.js";

const router = express.Router();

router.get("/", getAllAmenities);
router.post("/", createPropertyAmenity);
router.patch("/update/:amenityId", updateAmenity);
router.delete("/delete/:amenityId", deleteAmenity);

export default router;
