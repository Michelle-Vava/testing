import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PlatformService } from './platform.service';
import { RolesGuard } from '../shared/guards/roles.guard';
import { Roles } from '../shared/decorators/roles.decorator';
import { UserRole } from '../shared/enums/user-role.enum';

@ApiTags('platform')
@Controller('platform')
export class PlatformController {
  constructor(private readonly platformService: PlatformService) {}

  @Get('stats')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get platform statistics (Admin only)' })
  async getStats() {
    return this.platformService.getStats();
  }

  @Get('activity')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get platform activity feed (Admin only)' })
  async getActivity() {
    return this.platformService.getActivity();
  }

  @Get('settings')
  @ApiOperation({ summary: 'Get platform settings (public)' })
  async getSettings() {
    return this.platformService.getSettings();
  }
}

