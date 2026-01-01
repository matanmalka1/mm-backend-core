import { Sequelize } from "sequelize";
import path from "path";

export const sequelize = new Sequelize({
  dialect: process.env.DB_DIALECT || "sqlite",
  storage: process.env.DB_STORAGE
    ? path.resolve(process.env.DB_STORAGE)
    : path.resolve(process.cwd(), "database.sqlite"),
  logging: false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  define: {
    timestamps: true,
    freezeTableName: true,
  },
});

export const testConnection = async () => {
  await sequelize.authenticate();
  if (process.env.NODE_ENV !== "production") {
    await sequelize.sync();
  }
  return true;
};
