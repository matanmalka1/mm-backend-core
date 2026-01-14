import express from "express";
import request from "supertest";
import { describe, expect, it, vi } from "vitest";

vi.mock("../../src/controllers/upload.controller.js", () => ({
  uploadFile: (_req, res) => res.status(201).json({ ok: "upload" }),
}));
vi.mock("../../src/middlewares/auth.middleware.js", () => ({
  authenticate: (_req, _res, next) => next(),
  checkPermission: () => (_req, _res, next) => next(),
}));
vi.mock("../../src/middlewares/upload.js", () => ({
  upload: { single: () => (_req, _res, next) => next() },
  handleMulterError: (_req, _res, next) => next(),
}));
vi.mock("../../src/validators/uploadValidate.js", () => ({
  validateUpload: (_req, _res, next) => next(),
}));

import { router } from "../../src/routes/upload.routes.js";

describe("upload routes", () => {
  const app = express();
  app.use(express.json());
  app.use("/api/v1/upload", router);

  it("wires upload", async () => {
    const res = await request(app).post("/api/v1/upload");
    expect(res.statusCode).toBe(201);
    expect(res.body.ok).toBe("upload");
  });
});
