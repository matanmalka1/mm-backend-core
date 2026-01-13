import { describe, expect, it } from "vitest";

import { mapItemWithBook } from "../../src/utils/normalize.js";

describe("normalize utils", () => {
  it("maps book info with id", () => {
    const item = {
      book: { _id: "abc123" },
      quantity: 2,
    };

    const result = mapItemWithBook(item);
    expect(result.bookId).toBe("abc123");
    expect(result.quantity).toBe(2);
  });
});
