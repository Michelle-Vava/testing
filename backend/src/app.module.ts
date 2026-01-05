import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { DatabaseModule } from './infrastructure/database/database.module';
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
import { HealthModule } from './health/health.module';
import { PlatformModule } from './platform/platform.module';
import { LoggerMiddleware } from './shared/middleware/logger.middleware';
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
    DatabaseModule,
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
    HealthModule,
    PlatformModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes('*');
  }
}
