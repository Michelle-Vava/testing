import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { performance } from 'node:perf_hooks';
import { STATUS_CODES } from 'http';

/**
 * HTTP Logging Interceptor
 * 
 * Measures request duration and logs HTTP requests/responses with proper timing.
 * Replaces the broken pino-http responseTime logic that was causing NaN errors.
 */
@Injectable()
export class HttpLoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const res = context.switchToHttp().getResponse();

    const start = performance.now();

    return next.handle().pipe(
      tap({
        next: () => {
          const ms = performance.now() - start;
          const s = (ms / 1000).toFixed(3);
          const userId = req.user?.sub ?? 'guest';
          const requestId = req.id?.substring(0, 8) ?? 'unknown';
          const method = req.method;
          const url = req.url;
          const statusCode = res.statusCode;
          const statusMessage = STATUS_CODES[statusCode] || 'Unknown';

          // Skip health check logs to reduce noise
          if (req.url?.includes('/health')) return;

          // Color code by duration
          const durationColor = ms > 1000 ? '\x1b[31m' : ms > 500 ? '\x1b[33m' : '\x1b[32m';
          
          // Color code by status
          const statusColor = statusCode >= 500 ? '\x1b[31m' : statusCode >= 400 ? '\x1b[33m' : '\x1b[32m';

          // Single-line log format
          console.log(`\x1b[36m${new Date().toISOString()}\x1b[0m \x1b[35mreq:${requestId}\x1b[0m ${method} ${url} → ${statusColor}${statusCode} ${statusMessage}\x1b[0m ${durationColor}${s}s\x1b[0m \x1b[90muser=${userId}\x1b[0m`);
        },
        error: (err) => {
          const ms = performance.now() - start;
          const s = (ms / 1000).toFixed(3);
          const userId = req.user?.sub ?? 'guest';
          const requestId = req.id?.substring(0, 8) ?? 'unknown';
          const statusCode = res.statusCode ?? 500; // Default to 500 if undefined
          const statusMessage = STATUS_CODES[statusCode] || 'Internal Server Error';

          // Single-line error log format
          console.log(`\x1b[31m${new Date().toISOString()}\x1b[0m \x1b[35mreq:${requestId}\x1b[0m ${req.method} ${req.url} → \x1b[31m${statusCode} ${statusMessage}\x1b[0m \x1b[31m${s}s\x1b[0m \x1b[90muser=${userId}\x1b[0m \x1b[31mError: ${err?.message ?? err}\x1b[0m`);
        },
      }),
    );
  }
}
