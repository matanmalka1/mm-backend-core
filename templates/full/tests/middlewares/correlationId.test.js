import express from "express";
import request from "supertest";
import { describe, expect, it } from "vitest";

import { correlationId } from "../../src/middlewares/correlationId.js";

describe("correlationId middleware", () => {
  const createApp = () => {
    const app = express();
    app.use(correlationId);
    app.get("/", (req, res) => {
      res.json({ correlationId: req.correlationId });
    });
    return app;
  };

  it("adds correlation id when missing", async () => {
    const app = createApp();
    const res = await request(app).get("/");

    expect(res.headers["x-correlation-id"]).toBeTruthy();
    expect(res.body.correlationId).toBe(res.headers["x-correlation-id"]);
  });

  it("reuses correlation id from header", async () => {
    const app = createApp();
    const res = await request(app)
      .get("/")
      .set("x-correlation-id", "test-id");

    expect(res.headers["x-correlation-id"]).toBe("test-id");
    expect(res.body.correlationId).toBe("test-id");
  });
});
