import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PlatformService } from './platform.service';
import { JwtAuthGuard } from '../modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from '../shared/guards/roles.guard';
import { Roles } from '../shared/decorators/roles.decorator';
import { UserRole } from '../shared/enums/user-role.enum';

@ApiTags('platform')
@Controller('platform')
export class PlatformController {
  constructor(private readonly platformService: PlatformService) {}

  @Get('stats')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get platform statistics (Admin only)' })
  async getStats() {
    return this.platformService.getStats();
  }

  @Get('settings')
  @ApiOperation({ summary: 'Get platform settings (public)' })
  async getSettings() {
    return this.platformService.getSettings();
  }
}
