import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { PaginationDto } from '../../shared/dto/pagination.dto';
import { paginate } from '../../shared/utils/pagination.helper';

/**
 * VehiclesService handles all vehicle management business logic
 * 
 * Provides CRUD operations with ownership validation to ensure users
 * can only access and modify their own vehicles.
 */
@Injectable()
export class VehiclesService {
  constructor(private prisma: PrismaService) {}

  /**
   * Get paginated list of vehicles for a specific owner
   * 
   * @param ownerId - User UUID who owns the vehicles
   * @param paginationDto - Pagination parameters (page, limit, skip, take)
   * @returns Paginated vehicle list with metadata (total, totalPages, etc.)
   */
  async findAll(ownerId: string, paginationDto: PaginationDto) {
    const { skip, take } = paginationDto;
    
    const [vehicles, total] = await Promise.all([
      this.prisma.vehicle.findMany({
        where: { ownerId, deletedAt: null },
        orderBy: { createdAt: 'desc' },
        skip,
        take,
      }),
      this.prisma.vehicle.count({ where: { ownerId, deletedAt: null } }),
    ]);

    return paginate(vehicles, total, paginationDto);
  }

  /**
   * Create a new vehicle for a user
   * 
   * @param ownerId - User UUID who will own the vehicle
   * @param vehicleData - Vehicle details (make, model, year, VIN, etc.)
   * @returns Created vehicle entity
   */
  async create(ownerId: string, vehicleData: CreateVehicleDto) {
    return this.prisma.vehicle.create({
      data: {
        ...vehicleData,
        ownerId,
      },
    });
  }

  /**
   * Get vehicle by ID with ownership validation
   * 
   * Retrieves vehicle with owner information. Ensures requesting user owns the vehicle.
   * 
   * @param id - Vehicle UUID
   * @param userId - User UUID making the request
   * @returns Vehicle entity with owner details
   * @throws NotFoundException if vehicle doesn't exist
   * @throws ForbiddenException if user doesn't own the vehicle
   */
  async findOne(id: string, userId: string) {
    const vehicle = await this.prisma.vehicle.findUnique({
      where: { id, deletedAt: null },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    if (!vehicle) {
      throw new NotFoundException(`Vehicle with ID ${id} not found`);
    }

    if (vehicle.ownerId !== userId) {
      throw new ForbiddenException(`Access denied: Vehicle ${id} belongs to another user`);
    }

    return vehicle;
  }

  /**
   * Update vehicle information with ownership validation
   * 
   * @param id - Vehicle UUID
   * @param userId - User UUID making the request
   * @param vehicleData - Partial vehicle data to update
   * @returns Updated vehicle entity
   * @throws NotFoundException if vehicle doesn't exist
   * @throws ForbiddenException if user doesn't own the vehicle
   */
  async update(id: string, userId: string, vehicleData: UpdateVehicleDto) {
    const vehicle = await this.prisma.vehicle.findUnique({
      where: { id, deletedAt: null },
    });

    if (!vehicle) {
      throw new NotFoundException(`Vehicle with ID ${id} not found`);
    }

    if (vehicle.ownerId !== userId) {
      throw new ForbiddenException(`Update denied: Vehicle ${id} belongs to another user`);
    }

    return this.prisma.vehicle.update({
      where: { id },
      data: vehicleData,
    });
  }

  /**
   * Delete a vehicle with ownership validation
   * 
   * Permanently removes vehicle and all associated data (cascade delete for maintenance records).
   * 
   * @param id - Vehicle UUID
   * @param userId - User UUID making the request
   * @returns Success message
   * @throws NotFoundException if vehicle doesn't exist
   * @throws ForbiddenException if user doesn't own the vehicle
   */
  async delete(id: string, userId: string) {
    const vehicle = await this.prisma.vehicle.findUnique({
      where: { id, deletedAt: null },
    });

    if (!vehicle) {
      throw new NotFoundException(`Vehicle with ID ${id} not found`);
    }

    if (vehicle.ownerId !== userId) {
      throw new ForbiddenException(`Delete denied: Vehicle ${id} belongs to another user`);
    }

    // Soft delete instead of hard delete
    await this.prisma.vehicle.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    return { message: `Vehicle ${vehicle.make} ${vehicle.model} deleted successfully` };
  }

  /**
   * Update vehicle mileage with ownership validation
   * 
   * Convenience method for quick mileage updates (e.g., after service).
   * 
   * @param id - Vehicle UUID
   * @param userId - User UUID making the request
   * @param mileage - New mileage value
   * @returns Updated vehicle entity
   * @throws NotFoundException if vehicle doesn't exist
   * @throws ForbiddenException if user doesn't own the vehicle
   */
  async updateMileage(id: string, userId: string, mileage: number) {
    const vehicle = await this.prisma.vehicle.findUnique({
      where: { id, deletedAt: null },
    });

    if (!vehicle) {
      throw new NotFoundException(`Vehicle with ID ${id} not found`);
    }

    if (vehicle.ownerId !== userId) {
      throw new ForbiddenException(`Update denied: Vehicle ${id} belongs to another user`);
    }

    return this.prisma.vehicle.update({
      where: { id },
      data: { mileage },
    });
  }

  /**
   * Add images to a vehicle
   * 
   * Appends new image URLs to the vehicle's imageUrls array.
   * 
   * @param id - Vehicle UUID
   * @param imageUrls - Array of Cloudinary URLs to add
   * @returns Updated vehicle entity
   */
  async addImages(id: string, imageUrls: string[]) {
    const vehicle = await this.prisma.vehicle.findUnique({
      where: { id, deletedAt: null },
    });

    if (!vehicle) {
      throw new NotFoundException(`Vehicle with ID ${id} not found`);
    }

    return this.prisma.vehicle.update({
      where: { id },
      data: {
        imageUrls: {
          push: imageUrls,
        },
      },
    });
  }

  /**
   * Remove an image from a vehicle
   * 
   * Removes a specific image URL from the vehicle's imageUrls array.
   * 
   * @param id - Vehicle UUID
   * @param imageUrl - URL to remove
   * @returns Updated vehicle entity
   */
  async removeImage(id: string, imageUrl: string) {
    const vehicle = await this.prisma.vehicle.findUnique({
      where: { id, deletedAt: null },
    });

    if (!vehicle) {
      throw new NotFoundException(`Vehicle with ID ${id} not found`);
    }

    const updatedImageUrls = vehicle.imageUrls.filter(url => url !== imageUrl);

    return this.prisma.vehicle.update({
      where: { id },
      data: {
        imageUrls: updatedImageUrls,
      },
    });
  }
}
