import { Module } from '@nestjs/common';
import { VehiclesController } from './vehicles.controller';
import { VehiclesService } from './vehicles.service';
import { UploadService } from '../../shared/services/upload.service';

@Module({
  controllers: [VehiclesController],
  providers: [VehiclesService, UploadService],
})
export class VehiclesModule {}
