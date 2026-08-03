import sequelize from "../config/db.js";
import MoveInCost from "../models/MoveInCost.js";

const MoveInCosts = [
  { title: "Monthly Rent" },
  { title: "Security Deposit" },
  { title: "Water Deposit" },
  { title: "Electricity Token Deposit" },
  { title: "Service Charge" },
  { title: "Garbage Collection Fee" },
  { title: "Parking Fee" },
];

try {
  await sequelize.authenticate();

  await MoveInCost.bulkCreate(MoveInCosts, {
    ignoreDuplicates: true,
  });

  console.log("MoveInCosts seeded successfully.");
} catch (error) {
  console.error(error);
}
