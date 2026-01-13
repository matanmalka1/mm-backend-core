import { describe, expect, it, vi } from "vitest";

import { asyncHandler } from "../../src/utils/asyncHandler.js";

describe("asyncHandler", () => {
  it("forwards errors", async () => {
    const error = new Error("boom");
    const handler = asyncHandler(async () => {
      throw error;
    });

    const next = vi.fn();
    await handler({}, {}, next);

    expect(next).toHaveBeenCalledWith(error);
  });

  it("calls handler", async () => {
    const handlerFn = vi.fn(async () => {});
    const handler = asyncHandler(handlerFn);

    const next = vi.fn();
    await handler({}, {}, next);

    expect(handlerFn).toHaveBeenCalled();
  });
});
