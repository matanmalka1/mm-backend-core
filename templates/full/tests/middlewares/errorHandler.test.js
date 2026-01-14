import express from "express";
import request from "supertest";
import { describe, expect, it } from "vitest";

import { errorHandler } from "../../src/middlewares/errorHandler.js";
import { ApiError } from "../../src/utils/error-factories.js";

describe("errorHandler middleware", () => {
  it("returns ApiError details for known errors", async () => {
    const app = express();
    app.get("/bad", () => {
      throw new ApiError("TEST_ERROR", "Bad request", 400);
    });
    app.use(errorHandler);

    const res = await request(app).get("/bad");
    expect(res.statusCode).toBe(400);
    expect(res.body.error.code).toBe("TEST_ERROR");
  });

  it("normalizes unknown errors", async () => {
    const app = express();
    app.get("/oops", () => {
      const err = new Error("Something broke");
      err.statusCode = 418;
      throw err;
    });
    app.use(errorHandler);

    const res = await request(app).get("/oops");
    expect(res.statusCode).toBe(418);
    expect(res.body.error.code).toBe("SERVER_ERROR");
  });
});
