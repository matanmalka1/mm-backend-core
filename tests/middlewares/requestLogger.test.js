import express from "express";
import request from "supertest";
import { describe, expect, it } from "vitest";

import { requestLogger } from "../../src/middlewares/requestLogger.js";

describe("requestLogger middleware", () => {
  it("does not block requests", async () => {
    const app = express();
    app.use(requestLogger);
    app.get("/", (_req, res) => res.json({ ok: true }));

    const res = await request(app).get("/");
    expect(res.statusCode).toBe(200);
    expect(res.body.ok).toBe(true);
  });
});
