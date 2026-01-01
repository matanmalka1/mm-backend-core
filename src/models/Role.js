import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/db.js";

export const Role = sequelize.define("Role", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});
