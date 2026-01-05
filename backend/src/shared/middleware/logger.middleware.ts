import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'crypto';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl } = req;
    const startTime = Date.now();
    
    // Generate Request ID (shortened for readability)
    const requestId = (req.headers['x-request-id'] as string) || randomUUID();
    const shortId = requestId.slice(0, 8);
    res.setHeader('X-Request-ID', requestId);

    res.on('finish', () => {
      const { statusCode } = res;
      const duration = Date.now() - startTime;
      const errorMessage = (res as any).locals?.errorMessage;
      
      // Get user info if authenticated
      const user = (req as any).user;
      const userLabel = user?.email ? `[${user.email}]` : '[Guest]';

      // Use User ID as the trace ID if available to keep it consistent for the same user
      // Otherwise fall back to the unique Request ID
      const traceId = user?.id ? String(user.id).slice(0, 8) : shortId;

      const color = statusCode >= 500 ? '\x1b[31m' : // Red
                   statusCode >= 400 ? '\x1b[33m' : // Yellow
                   statusCode >= 300 ? '\x1b[36m' : // Cyan
                   '\x1b[32m'; // Green
      
      const reset = '\x1b[0m';
      const methodColor = '\x1b[34m'; // Blue
      const dim = '\x1b[2m'; // Dim/Gray
      
      const errorPart = errorMessage ? ` - ${'\x1b[31m'}${errorMessage}${reset}` : '';

      this.logger.log(
        `${dim}[${traceId}]${reset} ${userLabel} ${methodColor}${method}${reset} ${originalUrl} ${color}${statusCode}${reset} +${duration}ms${errorPart}`,
      );
    });

    next();
  }
}
