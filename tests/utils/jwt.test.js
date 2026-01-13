import { afterEach, describe, expect, it, vi } from "vitest";

import {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
} from "../../src/utils/jwt.js";

const originalAccessExpires = process.env.JWT_ACCESS_EXPIRES_IN;

afterEach(() => {
  process.env.JWT_ACCESS_EXPIRES_IN = originalAccessExpires;
  vi.useRealTimers();
});

describe("jwt utils", () => {
  it("generates and verifies access tokens", () => {
    const token = generateAccessToken({ userId: "user-id" });
    const decoded = verifyAccessToken(token);
    expect(decoded.userId).toBe("user-id");
  });

  it("generates and verifies refresh tokens", () => {
    const token = generateRefreshToken({ userId: "user-id" });
    const decoded = verifyRefreshToken(token);
    expect(decoded.userId).toBe("user-id");
    expect(decoded.jti).toBeTruthy();
  });

  it("throws token expired error when access token is expired", () => {
    process.env.JWT_ACCESS_EXPIRES_IN = "1ms";
    vi.useFakeTimers();
    const token = generateAccessToken({ userId: "user-id" });
    vi.advanceTimersByTime(5);

    expect(() => verifyAccessToken(token)).toThrowError(/expired/i);
  });

  it("throws invalid token error for malformed token", () => {
    try {
      verifyAccessToken("not-a-token");
    } catch (error) {
      expect(error.code).toBe("INVALID_TOKEN");
      return;
    }
    throw new Error("Expected verifyAccessToken to throw");
  });
});
