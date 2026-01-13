import request from "supertest";
import { describe, expect, it } from "vitest";

import { app } from "../src/app.js";

describe("GET /api/v1/health", () => {
  it("returns 200 and status", async () => {
    const res = await request(app).get("/api/v1/health");
    console.log(res.statusCode, res.body || res.text);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });
});
