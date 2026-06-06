const MAX_PAGE_SIZE = 100;

function parsePositiveInteger(value, fallback) {
  const parsed = Number.parseInt(value, 10);

  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function getPaginationParams(query = {}, defaultLimit = 10) {
  const hasPagination = query.page !== undefined || query.limit !== undefined;

  if (!hasPagination) {
    return null;
  }

  return {
    page: parsePositiveInteger(query.page, 1),
    limit: Math.min(parsePositiveInteger(query.limit, defaultLimit), MAX_PAGE_SIZE),
  };
}

function buildPagination(items, page, limit) {
  const totalItems = items.length;
  const totalPages = totalItems > 0 ? Math.ceil(totalItems / limit) : 0;
  const effectivePage = totalPages > 0 ? Math.min(Math.max(page, 1), totalPages) : 1;
  const startIndex = totalItems > 0 ? (effectivePage - 1) * limit : 0;
  const endIndex = totalItems > 0 ? Math.min(startIndex + limit, totalItems) : 0;

  return {
    items: items.slice(startIndex, endIndex),
    pagination: {
      page: effectivePage,
      limit,
      totalItems,
      totalPages,
    },
  };
}

module.exports = {
  buildPagination,
  getPaginationParams,
};
