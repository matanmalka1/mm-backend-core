import fs from "fs/promises";
import path from "path";

import { afterEach, describe, expect, it, vi } from "vitest";

const envPath = path.join(process.cwd(), ".env.test");

const cleanup = async () => {
  try {
    await fs.unlink(envPath);
  } catch {
    // ignore
  }
  delete process.env.TEST_ENV_VALUE;
};

afterEach(async () => {
  await cleanup();
});

describe("env config", () => {
  it("loads .env.test when NODE_ENV=test", async () => {
    await fs.writeFile(envPath, "TEST_ENV_VALUE=loaded\n");
    vi.resetModules();

    await import("../../src/config/env.js");

    expect(process.env.TEST_ENV_VALUE).toBe("loaded");
  });
});
