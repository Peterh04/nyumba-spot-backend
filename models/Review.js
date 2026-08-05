import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Review = sequelize.define("Review", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  comment: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  rating: {
    type: DataTypes.SMALLINT,
    allowNull: false,
    validate: {
      min: 1,
      max: 5,
    },
  },
});

export default Review;
