import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const PropertyMedia = sequelize.define("PropertyMedia", {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  src: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  mediaType: {
    type: DataTypes.ENUM("picture", "video"),
    allowNull: false,
    defaultValue: "picture",
  },
  displayOrder: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
});

export default PropertyMedia;
