import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { LoggerModule } from 'nestjs-pino';
import { randomUUID } from 'node:crypto';
import { DatabaseModule } from './infrastructure/database/database.module';
import { SharedModule } from './shared/shared.module';
import { LoggerUserInterceptor } from './shared/interceptors/logger-user.interceptor';
import { HttpLoggingInterceptor } from './shared/interceptors/http-logging.interceptor';
import { AuthModule } from './modules/auth/auth.module';
import { VehiclesModule } from './modules/vehicles/vehicles.module';
import { RequestsModule } from './modules/requests/requests.module';
import { QuotesModule } from './modules/quotes/quotes.module';
import { JobsModule } from './modules/jobs/jobs.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { ProvidersModule } from './modules/providers/providers.module';
import { ServicesModule } from './modules/services/services.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { ActivitiesModule } from './modules/activities/activities.module';
import { MaintenanceModule } from './modules/maintenance/maintenance.module';
import { MessagesModule } from './modules/messages/messages.module';
import { ReviewsModule } from './modules/reviews/reviews.module';
import { HealthModule } from './health/health.module';
import { PlatformModule } from './platform/platform.module';
// import { CsrfGuard } from './modules/auth/guards/csrf.guard';
import { envValidationSchema } from './config/env.validation';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      validationSchema: envValidationSchema,
    }),
    ThrottlerModule.forRoot([{
      ttl: 60000, // 1 minute
      limit: 100, // 100 requests per minute
    }]),
    LoggerModule.forRoot({
      pinoHttp: {
        genReqId: (req, res) => {
          const existingID = req.id ?? req.headers['x-request-id'];
          if (existingID) return existingID;
          const id = randomUUID();
          res.setHeader('X-Request-Id', id);
          return id;
        },
        transport: process.env.NODE_ENV !== 'production' ? {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: 'SYS:HH:MM:ss',
            ignore: 'pid,hostname,req,res',
            singleLine: false,
            messageFormat: '{context} - {msg}',
          },
        } : undefined,
        level: process.env.LOG_LEVEL || 'info',
        autoLogging: false, // Disable pino auto-logging (using HttpLoggingInterceptor instead)
        serializers: {
          req: (req) => ({
            id: req.id,
            method: req.method,
            url: req.url,
            headers: {
              host: req.headers.host,
              'user-agent': req.headers['user-agent'],
              'content-type': req.headers['content-type'],
            },
            remoteAddress: req.remoteAddress,
            remotePort: req.remotePort,
          }),
          res: (res) => ({
            statusCode: res.statusCode,
            headers: {
              'content-type': res.headers['content-type'],
              'x-request-id': res.headers['x-request-id'],
            },
          }),
        },
        customLogLevel: (req, res, err) => {
          // Let HttpLoggingInterceptor handle request logging
          if (res.statusCode >= 500 || err) {
            return 'error';
          }
          return 'info';
        },
      },
    }),
    DatabaseModule,
    SharedModule,
    AuthModule,
    VehiclesModule,
    RequestsModule,
    QuotesModule,
    JobsModule,
    PaymentsModule,
    ProvidersModule,
    ServicesModule,
    NotificationsModule,
    ActivitiesModule,
    MaintenanceModule,
    MessagesModule,
    ReviewsModule,
    HealthModule,
    PlatformModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    // {
    //   provide: APP_GUARD,
    //   useClass: CsrfGuard,
    // },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggerUserInterceptor,
    },
  ],
})
export class AppModule {}
