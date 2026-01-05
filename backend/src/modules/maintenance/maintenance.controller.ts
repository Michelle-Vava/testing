import { Controller, Get, Post, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { MaintenanceService } from './maintenance.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateMaintenanceRecordDto } from './dto/create-maintenance-record.dto';
import { AuthenticatedRequest } from '../../shared/types/express-request.interface';

@ApiTags('maintenance')
@ApiBearerAuth()
@Controller()
@UseGuards(JwtAuthGuard)
export class MaintenanceController {
  constructor(private maintenanceService: MaintenanceService) {}

  @Get('vehicles/:vehicleId/maintenance')
  @ApiOperation({ summary: 'Get maintenance history for a vehicle' })
  @ApiResponse({ status: 200, description: 'List of maintenance records' })
  async findAll(@Request() req: AuthenticatedRequest, @Param('vehicleId') vehicleId: string) {
    return this.maintenanceService.findAllForVehicle(vehicleId, req.user.sub);
  }

  @Post('vehicles/:vehicleId/maintenance')
  @ApiOperation({ summary: 'Add a maintenance record to a vehicle' })
  @ApiResponse({ status: 201, description: 'Maintenance record created successfully' })
  async create(
    @Request() req: AuthenticatedRequest,
    @Param('vehicleId') vehicleId: string,
    @Body() data: CreateMaintenanceRecordDto
  ) {
    return this.maintenanceService.create(vehicleId, req.user.sub, data);
  }

  @Delete('maintenance/:id')
  @ApiOperation({ summary: 'Delete a maintenance record' })
  @ApiResponse({ status: 200, description: 'Maintenance record deleted successfully' })
  async delete(@Request() req: AuthenticatedRequest, @Param('id') id: string) {
    return this.maintenanceService.delete(id, req.user.sub);
  }
}
