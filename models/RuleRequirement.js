import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const RuleRequirement = sequelize.define("RuleRequirement", {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  type: {
    type: DataTypes.ENUM("rule", "requirement"),
    allowNull: false,
  },
});

export default RuleRequirement;
