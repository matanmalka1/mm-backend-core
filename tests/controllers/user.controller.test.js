import { describe, expect, it, vi } from "vitest";

vi.mock("../../src/services/user.service.js", () => ({
  createUser: vi.fn(),
  getAllUsers: vi.fn(),
  getUserById: vi.fn(),
  updateUser: vi.fn(),
  deleteUser: vi.fn(),
}));

import {
  createUser,
  deleteUser,
  getAllUsers,
  getUserById,
  updateUser,
} from "../../src/controllers/user.controller.js";
import * as userService from "../../src/services/user.service.js";
import { buildTestRes } from "../helpers.js";

describe("user controller", () => {
  it("creates user", async () => {
    userService.createUser.mockResolvedValue({ id: "1" });
    const req = { body: { email: "a@b.com" } };
    const res = buildTestRes();

    await createUser(req, res);

    expect(res.statusCode).toBe(201);
    expect(res.payload.data.user.id).toBe("1");
  });

  it("gets all users", async () => {
    userService.getAllUsers.mockResolvedValue({ users: [] });
    const req = { query: {} };
    const res = buildTestRes();

    await getAllUsers(req, res);

    expect(res.payload.data.users).toEqual([]);
  });

  it("gets user by id", async () => {
    userService.getUserById.mockResolvedValue({ id: "1" });
    const req = { params: { id: "1" } };
    const res = buildTestRes();

    await getUserById(req, res);

    expect(res.payload.data.user.id).toBe("1");
  });

  it("updates user", async () => {
    userService.updateUser.mockResolvedValue({ id: "1", firstName: "New" });
    const req = { params: { id: "1" }, body: { firstName: "New" } };
    const res = buildTestRes();

    await updateUser(req, res);

    expect(res.payload.data.user.firstName).toBe("New");
  });

  it("deletes user", async () => {
    userService.deleteUser.mockResolvedValue();
    const req = { params: { id: "1" } };
    const res = buildTestRes();

    await deleteUser(req, res);

    expect(res.payload.message).toMatch(/deleted/i);
  });
});
