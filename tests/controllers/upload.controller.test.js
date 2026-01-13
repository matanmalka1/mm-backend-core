import { describe, expect, it } from "vitest";

import { uploadFile } from "../../src/controllers/upload.controller.js";

const buildRes = () => {
  const res = {
    statusCode: 200,
    payload: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(body) {
      this.payload = body;
      return this;
    },
  };
  return res;
};

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
    const res = buildRes();

    await uploadFile(req, res);

    expect(res.statusCode).toBe(201);
    expect(res.payload.data.file.filename).toBe("file.pdf");
  });
});
