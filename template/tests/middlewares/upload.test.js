import multer from "multer";
import { describe, expect, it } from "vitest";

import { handleMulterError } from "../../src/middlewares/upload.js";

const buildNext = () => {
  const calls = [];
  const next = (arg) => calls.push(arg);
  next.calls = calls;
  return next;
};

describe("upload middleware", () => {
  it("translates file size errors", () => {
    const err = new multer.MulterError("LIMIT_FILE_SIZE");
    const next = buildNext();

    handleMulterError(err, {}, {}, next);

    expect(next.calls[0].code).toBe("FILE_TOO_LARGE");
  });

  it("passes through non-multer errors", () => {
    const err = new Error("boom");
    const next = buildNext();

    handleMulterError(err, {}, {}, next);

    expect(next.calls[0]).toBe(err);
  });
});
