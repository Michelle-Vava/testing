import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ClerkAuthController } from './clerk-auth.controller';
import { ClerkAuthService } from './clerk-auth.service';
import { ClerkAuthGuard } from './clerk.guard';
import { DatabaseModule } from '../../../infrastructure/database/database.module';

@Module({
  imports: [DatabaseModule, ConfigModule],
  controllers: [ClerkAuthController],
  providers: [
    ClerkAuthService,
    ClerkAuthGuard,
    // Make ClerkAuthGuard the global guard
    {
      provide: APP_GUARD,
      useClass: ClerkAuthGuard,
    },
  ],
  exports: [ClerkAuthService],
})
export class ClerkAuthModule {}
