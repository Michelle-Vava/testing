import { Controller, Get, Post, Put, Body, Param, UseGuards, Request, Logger, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse, ApiBody, ApiQuery } from '@nestjs/swagger';
import { RequestsService } from './requests.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateRequestDto } from './dto/create-request.dto';
import { UpdateRequestDto } from './dto/update-request.dto';
import { RequestResponseDto } from './dto/request-response.dto';
import { PaginationDto } from '../../shared/dto/pagination.dto';
import { AuthenticatedRequest } from '../../shared/types/express-request.interface';

/**
 * RequestsController handles service request management
 * 
 * Manages the full lifecycle of service requests from creation to completion.
 * Owners create requests, providers view and quote on them.
 * Access control based on user role and ownership.
 */
@ApiTags('requests')
@Controller('requests')
export class RequestsController {
  private readonly logger = new Logger(RequestsController.name);

  constructor(private requestsService: RequestsService) {}

  /**
   * Get recent public service requests for landing page
   * 
   * Returns 4 most recent open/quoted requests without authentication.
   * Used to show marketplace activity to unauthenticated visitors.
   * 
   * @returns List of recent public service requests with vehicle info and quote counts
   */
  @Get('public/recent')
  @ApiOperation({ summary: 'Get recent public service requests (no auth required)' })
  @ApiResponse({ status: 200, description: 'Return recent public requests.' })
  async findPublicRecent() {
    this.logger.log('Fetching recent public requests for landing page');
    return this.requestsService.findPublicRecent();
  }

  /**
   * Get service requests with role-based filtering
   * 
   * Owners see only their own requests.
   * Providers see all open requests they can quote on.
   * 
   * @param req - Authenticated request with user JWT payload
   * @param paginationDto - Pagination parameters
   * @returns Paginated list of service requests with vehicle and quote data
   */
  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all service requests (owners see theirs, providers see all open)' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number (default: 1)' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page (default: 20, max: 100)' })
  @ApiResponse({ 
    status: 200, 
    description: 'Paginated list of service requests',
    type: [RequestResponseDto]
  })
  async findAll(@Request() req: AuthenticatedRequest, @Query() paginationDto: PaginationDto) {
    this.logger.log(`User ${req.user.sub} fetching all requests`);
    return this.requestsService.findAll(req.user.sub, req.user.roles, paginationDto);
  }

  /**
   * Create a new service request for a vehicle
   * 
   * Owner creates request specifying vehicle, service type, description, and urgency.
   * Request starts in 'open' status and is visible to all providers.
   * 
   * @param req - Authenticated request with user JWT payload
   * @param requestData - Service request details (vehicleId, title, description, urgency)
   * @returns Created service request entity
   */
  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new service request' })
  @ApiBody({ type: CreateRequestDto })
  @ApiResponse({ status: 201, description: 'Service request created successfully', type: RequestResponseDto })
  async create(@Request() req: AuthenticatedRequest, @Body() requestData: CreateRequestDto) {
    this.logger.log(`User ${req.user.sub} creating request`);
    return this.requestsService.create(req.user.sub, requestData);
  }

  /**
   * Get detailed service request information
   * 
   * Returns request with vehicle, quotes, and related data.
   * Owners can view their own requests, providers can view any request.
   * 
   * @param req - Authenticated request with user JWT payload
   * @param id - Service request UUID
   * @returns Service request with full details
   * @throws NotFoundException if request doesn't exist
   * @throws ForbiddenException if owner tries to view another owner's request
   */
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a specific service request by ID' })
  @ApiResponse({ status: 200, description: 'Service request details', type: RequestResponseDto })
  @ApiResponse({ status: 404, description: 'Request not found.' })
  async findOne(@Request() req: AuthenticatedRequest, @Param('id') id: string) {
    this.logger.log(`User ${req.user.sub} fetching request ${id}`);
    return this.requestsService.findOne(id, req.user.sub, req.user.roles);
  }

  /**
   * Update service request details
   * 
   * Only the request owner can update. Can update title, description, urgency, or status.
   * 
   * @param req - Authenticated request with user JWT payload
   * @param id - Service request UUID
   * @param updateData - Partial request data to update
   * @returns Updated service request entity
   * @throws NotFoundException if request doesn't exist
   * @throws ForbiddenException if user doesn't own the request
   */
  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a service request' })
  @ApiBody({ type: UpdateRequestDto })
  @ApiResponse({ status: 200, description: 'Service request updated successfully', type: RequestResponseDto })
  @ApiResponse({ status: 404, description: 'Request not found.' })
  async update(@Request() req: AuthenticatedRequest, @Param('id') id: string, @Body() updateData: UpdateRequestDto) {
    this.logger.log(`User ${req.user.sub} updating request ${id}`);
    return this.requestsService.update(id, req.user.sub, updateData);
  }
}
