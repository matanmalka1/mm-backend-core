export const parsePaginationParams = (query, options = {}) => {
  const { defaultPage = 1, defaultLimit = 10, maxLimit = 100 } = options;

  const page = Math.max(1, parseInt(query.page, 10) || defaultPage);
  const limit = Math.min(
    maxLimit,
    Math.max(1, parseInt(query.limit, 10) || defaultLimit)
  );
  const skip = (page - 1) * limit;

  return { page, limit, skip };
};

export const buildPaginationMeta = (page, limit, totalCount) => ({
  page,
  limit,
  totalPages: Math.ceil(totalCount / limit),
  totalCount,
});
