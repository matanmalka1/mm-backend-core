import fs from "fs/promises";
import path from "path";

import { describe, expect, it } from "vitest";

import { validateUpload } from "../../src/validators/uploadValidate.js";

const fixturePath = path.join(
  process.cwd(),
  "tests",
  "fixtures",
  "sample.pdf"
);
const uploadsDir = path.join(process.cwd(), "uploads");

const runMiddleware = async (file) =>
  new Promise((resolve) => {
    validateUpload({ file }, {}, (err) => resolve(err));
  });

describe("upload validator", () => {
  it("accepts valid file type", async () => {
    const tempPath = path.join(process.cwd(), "uploads", "temp-valid.pdf");
    await fs.mkdir(uploadsDir, { recursive: true });
    await fs.copyFile(fixturePath, tempPath);

    const err = await runMiddleware({
      path: tempPath,
      mimetype: "application/pdf",
    });

    expect(err).toBeUndefined();
    await fs.unlink(tempPath);
  });

  it("rejects mismatched file type and deletes file", async () => {
    const tempPath = path.join(process.cwd(), "uploads", "temp-invalid.pdf");
    await fs.mkdir(uploadsDir, { recursive: true });
    await fs.copyFile(fixturePath, tempPath);

    const err = await runMiddleware({
      path: tempPath,
      mimetype: "image/png",
    });

    expect(err.code).toBe("VALIDATION_ERROR");

    await expect(fs.stat(tempPath)).rejects.toThrow();
  });
});
