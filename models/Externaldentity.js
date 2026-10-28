import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import User from "./User.js";

const ExternalIdentity = sequelize.define(
  "ExternalIdentity",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    provider: {
      type: DataTypes.ENUM("google", "apple"),
      allowNull: false,
    },
    providerUserId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
      onDelete: "CASCADE",
    },
  },
  {
    indexes: [
      {
        unique: true,
        fields: ["provider", "providerUserId"],
      },
    ],
  },
);

export default ExternalIdentity;
