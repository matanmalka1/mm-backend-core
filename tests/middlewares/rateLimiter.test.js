import express from "express";
import request from "supertest";
import { describe, expect, it, vi } from "vitest";

describe("rateLimiter middleware", () => {
  it("limits requests after max", async () => {
    process.env.RATE_LIMIT_MAX_REQUESTS = "1";
    process.env.RATE_LIMIT_WINDOW_MS = "1000";

    vi.resetModules();
    const { globalRateLimiter } = await import(
      "../../src/middlewares/rateLimiter.js"
    );

    const app = express();
    app.use(globalRateLimiter);
    app.get("/", (_req, res) => res.json({ ok: true }));

    const first = await request(app).get("/");
    const second = await request(app).get("/");

    expect(first.statusCode).toBe(200);
    expect(second.statusCode).toBe(429);
  });
});
