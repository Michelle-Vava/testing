import { PaginationDto } from '../dto/pagination.dto';

/**
 * Paginated result structure
 */
export interface PaginatedResult<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

/**
 * Create a paginated result from data and pagination info
 * 
 * @param data - Array of items for current page
 * @param total - Total count of all items matching query
 * @param pagination - Pagination parameters
 * @returns Standardized paginated result
 * 
 * @example
 * ```typescript
 * const vehicles = await this.prisma.vehicle.findMany({
 *   where: { ownerId },
 *   skip: paginationDto.skip,
 *   take: paginationDto.take,
 * });
 * const total = await this.prisma.vehicle.count({ where: { ownerId } });
 * return paginate(vehicles, total, paginationDto);
 * ```
 */
export function paginate<T>(
  data: T[],
  total: number,
  pagination: PaginationDto,
): PaginatedResult<T> {
  const totalPages = Math.ceil(total / pagination.limit);
  
  return {
    data,
    meta: {
      total,
      page: pagination.page,
      limit: pagination.limit,
      totalPages,
      hasNextPage: pagination.page < totalPages,
      hasPrevPage: pagination.page > 1,
    },
  };
}

/**
 * Create Prisma skip/take parameters from pagination DTO
 * 
 * @param pagination - Pagination parameters
 * @returns Object with skip and take for Prisma queries
 */
export function getPrismaPageParams(pagination: PaginationDto): { skip: number; take: number } {
  return {
    skip: pagination.skip,
    take: pagination.take,
  };
}
