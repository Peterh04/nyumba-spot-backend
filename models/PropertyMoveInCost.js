import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const PropertyMoveInCost = sequelize.define("PropertyMoveInCost", {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },

  refundable: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },

  amount: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
    validate: {
      min: 0,
    },
  },
});

export default PropertyMoveInCost;
