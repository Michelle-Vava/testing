import { Module } from '@nestjs/common';
import { RequestsController } from './requests.controller';
import { RequestsService } from './requests.service';
import { UploadService } from '../../shared/services/upload.service';

@Module({
  controllers: [RequestsController],
  providers: [RequestsService, UploadService],
})
export class RequestsModule {}
