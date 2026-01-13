import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { beforeAll, afterAll, beforeEach } from "vitest";

import { RefreshToken } from "../src/models/RefreshToken.js";
import { Role } from "../src/models/Role.js";
import { User } from "../src/models/User.js";

let mongoServer;

const ensureEnv = () => {
  process.env.NODE_ENV = "test";
  process.env.JWT_ACCESS_SECRET =
    process.env.JWT_ACCESS_SECRET || "test-access-secret";
  process.env.JWT_REFRESH_SECRET =
    process.env.JWT_REFRESH_SECRET || "test-refresh-secret";
  process.env.JWT_ACCESS_EXPIRES_IN =
    process.env.JWT_ACCESS_EXPIRES_IN || "15m";
  process.env.JWT_REFRESH_EXPIRES_IN =
    process.env.JWT_REFRESH_EXPIRES_IN || "7d";
  process.env.COOKIE_SECURE = "false";
  process.env.COOKIE_SAME_SITE = "lax";
  process.env.CORS_ORIGIN = "http://localhost:5173";
  process.env.MAX_FILE_SIZE = "5242880";
  process.env.ALLOWED_FILE_TYPES =
    "image/jpeg,image/png,image/gif,application/pdf";
};

beforeAll(async () => {
  ensureEnv();
  mongoServer = await MongoMemoryServer.create();
  process.env.MONGODB_URI = mongoServer.getUri();

  await mongoose.connect(process.env.MONGODB_URI);

  const adminRole =
    (await Role.findOne({ name: "admin" })) ||
    (await Role.create({ name: "admin", description: "admin role" }));
  const userRole =
    (await Role.findOne({ name: "user" })) ||
    (await Role.create({ name: "user", description: "user role" }));

  globalThis.__roles = {
    adminRoleId: adminRole._id.toString(),
    userRoleId: userRole._id.toString(),
  };
});

beforeEach(async () => {
  await Promise.all([User.deleteMany({}), RefreshToken.deleteMany({})]);
});

afterAll(async () => {
  await mongoose.disconnect();
  if (mongoServer) {
    await mongoServer.stop();
  }
});
