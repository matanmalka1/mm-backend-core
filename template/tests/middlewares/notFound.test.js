import { describe, expect, it } from "vitest";

import { notFound } from "../../src/middlewares/notFound.js";

describe("notFound middleware", () => {
  it("passes a not found error to next", () => {
    const req = { originalUrl: "/missing" };
    const next = (err) => {
      expect(err.code).toBe("RESOURCE_NOT_FOUND");
      expect(err.message).toMatch(/missing/);
    };

    notFound(req, {}, next);
  });
});
