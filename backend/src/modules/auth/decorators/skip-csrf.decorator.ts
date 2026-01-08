import { SetMetadata } from '@nestjs/common';

/**
 * Decorator to skip CSRF protection on specific routes
 * 
 * Use for special cases like:
 * - OAuth callback endpoints
 * - Webhook endpoints with other verification
 * - Public endpoints that don't modify state
 * 
 * @example
 * ```typescript
 * @Post('webhook')
 * @SkipCsrf()
 * async handleWebhook() { ... }
 * ```
 */
export const SkipCsrf = () => SetMetadata('skipCsrf', true);
