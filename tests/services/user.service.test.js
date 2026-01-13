import { describe, expect, it } from "vitest";

import { Role } from "../../src/models/Role.js";
import { User } from "../../src/models/User.js";
import { comparePassword } from "../../src/utils/password.js";
import {
  createUser,
  deleteUser,
  getAllUsers,
  getUserById,
  updateUser,
} from "../../src/services/user.service.js";

import { hashPassword } from "../../src/utils/password.js";

describe("user service", () => {
  it("creates a user and sanitizes password", async () => {
    const { userRoleId } = globalThis.__roles;
    const user = await createUser({
      email: "service-create@example.com",
      password: "Password123!",
      firstName: "Service",
      lastName: "Create",
      roleId: userRoleId,
    });

    expect(user.email).toBe("service-create@example.com");
    expect(user.password).toBeUndefined();
  });

  it("rejects duplicate emails", async () => {
    const { userRoleId } = globalThis.__roles;
    await User.create({
      email: "duplicate@example.com",
      password: await hashPassword("Password123!"),
      firstName: "Dup",
      lastName: "User",
      role: userRoleId,
    });

    await expect(
      createUser({
        email: "duplicate@example.com",
        password: "Password123!",
        firstName: "Dup",
        lastName: "User",
        roleId: userRoleId,
      })
    ).rejects.toThrow(/already exists/i);
  });

  it("updates user fields and hashes password", async () => {
    const { userRoleId } = globalThis.__roles;
    const user = await User.create({
      email: "update@example.com",
      password: await hashPassword("Password123!"),
      firstName: "Old",
      lastName: "Name",
      role: userRoleId,
    });

    const updated = await updateUser(user._id.toString(), {
      firstName: "New",
      password: "Password456!",
    });

    expect(updated.firstName).toBe("New");

    const stored = await User.findById(user._id).select("+password");
    const matches = await comparePassword("Password456!", stored.password);
    expect(matches).toBe(true);
  });

  it("returns paginated users", async () => {
    const { userRoleId } = globalThis.__roles;
    await User.create({
      email: "list-1@example.com",
      password: await hashPassword("Password123!"),
      firstName: "One",
      lastName: "User",
      role: userRoleId,
    });

    const result = await getAllUsers({ page: "1", limit: "10" });
    expect(Array.isArray(result.users)).toBe(true);
    expect(result.totalCount).toBeGreaterThan(0);
  });

  it("gets and deletes a user", async () => {
    const { userRoleId } = globalThis.__roles;
    const user = await User.create({
      email: "delete@example.com",
      password: await hashPassword("Password123!"),
      firstName: "Delete",
      lastName: "User",
      role: userRoleId,
    });

    const loaded = await getUserById(user._id.toString());
    expect(loaded.email).toBe("delete@example.com");

    await deleteUser(user._id.toString());
    const found = await User.findById(user._id);
    expect(found).toBeNull();
  });

  it("updates role using roleId", async () => {
    const { userRoleId } = globalThis.__roles;
    const newRole = await Role.create({ name: "manager", description: "" });

    const user = await User.create({
      email: "role-update@example.com",
      password: await hashPassword("Password123!"),
      firstName: "Role",
      lastName: "User",
      role: userRoleId,
    });

    const updated = await updateUser(user._id.toString(), {
      roleId: newRole._id.toString(),
    });

    expect(updated.role.toString()).toBe(newRole._id.toString());
  });
});
