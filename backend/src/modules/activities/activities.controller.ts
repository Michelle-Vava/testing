import { Controller, Get, Query, Request, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { ActivitiesService } from './activities.service';
import { AuthenticatedRequest } from '../../shared/types/express-request.interface';

@ApiTags('activities')
@ApiBearerAuth()
@Controller('activities')
export class ActivitiesController {
  constructor(private readonly activitiesService: ActivitiesService) {}

  @Get()
  @ApiOperation({ summary: 'Get activity timeline for current user' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  findAll(@Request() req: AuthenticatedRequest, @Query('limit') limit?: string) {
    const limitNum = limit ? parseInt(limit, 10) : 10;
    return this.activitiesService.findByUserId(req.user.id, limitNum);
  }
}





