import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const MoveInCost = sequelize.define("MoveInCost", {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    validate: {
      notEmpty: true,
    },
  },

  title: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true,
      len: [2, 50],
    },
  },
});

export default MoveInCost;
