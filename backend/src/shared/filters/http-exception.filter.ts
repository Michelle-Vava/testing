import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger('ErrorHandler');

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal server error';

    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message: typeof message === 'string' ? message : (message as any).message || message,
      error: typeof message === 'object' ? (message as any).error : undefined,
    };

    // In production, do not leak internal server error details
    if (process.env.NODE_ENV === 'production' && status === HttpStatus.INTERNAL_SERVER_ERROR) {
      errorResponse.message = 'Internal server error';
      errorResponse.error = undefined;
    }

    const reset = '\x1b[0m';
    const red = '\x1b[31m';
    const yellow = '\x1b[33m';
    const cyan = '\x1b[36m';
    const methodColor = '\x1b[34m'; // Blue

    if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error(
        `${red}[${status}]${reset} ${methodColor}${request.method}${reset} ${cyan}${request.url}${reset}`,
        exception instanceof Error ? exception.stack : 'Unknown error',
      );
    } else {
      const errorMsg = typeof errorResponse.message === 'object' 
        ? JSON.stringify(errorResponse.message) 
        : errorResponse.message;
      
      // Store error message in locals for the LoggerMiddleware to pick up
      (response as any).locals = (response as any).locals || {};
      (response as any).locals.errorMessage = errorMsg;
    }

    response.status(status).json(errorResponse);
  }
}
