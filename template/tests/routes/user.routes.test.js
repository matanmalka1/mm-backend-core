import express from "express";
import request from "supertest";
import { describe, expect, it, vi } from "vitest";

vi.mock("../../src/controllers/user.controller.js", () => ({
  createUser: (_req, res) => res.status(201).json({ ok: "create" }),
  getAllUsers: (_req, res) => res.status(200).json({ ok: "list" }),
  getUserById: (_req, res) => res.status(200).json({ ok: "get" }),
  updateUser: (_req, res) => res.status(200).json({ ok: "update" }),
  deleteUser: (_req, res) => res.status(200).json({ ok: "delete" }),
}));
vi.mock("../../src/middlewares/auth.middleware.js", () => ({
  authenticate: (_req, _res, next) => next(),
  authorize: () => (_req, _res, next) => next(),
  checkPermission: () => (_req, _res, next) => next(),
}));
vi.mock("../../src/validators/userValidate.js", () => ({
  validateCreateUser: (_req, _res, next) => next(),
  validateUpdateUser: (_req, _res, next) => next(),
  validateUserIdParam: (_req, _res, next) => next(),
  validateUserListQuery: (_req, _res, next) => next(),
}));

import { router } from "../../src/routes/user.routes.js";

describe("user routes", () => {
  const app = express();
  app.use(express.json());
  app.use("/api/v1/users", router);

  it("wires create", async () => {
    const res = await request(app).post("/api/v1/users");
    expect(res.statusCode).toBe(201);
    expect(res.body.ok).toBe("create");
  });

  it("wires list", async () => {
    const res = await request(app).get("/api/v1/users");
    expect(res.body.ok).toBe("list");
  });

  it("wires get by id", async () => {
    const res = await request(app).get("/api/v1/users/123");
    expect(res.body.ok).toBe("get");
  });
});
