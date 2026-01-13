import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { beforeAll, afterAll, beforeEach } from "vitest";

import { RefreshToken } from "../src/models/RefreshToken.js";
import { Role } from "../src/models/Role.js";
import { User } from "../src/models/User.js";
import { ensurePermissions } from "../src/utils/permission-utils.js";

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
  const basePort = +process.env.MONGO_TEST_PORT || 37017;
  const poolOffset = Number(
    process.env.VITEST_POOL_ID ?? process.env.VITEST_WORKER_ID ?? 0
  );
  const port = basePort + poolOffset;

  mongoServer = await MongoMemoryServer.create({
    instance: {
      ip: "127.0.0.1",
      port,
      portGeneration: false,
    },
  });
  process.env.MONGODB_URI = mongoServer.getUri();

  await mongoose.connect(process.env.MONGODB_URI);

  const adminRole =
    (await Role.findOne({ name: "admin" })) ||
    (await Role.create({ name: "admin", description: "admin role" }));
  const userRole =
    (await Role.findOne({ name: "user" })) ||
    (await Role.create({ name: "user", description: "user role" }));

  const requiredPermissions = [
    { name: "users.update", resource: "users", action: "update" },
    { name: "users.delete", resource: "users", action: "delete" },
  ];
  const permissionMap = await ensurePermissions(requiredPermissions);
  const permissionIds = Object.values(permissionMap).map((perm) => perm._id);

  adminRole.permissions = permissionIds;
  await adminRole.save();

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
