import { afterEach, describe, expect, it } from "vitest";

import { buildCookieOptions } from "../../src/utils/cookie-options.js";

const originalSecure = process.env.COOKIE_SECURE;
const originalSameSite = process.env.COOKIE_SAME_SITE;
const originalNodeEnv = process.env.NODE_ENV;

afterEach(() => {
  process.env.COOKIE_SECURE = originalSecure;
  process.env.COOKIE_SAME_SITE = originalSameSite;
  process.env.NODE_ENV = originalNodeEnv;
});

describe("cookie options", () => {
  it("respects env overrides", () => {
    process.env.COOKIE_SECURE = "true";
    process.env.COOKIE_SAME_SITE = "strict";

    const options = buildCookieOptions();
    expect(options.secure).toBe(true);
    expect(options.sameSite).toBe("strict");
  });

  it("defaults to production secure when COOKIE_SECURE not set", () => {
    delete process.env.COOKIE_SECURE;
    process.env.NODE_ENV = "production";

    const options = buildCookieOptions();
    expect(options.secure).toBe(true);
  });

  it("merges overrides", () => {
    const options = buildCookieOptions({ maxAge: 123, path: "/auth" });
    expect(options.maxAge).toBe(123);
    expect(options.path).toBe("/auth");
  });
});
