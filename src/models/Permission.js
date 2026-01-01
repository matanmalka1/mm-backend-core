import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/db.js";

export const Permission = sequelize.define("Permission", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: { notEmpty: true },
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  resource: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: { notEmpty: true },
  },
  action: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: { notEmpty: true },
  },
});
