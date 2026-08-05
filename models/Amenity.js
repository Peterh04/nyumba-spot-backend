import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Amenity = sequelize.define("Amenity", {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true,
    },
  },
});

export default Amenity;
