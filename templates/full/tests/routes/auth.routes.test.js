import express from "express";
import request from "supertest";
import { describe, expect, it, vi } from "vitest";

vi.mock("../../src/controllers/auth.controller.js", () => ({
  register: (_req, res) => res.status(200).json({ ok: "register" }),
  login: (_req, res) => res.status(200).json({ ok: "login" }),
  forgotPassword: (_req, res) => res.status(200).json({ ok: "forgot" }),
  resetPassword: (_req, res) => res.status(200).json({ ok: "reset" }),
  logout: (_req, res) => res.status(200).json({ ok: "logout" }),
  refresh: (_req, res) => res.status(200).json({ ok: "refresh" }),
  me: (_req, res) => res.status(200).json({ ok: "me" }),
  changePassword: (_req, res) => res.status(200).json({ ok: "change" }),
  updateProfile: (_req, res) => res.status(200).json({ ok: "profile" }),
}));
vi.mock("../../src/middlewares/auth.middleware.js", () => ({
  authenticate: (_req, _res, next) => next(),
}));
vi.mock("../../src/middlewares/rateLimiter.js", () => ({
  authRateLimiter: (_req, _res, next) => next(),
  passwordChangeRateLimiter: (_req, _res, next) => next(),
  refreshRateLimiter: (_req, _res, next) => next(),
  forgotPasswordRateLimiter: (_req, _res, next) => next(),
}));
vi.mock("../../src/validators/authValidate.js", () => ({
  validateRegister: (_req, _res, next) => next(),
  validateLogin: (_req, _res, next) => next(),
  validateChangePassword: (_req, _res, next) => next(),
  validateUpdateProfile: (_req, _res, next) => next(),
  validateForgotPassword: (_req, _res, next) => next(),
  validateResetPassword: (_req, _res, next) => next(),
}));

import { router } from "../../src/routes/auth.routes.js";

describe("auth routes", () => {
  const app = express();
  app.use(express.json());
  app.use("/api/v1/auth", router);

  it("wires register", async () => {
    const res = await request(app).post("/api/v1/auth/register");
    expect(res.body.ok).toBe("register");
  });

  it("wires login", async () => {
    const res = await request(app).post("/api/v1/auth/login");
    expect(res.body.ok).toBe("login");
  });

  it("wires me", async () => {
    const res = await request(app).get("/api/v1/auth/me");
    expect(res.body.ok).toBe("me");
  });
});
