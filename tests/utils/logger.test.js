import { describe, expect, it } from "vitest";

import { logger, stream } from "../../src/utils/logger.js";

describe("logger", () => {
  it("exposes transports", () => {
    expect(logger.transports.length).toBeGreaterThan(0);
  });

  it("stream.write forwards to logger", () => {
    expect(() => stream.write("test log")).not.toThrow();
  });
});
