import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request, Logger, Query, UploadedFiles, UseInterceptors, BadRequestException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse, ApiBody, ApiQuery, ApiConsumes } from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';
import { FileValidationPipe } from '../../shared/pipes/file-validation.pipe';
import { RequestsService } from './requests.service';
import { CreateRequestDto } from './dto/create-request.dto';
import { UpdateRequestDto } from './dto/update-request.dto';
import { RequestResponseDto } from './dto/request-response.dto';
import { RequestsQueryDto } from './dto/requests-query.dto';
import { AuthenticatedRequest } from '../../shared/types/express-request.interface';
import { UploadService } from '../../shared/services/upload.service';
import { Public } from '../auth/decorators/public.decorator';

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

  constructor(
    private requestsService: RequestsService,
    private uploadService: UploadService,
  ) {}

  /**
   * Get recent public service requests for landing page
   * 
   * Returns 4 most recent open/quoted requests without authentication.
   * Used to show marketplace activity to unauthenticated visitors.
   * 
   * @returns List of recent public service requests with vehicle info and quote counts
   */
  @Public()
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
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all service requests (owners see theirs, providers see all open)' })
  @ApiResponse({ 
    status: 200, 
    description: 'Paginated list of service requests',
    type: [RequestResponseDto]
  })
  async findAll(@Request() req: AuthenticatedRequest, @Query() query: RequestsQueryDto) {
    this.logger.log(`User ${req.user.id} fetching all requests with query: ${JSON.stringify(query)}`);
    return this.requestsService.findAll(req.user.id, req.user.roles, query);
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
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new service request' })
  @ApiBody({ type: CreateRequestDto })
  @ApiResponse({ status: 201, description: 'Service request created successfully', type: RequestResponseDto })
  async create(@Request() req: AuthenticatedRequest, @Body() requestData: CreateRequestDto) {
    this.logger.log(`User ${req.user.id} creating request`);
    return this.requestsService.create(req.user.id, requestData);
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
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a specific service request by ID' })
  @ApiResponse({ status: 200, description: 'Service request details', type: RequestResponseDto })
  @ApiResponse({ status: 404, description: 'Request not found.' })
  async findOne(@Request() req: AuthenticatedRequest, @Param('id') id: string) {
    this.logger.log(`User ${req.user.id} fetching request ${id}`);
    return this.requestsService.findOne(id, req.user.id, req.user.roles);
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
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a service request' })
  @ApiBody({ type: UpdateRequestDto })
  @ApiResponse({ status: 200, description: 'Service request updated successfully', type: RequestResponseDto })
  @ApiResponse({ status: 404, description: 'Request not found.' })
  async update(@Request() req: AuthenticatedRequest, @Param('id') id: string, @Body() updateData: UpdateRequestDto) {
    this.logger.log(`User ${req.user.id} updating request ${id}`);
    return this.requestsService.update(id, req.user.id, updateData);
  }

  /**
   * Upload images for a service request
   * 
   * Accepts multiple image files and uploads them to Cloudinary.
   * Updates the request's imageUrls array with the uploaded URLs.
   * 
   * @param req - Authenticated request with user JWT payload
   * @param id - Service request UUID
   * @param files - Array of image files (max 10)
   * @returns Updated service request entity with new imageUrls
   * @throws NotFoundException if request doesn't exist
   * @throws ForbiddenException if user doesn't own the request
   * @throws BadRequestException if no files or invalid files
   */
  @Post(':id/images')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Upload images for a service request' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('images', 10)) // Max 10 images
  @ApiResponse({ status: 200, description: 'Images uploaded successfully', type: RequestResponseDto })
  async uploadImages(
    @Request() req: AuthenticatedRequest,
    @Param('id') id: string,
    @UploadedFiles(new FileValidationPipe()) files: Express.Multer.File[],
  ) {
    this.logger.log(`User ${req.user.id} uploading images for request ${id}`);
    
    // Validate request ownership first
    await this.requestsService.findOne(id, req.user.id, req.user.roles);

    if (!files || files.length === 0) {
      throw new BadRequestException('No images provided');
    }

    // Upload images to Cloudinary
    const imageUrls = await this.uploadService.uploadImages(files, 'shanda/requests');

    // Update request with new image URLs
    return this.requestsService.addImages(id, imageUrls);
  }

  /**
   * Delete an image from a service request
   * 
   * Removes a specific image URL from the request's imageUrls array
   * and deletes it from Cloudinary.
   * 
   * @param req - Authenticated request with user JWT payload
   * @param id - Service request UUID
   * @param imageUrl - URL of the image to delete
   * @returns Updated service request entity
   * @throws NotFoundException if request doesn't exist
   * @throws ForbiddenException if user doesn't own the request
   */
  @Delete(':id/images')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete an image from a service request' })
  @ApiResponse({ status: 200, description: 'Image deleted successfully', type: RequestResponseDto })
  async deleteImage(
    @Request() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Body('imageUrl') imageUrl: string,
  ) {
    this.logger.log(`User ${req.user.id} deleting image from request ${id}`);
    
    // Validate request ownership first
    await this.requestsService.findOne(id, req.user.id, req.user.roles);

    // Delete image from Cloudinary
    await this.uploadService.deleteImage(imageUrl);

    // Remove URL from request
    return this.requestsService.removeImage(id, imageUrl);
  }
}


