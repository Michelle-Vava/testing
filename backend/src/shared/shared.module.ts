import { Module, Global } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EmailService } from './services/email.service';
import { UploadService } from './services/upload.service';
import { AuditService } from './services/audit.service';

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
  providers: [EmailService, UploadService, AuditService],
  exports: [
    EmailService,
    UploadService,
    AuditService,
  ],
})
export class SharedModule {}
