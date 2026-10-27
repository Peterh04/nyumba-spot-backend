import { DataTypes, Op, Sequelize } from "sequelize";
import sequelize from "../config/db.js";

const EmailVerification = sequelize.define("EmailVerification", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
  },
  otpHash: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  attempts: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0,
      max: 5,
    },
  },
  expires_at: {
    type: DataTypes.DATE,
    allowNull: false,
  },
});

export default EmailVerification;
