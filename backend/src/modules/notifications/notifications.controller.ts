import { Controller, Get, Put, Param, Request, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { NotificationsService } from './notifications.service';
import { AuthenticatedRequest } from '../../shared/types/express-request.interface';

@ApiTags('notifications')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all notifications for current user' })
  findAll(@Request() req: AuthenticatedRequest) {
    return this.notificationsService.findByUserId(req.user.sub);
  }

  @Get('unread-count')
  @ApiOperation({ summary: 'Get unread notification count' })
  getUnreadCount(@Request() req: AuthenticatedRequest) {
    return this.notificationsService.getUnreadCount(req.user.sub);
  }

  @Put(':id/read')
  @ApiOperation({ summary: 'Mark notification as read' })
  markAsRead(@Param('id') id: string, @Request() req: AuthenticatedRequest) {
    return this.notificationsService.markAsRead(id, req.user.sub);
  }

  @Put('read-all')
  @ApiOperation({ summary: 'Mark all notifications as read' })
  markAllAsRead(@Request() req: AuthenticatedRequest) {
    return this.notificationsService.markAllAsRead(req.user.sub);
  }
}
