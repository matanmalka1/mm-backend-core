import { describe, expect, it } from "vitest";

import { comparePassword, hashPassword } from "../../src/utils/password.js";

describe("password utils", () => {
  it("hashes and compares passwords", async () => {
    const hash = await hashPassword("Password123!");
    expect(hash).not.toBe("Password123!");

    const matches = await comparePassword("Password123!", hash);
    const mismatch = await comparePassword("WrongPassword!", hash);

    expect(matches).toBe(true);
    expect(mismatch).toBe(false);
  });
});
