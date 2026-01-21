import { Module, Global } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EmailService } from './services/email/email.service';
import { UploadService } from './services/upload.service';

/**
 * SharedModule provides globally available services
 * 
 * Services in this module are available throughout the application
 * without needing to import the module in every feature module.
 */
@Global()
@Module({
  imports: [
    ConfigModule,
  ],
  providers: [EmailService, UploadService],
  exports: [
    EmailService,
    UploadService,
  ],
})
export class SharedModule {}
