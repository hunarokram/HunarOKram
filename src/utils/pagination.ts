import type { PaginationMeta } from '../types/api.types';

/**
 * Parses pagination parameters and returns sanitized values.
 */
export function parsePagination(params: { page?: string | number; pageSize?: string | number }): { page: number; pageSize: number; skip: number } {
  let page = Number(params.page);
  if (isNaN(page) || page < 1) page = 1;

  let pageSize = Number(params.pageSize);
  if (isNaN(pageSize) || pageSize < 1) pageSize = 20;
  if (pageSize > 100) pageSize = 100;

  const skip = (page - 1) * pageSize;

  return { page, pageSize, skip };
}

/**
 * Builds pagination metadata based on current state and total count.
 */
export function buildPaginationMeta(params: { page: number; pageSize: number; totalCount: number }): PaginationMeta {
  const { page, pageSize, totalCount } = params;
  const totalPages = Math.ceil(totalCount / pageSize);

  return {
    page,
    pageSize,
    totalCount,
    totalPages,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1,
  };
}
