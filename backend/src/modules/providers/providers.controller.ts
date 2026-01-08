import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Logger,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ProvidersService } from './providers.service';
import { ProviderStatusService } from './provider-status.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ProviderStatusGuard, RequireProviderStatus } from '../../shared/guards/provider-status.guard';
import { AuthenticatedRequest } from '../../shared/types/express-request.interface';
import { ProviderStatus } from '@prisma/client';

@ApiTags('providers')
@Controller('providers')
export class ProvidersController {
  private readonly logger = new Logger(ProvidersController.name);

  constructor(
    private providersService: ProvidersService,
    private providerStatusService: ProviderStatusService,
  ) {}

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
      mobileService: mobileService !== undefined ? mobileService === 'true' : undefined,
      shopService: shopService !== undefined ? shopService === 'true' : undefined,
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

  // Provider onboarding endpoints

  @Get('onboarding/status')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get provider onboarding status and checklist' })
  async getOnboardingStatus(@Request() req: AuthenticatedRequest) {
    return this.providerStatusService.getOnboardingStatus(req.user.sub);
  }

  @Post('onboarding/complete')
  @UseGuards(JwtAuthGuard, ProviderStatusGuard)
  @RequireProviderStatus(ProviderStatus.DRAFT, ProviderStatus.NONE)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Complete provider onboarding' })
  async completeOnboarding(@Request() req: AuthenticatedRequest) {
    return this.providerStatusService.completeOnboarding(req.user.sub);
  }

  @Put('onboarding/start')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Start provider onboarding (NONE → DRAFT)' })
  async startOnboarding(@Request() req: AuthenticatedRequest) {
    return this.providerStatusService.updateStatus(
      req.user.sub,
      ProviderStatus.DRAFT,
      'Started onboarding',
    );
  }
}

