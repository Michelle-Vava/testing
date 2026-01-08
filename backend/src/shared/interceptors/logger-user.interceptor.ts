import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { PinoLogger } from 'nestjs-pino';

@Injectable()
export class LoggerUserInterceptor implements NestInterceptor {
  constructor(private readonly logger: PinoLogger) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    // req.user is populated by AuthGuard (Passport)
    if (req.user && req.user.sub) {
      this.logger.assign({ userId: req.user.sub });
    }
    return next.handle();
  }
}
