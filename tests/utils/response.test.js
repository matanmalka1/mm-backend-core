import { describe, expect, it } from "vitest";

import { errorResponse, successResponse } from "../../src/utils/response.js";

const createRes = () => {
  const res = {
    statusCode: 200,
    payload: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(body) {
      this.payload = body;
      return this;
    },
  };
  return res;
};

describe("response utils", () => {
  it("builds success response", () => {
    const res = createRes();
    successResponse(res, { ok: true }, "done", 201);

    expect(res.statusCode).toBe(201);
    expect(res.payload.success).toBe(true);
    expect(res.payload.data.ok).toBe(true);
  });

  it("builds error response", () => {
    const res = createRes();
    errorResponse(res, "ERROR", "Bad", 400, { fields: [] });

    expect(res.statusCode).toBe(400);
    expect(res.payload.success).toBe(false);
    expect(res.payload.error.code).toBe("ERROR");
  });
});
