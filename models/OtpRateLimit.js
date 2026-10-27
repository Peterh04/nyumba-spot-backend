import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const OtpRateLimit = sequelize.define("OtpRateLimit", {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  resendTries: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0,
      max: 5,
    },
  },
  resetTime: {
    type: DataTypes.DATE,
    allowNull: false,
  },
});

export default OtpRateLimit;
