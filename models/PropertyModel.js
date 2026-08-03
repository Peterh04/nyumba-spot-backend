import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Property = sequelize.define("Property", {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  price: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
    validate: {
      min: 0,
    },
  },
  bedrooms: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  bathrooms: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  size: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  propertyType: {
    type: DataTypes.ENUM(
      "Apartment",
      "Bungalow",
      "Maisonette",
      "Townhouse",
      "Villa",
      "Standalone House",
    ),
    allowNull: false,
  },
  furnished: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  parking: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  floorLevel: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  latitude: {
    type: DataTypes.DECIMAL(10, 8),
    allowNull: false,
  },

  longitude: {
    type: DataTypes.DECIMAL(11, 8),
    allowNull: false,
  },
});
