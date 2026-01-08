import { Controller, Get, Post, Put, Delete, Patch, Body, Param, UseGuards, Request, Query, UploadedFiles, UseInterceptors, BadRequestException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery, ApiResponse, ApiConsumes } from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';
import { FileValidationPipe } from '../../shared/pipes/file-validation.pipe';
import { VehiclesService } from './vehicles.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { UpdateMileageDto } from './dto/update-mileage.dto';
import { VehicleResponseDto } from './dto/vehicle-response.dto';
import { PaginationDto } from '../../shared/dto/pagination.dto';
import { AuthenticatedRequest } from '../../shared/types/express-request.interface';
import { UploadService } from '../../shared/services/upload.service';

/**
 * VehiclesController handles all vehicle management endpoints
 * 
 * Provides CRUD operations for user vehicles with proper ownership validation.
 * All endpoints require JWT authentication.
 */
@ApiTags('vehicles')
@ApiBearerAuth()
@Controller('vehicles')
@UseGuards(JwtAuthGuard)
export class VehiclesController {
  constructor(
    private vehiclesService: VehiclesService,
    private uploadService: UploadService,
  ) {}

  /**
   * Get paginated list of user's vehicles
   * 
   * Returns all vehicles owned by the authenticated user with pagination support.
   * 
   * @param req - Authenticated request with user JWT payload
   * @param paginationDto - Pagination parameters (page, limit)
   * @returns Paginated vehicle list with metadata
   */
  @Get()
  @ApiOperation({ summary: 'Get all vehicles for current user' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number (default: 1)' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page (default: 20, max: 100)' })
  @ApiResponse({ 
    status: 200, 
    description: 'Paginated list of vehicles',
    type: [VehicleResponseDto]
  })
  async findAll(@Request() req: AuthenticatedRequest, @Query() paginationDto: PaginationDto) {
    return this.vehiclesService.findAll(req.user.sub, paginationDto);
  }

  /**
   * Create a new vehicle for the authenticated user
   * 
   * Adds vehicle to user's garage with VIN validation and duplicate checking.
   * 
   * @param req - Authenticated request with user JWT payload
   * @param vehicleData - Vehicle details (make, model, year, VIN, etc.)
   * @returns Created vehicle entity
   */
  @Post()
  @ApiOperation({ summary: 'Create a new vehicle' })
  @ApiResponse({ status: 201, description: 'Vehicle created successfully', type: VehicleResponseDto })
  async create(@Request() req: AuthenticatedRequest, @Body() vehicleData: CreateVehicleDto) {
    return this.vehiclesService.create(req.user.sub, vehicleData);
  }

  /**
   * Get detailed information about a specific vehicle
   * 
   * Returns vehicle with owner details. Validates ownership before returning.
   * 
   * @param req - Authenticated request with user JWT payload
   * @param id - Vehicle UUID
   * @returns Vehicle entity with owner information
   * @throws NotFoundException if vehicle doesn't exist
   * @throws ForbiddenException if user doesn't own the vehicle
   */
  @Get(':id')
  @ApiOperation({ summary: 'Get a specific vehicle by ID' })
  @ApiResponse({ status: 200, description: 'Vehicle details', type: VehicleResponseDto })
  async findOne(@Request() req: AuthenticatedRequest, @Param('id') id: string) {
    return this.vehiclesService.findOne(id, req.user.sub);
  }

  /**
   * Update vehicle information
   * 
   * Updates vehicle details. Validates ownership before allowing update.
   * 
   * @param req - Authenticated request with user JWT payload
   * @param id - Vehicle UUID
   * @param vehicleData - Partial vehicle data to update
   * @returns Updated vehicle entity
   * @throws NotFoundException if vehicle doesn't exist
   * @throws ForbiddenException if user doesn't own the vehicle
   */
  @Put(':id')
  @ApiOperation({ summary: 'Update a vehicle' })
  @ApiResponse({ status: 200, description: 'Vehicle updated successfully', type: VehicleResponseDto })
  async update(@Request() req: AuthenticatedRequest, @Param('id') id: string, @Body() vehicleData: UpdateVehicleDto) {
    return this.vehiclesService.update(id, req.user.sub, vehicleData);
  }

