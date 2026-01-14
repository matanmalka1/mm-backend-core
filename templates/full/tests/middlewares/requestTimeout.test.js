import express from "express";
import request from "supertest";
import { afterEach, describe, expect, it } from "vitest";

import { requestTimeout } from "../../src/middlewares/requestTimeout.js";

describe("requestTimeout middleware", () => {
  const originalTimeout = process.env.REQUEST_TIMEOUT_MS;

  afterEach(() => {
    process.env.REQUEST_TIMEOUT_MS = originalTimeout;
  });

  it("returns 503 when request exceeds timeout", async () => {
    process.env.REQUEST_TIMEOUT_MS = "5";

    const app = express();
    app.use(requestTimeout);
    app.get("/slow", (_req, res) => {
      setTimeout(() => {
        if (!res.headersSent) {
          res.status(200).json({ ok: true });
        }
      }, 50);
    });

    const res = await request(app).get("/slow");
    expect(res.statusCode).toBe(503);
    expect(res.body.error.code).toBe("REQUEST_TIMEOUT");
  });
});
