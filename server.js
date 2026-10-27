import express from "express";
import dotenv from "dotenv";
import sequelize from "./config/db.js";

import "./models/Amenity.js";
import "./models/Property.js";
import "./models/MoveInCost.js";
import "./models/PropertyMedia.js";
import "./models/PropertyMoveInCost.js";
import "./models/RuleRequirement.js";
import "./models/associations.js";
import "./models/User.js";
import "./models/Review.js";

import authRoutes from "./routes/authRoutes.js";
import propertRoutes from "./routes/propertyRoutes.js";
import amenityRoutes from "./routes/amenityRoutes.js";
import moveInCostRoutes from "./routes/moveInCostRoutes.js";
import requirementRulesRoutes from "./routes/requirementRulesRoutes.js";
import emailVerificationRoutes from "./routes/emailVerificationRoutes.js";
import cors from "cors";

dotenv.config();

sequelize
  .sync({
    alter: true,
  })
  .then(() => console.log("Db connected successfully"));

const port = process.env.PORT || 5500;

const app = express();

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());
app.use("/api/users", authRoutes);
app.use("/api/properties", propertRoutes);
app.use("/api/amenities", amenityRoutes);
app.use("/api/move-in-costs", moveInCostRoutes);
app.use("/api/rules-requirements", requirementRulesRoutes);
app.use("/api/email-verification/otp", emailVerificationRoutes);

app.get("/", (req, res) => {
  res.status(200).json("Hi homepage");
});

app.get("/about", (req, res) => {
  res.status(200).json("This is the about page");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
