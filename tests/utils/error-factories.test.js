import { describe, expect, it } from "vitest";

import {
  ApiError,
  duplicateResourceError,
  validationErrorWithDetails,
} from "../../src/utils/error-factories.js";

describe("error factories", () => {
  it("builds ApiError with status and details", () => {
    const details = [{ field: "email", message: "Invalid" }];
    const error = validationErrorWithDetails(details);
    expect(error).toBeInstanceOf(ApiError);
    expect(error.statusCode).toBe(400);
    expect(error.details.fields).toEqual(details);
  });

  it("duplicateResourceError sets code and message", () => {
    const error = duplicateResourceError("User", "email");
    expect(error.code).toBe("DUPLICATE_RESOURCE");
    expect(error.message).toMatch(/email/);
  });
});
