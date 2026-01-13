import { describe, expect, it } from "vitest";

import { API_ERROR_CODES } from "../../src/constants/api-error-codes.js";

describe("api error codes", () => {
  it("contains expected codes", () => {
    expect(API_ERROR_CODES.AUTHENTICATION_ERROR).toBe("AUTHENTICATION_ERROR");
    expect(API_ERROR_CODES.SERVER_ERROR).toBe("SERVER_ERROR");
  });
});
