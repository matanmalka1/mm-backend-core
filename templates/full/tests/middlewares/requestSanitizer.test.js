import { describe, expect, it } from "vitest";

import { requestSanitizer } from "../../src/middlewares/requestSanitizer.js";

describe("requestSanitizer middleware", () => {
  it("removes prohibited keys", () => {
    const req = {
      body: { "$gt": 1, safe: "ok" },
      params: { "a.b": 1, id: "123" },
      headers: { "$ne": 2, host: "localhost" },
      query: { "$or": "x", search: "y" },
    };

    requestSanitizer(req, {}, () => {});

    expect(req.body.$gt).toBeUndefined();
    expect(req.params["a.b"]).toBeUndefined();
    expect(req.headers.$ne).toBeUndefined();
    expect(req.query.$or).toBeUndefined();
    expect(req.body.safe).toBe("ok");
  });
});
