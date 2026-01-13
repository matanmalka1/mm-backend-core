import { describe, expect, it } from "vitest";

import { uploadFile } from "../../src/controllers/upload.controller.js";
import { buildTestRes } from "../utils/test-response.js";

describe("upload controller", () => {
  it("returns file info", async () => {
    const req = {
      file: {
        filename: "file.pdf",
        originalname: "file.pdf",
        mimetype: "application/pdf",
        size: 10,
      },
    };
    const res = buildTestRes();

    await uploadFile(req, res);

    expect(res.statusCode).toBe(201);
    expect(res.payload.data.file.filename).toBe("file.pdf");
  });
});
