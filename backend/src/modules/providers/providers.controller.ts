import { Controller, Get, Logger, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { ProvidersService } from './providers.service';

@ApiTags('providers')
@Controller('providers')
export class ProvidersController {
  private readonly logger = new Logger(ProvidersController.name);

  constructor(private providersService: ProvidersService) {}

  @Get('public/featured')
  @ApiOperation({ summary: 'Get featured providers (no auth required)' })
  @ApiResponse({ status: 200, description: 'Return featured providers.' })
  async findFeatured() {
    this.logger.log('Fetching featured providers for landing page');
    return this.providersService.findFeatured();
  }

  @Get()
  @ApiOperation({ summary: 'Get all providers with optional filters' })
  @ApiQuery({ name: 'serviceType', required: false })
  @ApiQuery({ name: 'mobileService', required: false, type: Boolean })
  @ApiQuery({ name: 'shopService', required: false, type: Boolean })
  @ApiQuery({ name: 'minRating', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async findAll(
    @Query('serviceType') serviceType?: string,
    @Query('mobileService') mobileService?: string,
    @Query('shopService') shopService?: string,
    @Query('minRating') minRating?: string,
    @Query('limit') limit?: string,
  ) {
    const filters = {
      serviceType,
      mobileService: mobileService === 'true',
      shopService: shopService === 'true',
      minRating: minRating ? parseFloat(minRating) : undefined,
      limit: limit ? parseInt(limit, 10) : undefined,
    };
    return this.providersService.findAll(filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get provider by ID with full profile' })
  async findOne(@Param('id') id: string) {
    return this.providersService.findOne(id);
  }
}

