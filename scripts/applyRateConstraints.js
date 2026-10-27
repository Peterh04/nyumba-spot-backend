import { Op } from "sequelize";
import sequelize from "../config/db.js";

async function applyRateConstraints() {
  const queryInterface = sequelize.getQueryInterface();
  try {
    await sequelize.query(`
        ALTER TABLE "OtpRateLimits"
        ADD CONSTRAINT "check_resend_attempts"
        CHECK ("resendTries" >= 0 AND "resendTries" <= 5);
      `);

    console.log("Constraint added successfully!");
  } catch (error) {
    console.error("Error applying constraint:", error);
  }
}

applyRateConstraints();
