import { describe, expect, it, vi } from "vitest";

vi.mock("../src/config/db.js", () => ({
  connectDB: vi.fn(async () => {}),
  disconnectDB: vi.fn(async () => {}),
}));
vi.mock("../src/utils/permission-utils.js", () => ({
  ensurePermissions: vi.fn(async (permissions) =>
    permissions.reduce((acc, perm) => {
      acc[perm.name] = { _id: perm.name };
      return acc;
    }, {})
  ),
}));
vi.mock("../src/models/Role.js", () => {
  const buildRole = (data) => ({
    ...data,
    _id: data.name,
    save: vi.fn(async () => {}),
  });

  return {
    Role: {
      findOne: vi.fn(async () => null),
      create: vi.fn(async (data) => buildRole(data)),
    },
  };
});
vi.mock("../src/models/User.js", () => ({
  User: {
    findOne: vi.fn(async () => null),
    create: vi.fn(async (data) => data),
  },
}));
vi.mock("bcrypt", () => ({
  default: { hash: vi.fn(async () => "hashed") },
}));

import { connectDB, disconnectDB } from "../src/config/db.js";
import { Role } from "../src/models/Role.js";
import { User } from "../src/models/User.js";
import { ensurePermissions } from "../src/utils/permission-utils.js";


describe("seed script", () => {
  it("runs seeding flow", async () => {
    vi.resetModules();
    vi.clearAllMocks();
    const exitSpy = vi.spyOn(process, "exit").mockImplementation(() => {});
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    await import("../src/seed.js");

    for (let i = 0; i < 5 && !ensurePermissions.mock.calls.length; i += 1) {
      await new Promise((resolve) => setTimeout(resolve, 0));
    }

    expect(connectDB).toHaveBeenCalled();
    expect(ensurePermissions).toHaveBeenCalled();
    expect(Role.create).toHaveBeenCalled();
    expect(User.create).toHaveBeenCalled();
    expect(disconnectDB).toHaveBeenCalled();

    exitSpy.mockRestore();
    logSpy.mockRestore();
  });
});
