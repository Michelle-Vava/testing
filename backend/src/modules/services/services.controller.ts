import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ServicesService } from './services.service';

@ApiTags('services')
@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all active services' })
  findAll() {
    return this.servicesService.findAll();
  }

  @Get('popular')
  @ApiOperation({ summary: 'Get popular services for dashboard' })
  findPopular() {
    return this.servicesService.findPopular();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get service by ID' })
  findOne(@Param('id') id: string) {
    return this.servicesService.findOne(id);
  }
}
