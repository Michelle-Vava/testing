import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { PlatformService } from './platform.service';

@ApiTags('platform')
@Controller('platform')
export class PlatformController {
  constructor(private readonly platformService: PlatformService) {}

  // Admin endpoints removed - no admin role in simplified system

  @Get('settings')
  @ApiOperation({ summary: 'Get platform settings (public)' })
  async getSettings() {
    return this.platformService.getSettings();
  }
}

