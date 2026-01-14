import express from "express";
import request from "supertest";
import { describe, expect, it } from "vitest";

import { router } from "../../src/routes/health.routes.js";

describe("health routes", () => {
  const app = express();
  app.use("/api/v1", router);

  it("returns health payload", async () => {
    const res = await request(app).get("/api/v1/health");
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });
});
