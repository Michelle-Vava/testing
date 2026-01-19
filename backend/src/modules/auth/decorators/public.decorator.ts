import { SetMetadata } from '@nestjs/common';

/**
 * Decorator to mark routes as public (no auth required)
 */
export const Public = () => SetMetadata('isPublic', true);
