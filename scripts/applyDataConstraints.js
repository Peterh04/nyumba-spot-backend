import { Op } from "sequelize";
import sequelize from "../config/db.js";

async function applyDataConstraints() {
  const queryInterface = sequelize.getQueryInterface();
  try {
    await sequelize.query(`
      ALTER TABLE "EmailVerifications"
      ADD CONSTRAINT "check_attempts_range"
      CHECK ("attempts" >= 0 AND "attempts" <= 5);
    `);

    console.log("Constraint added successfully!");
  } catch (error) {
    console.error("Error applying constraint:", error);
  }
}

applyDataConstraints();
