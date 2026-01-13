import { describe, expect, it } from "vitest";

import { errorResponse, successResponse } from "../../src/utils/response.js";

import { buildTestRes } from "./test-response.js";

describe("response utils", () => {
  it("builds success response", () => {
    const res = buildTestRes();
    successResponse(res, { ok: true }, "done", 201);

    expect(res.statusCode).toBe(201);
    expect(res.payload.success).toBe(true);
    expect(res.payload.data.ok).toBe(true);
  });

  it("builds error response", () => {
    const res = buildTestRes();
    errorResponse(res, "ERROR", "Bad", 400, { fields: [] });

    expect(res.statusCode).toBe(400);
    expect(res.payload.success).toBe(false);
    expect(res.payload.error.code).toBe("ERROR");
  });
});
