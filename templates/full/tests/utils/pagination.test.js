import { describe, expect, it } from "vitest";

import {
  buildPaginationMeta,
  parsePaginationParams,
} from "../../src/utils/pagination.js";

describe("pagination utils", () => {
  it("parses page/limit with bounds", () => {
    const result = parsePaginationParams({ page: "2", limit: "500" }, {
      defaultLimit: 10,
      maxLimit: 100,
    });

    expect(result.page).toBe(2);
    expect(result.limit).toBe(100);
    expect(result.skip).toBe(100);
  });

  it("builds pagination meta", () => {
    const meta = buildPaginationMeta(2, 10, 35);
    expect(meta.totalPages).toBe(4);
    expect(meta.totalCount).toBe(35);
  });
});