  /**
   * Update vehicle mileage only
   * 
   * Convenience endpoint for quick mileage updates without full vehicle update.
   * 
   * @param req - Authenticated request with user JWT payload
   * @param id - Vehicle UUID
   * @param mileageData - New mileage value
   * @returns Updated vehicle entity
   * @throws NotFoundException if vehicle doesn't exist
   * @throws ForbiddenException if user doesn't own the vehicle
   */
  @Patch(':id/mileage')
  @ApiOperation({ summary: 'Update vehicle mileage' })
  @ApiResponse({ status: 200, description: 'Mileage updated successfully', type: VehicleResponseDto })
  async updateMileage(@Request() req: AuthenticatedRequest, @Param('id') id: string, @Body() mileageData: UpdateMileageDto) {
    return this.vehiclesService.updateMileage(id, req.user.sub, mileageData.mileage);
  }

  /**
   * Delete a vehicle
   * 
   * Permanently removes vehicle and associated maintenance records (cascade delete).
   * Validates ownership before deletion.
   * 
   * @param req - Authenticated request with user JWT payload
   * @param id - Vehicle UUID
   * @returns Success message
   * @throws NotFoundException if vehicle doesn't exist
   * @throws ForbiddenException if user doesn't own the vehicle
   */
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a vehicle' })
  async delete(@Request() req: AuthenticatedRequest, @Param('id') id: string) {
    return this.vehiclesService.delete(id, req.user.sub);
  }

  /**
   * Upload images for a vehicle
   * 
   * Accepts multiple image files and uploads them to Cloudinary.
   * Updates the vehicle's imageUrls array with the uploaded URLs.
   * 
   * @param req - Authenticated request with user JWT payload
   * @param id - Vehicle UUID
   * @param files - Array of image files (max 10)
   * @returns Updated vehicle entity with new imageUrls
   * @throws NotFoundException if vehicle doesn't exist
   * @throws ForbiddenException if user doesn't own the vehicle
   * @throws BadRequestException if no files or invalid files
   */
  @Post(':id/images')
  @ApiOperation({ summary: 'Upload images for a vehicle' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('images', 10)) // Max 10 images
  @ApiResponse({ status: 200, description: 'Images uploaded successfully', type: VehicleResponseDto })
  async uploadImages(
    @Request() req: AuthenticatedRequest,
    @Param('id') id: string,
    @UploadedFiles(new FileValidationPipe()) files: Express.Multer.File[],
  ) {
    // Validate vehicle ownership first
    await this.vehiclesService.findOne(id, req.user.sub);

    if (!files || files.length === 0) {
      throw new BadRequestException('No images provided');
    }

    // Upload images to Cloudinary
    const imageUrls = await this.uploadService.uploadImages(files, 'shanda/vehicles');

    // Update vehicle with new image URLs
    return this.vehiclesService.addImages(id, imageUrls);
  }

  /**
   * Delete an image from a vehicle
   * 
   * Removes a specific image URL from the vehicle's imageUrls array
   * and deletes it from Cloudinary.
   * 
   * @param req - Authenticated request with user JWT payload
   * @param id - Vehicle UUID
   * @param imageUrl - URL of the image to delete
   * @returns Updated vehicle entity
   * @throws NotFoundException if vehicle doesn't exist
   * @throws ForbiddenException if user doesn't own the vehicle
   */
  @Delete(':id/images')
  @ApiOperation({ summary: 'Delete an image from a vehicle' })
  @ApiResponse({ status: 200, description: 'Image deleted successfully', type: VehicleResponseDto })
  async deleteImage(
    @Request() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Body('imageUrl') imageUrl: string,
  ) {
    // Validate vehicle ownership first
    await this.vehiclesService.findOne(id, req.user.sub);

    // Delete image from Cloudinary
    await this.uploadService.deleteImage(imageUrl);

    // Remove URL from vehicle
    return this.vehiclesService.removeImage(id, imageUrl);
  }
}
