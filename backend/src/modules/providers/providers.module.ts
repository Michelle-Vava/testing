import { Module } from '@nestjs/common';
import { ProvidersController } from './providers.controller';
import { ProvidersService } from './providers.service';
import { ProviderStatusService } from './provider-status.service';
import { DatabaseModule } from '../../infrastructure/database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [ProvidersController],
  providers: [ProvidersService, ProviderStatusService],
  exports: [ProvidersService, ProviderStatusService],
})
export class ProvidersModule {}
