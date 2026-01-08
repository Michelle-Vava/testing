import { Injectable, NotFoundException, ForbiddenException, Logger } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { CreateRequestDto } from './dto/create-request.dto';
import { UpdateRequestDto } from './dto/update-request.dto';
import { RequestsQueryDto, RequestSort } from './dto/requests-query.dto';
import { RequestStatus } from '../../shared/enums';

@Injectable()
export class RequestsService {
  private readonly logger = new Logger(RequestsService.name);

  constructor(private prisma: PrismaService) {}

  async findPublicRecent() {
    this.logger.debug('Finding recent public requests');
    
    // Optimized: Single query with indexed columns, no _count
    const requests = await this.prisma.serviceRequest.findMany({
      where: {
        status: { in: [RequestStatus.OPEN, RequestStatus.QUOTED] },
      },
      take: 4,
      select: {
        id: true,
        title: true,
        description: true,
        urgency: true,
        status: true,
        createdAt: true,
        vehicle: {
          select: {
            make: true,
            model: true,
            year: true,
          },
        },
        quotes: {
          select: { id: true },
          take: 1, // Just need to check if any exist
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Add quote count efficiently
    return requests.map(req => ({
      ...req,
      quoteCount: req.quotes?.length || 0,
      quotes: undefined, // Remove from response
    }));
  }

  async findAll(userId: string, userRoles: string[], query: RequestsQueryDto) {
    this.logger.debug(`Finding all requests for user ${userId}`);
    const isProvider = userRoles && userRoles.includes('provider');
    const { page, limit, status, sort } = query;
    const skip = (page - 1) * limit;
    const take = limit;

    const orderBy: any = {};
    if (sort === RequestSort.OLDEST) {
      orderBy.createdAt = 'asc';
    } else {
      orderBy.createdAt = 'desc';
    }

    if (isProvider) {
      // Providers see all open requests
      const where: any = {
        status: {
          in: [RequestStatus.OPEN, RequestStatus.QUOTED],
        },
      };
      
      if (status) {
        where.status = status;
      }

      const [requests, total] = await Promise.all([
        this.prisma.serviceRequest.findMany({
          where,
          include: {
            vehicle: {
              select: {
                make: true,
                model: true,
                year: true,
              },
            },
            owner: {
              select: {
                name: true,
                phone: true,
              },
            },
            _count: {
              select: {
                quotes: true,
              },
            },
          },
          orderBy,
          skip,
          take,
        }),
        this.prisma.serviceRequest.count({
          where,
        }),
      ]);
      
      return {
        data: requests,
        meta: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      };
    } else {
      // Owners see only their own requests
      const where: any = {
        ownerId: userId,
      };

      if (status) {
        where.status = status;
      }

      const [requests, total] = await Promise.all([
        this.prisma.serviceRequest.findMany({
          where,
          include: {
            vehicle: true,
            _count: {
              select: {
                quotes: true,
              },
            },
          },
          orderBy,
          skip,
          take,
        }),
        this.prisma.serviceRequest.count({ where }),
      ]);
      
      return {
        data: requests,
        meta: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      };
    }
  }

  async create(userId: string, requestData: CreateRequestDto) {
    this.logger.debug(`Creating request for user ${userId}`);
    // Verify vehicle belongs to user
    const vehicle = await this.prisma.vehicle.findUnique({
      where: { id: requestData.vehicleId },
    });

    if (!vehicle) {
      throw new NotFoundException(`Vehicle with ID ${requestData.vehicleId} not found`);
    }

    if (vehicle.ownerId !== userId) {
      throw new ForbiddenException(`Access denied: You can only create service requests for vehicles you own (Vehicle ID: ${requestData.vehicleId})`);
    }

    return this.prisma.serviceRequest.create({
      data: {
        ...requestData,
        ownerId: userId,
        status: RequestStatus.OPEN,
      },
      include: {
        vehicle: true,
      },
    });
  }

  async findOne(id: string, userId: string, userRoles: string[]) {
    this.logger.debug(`Finding request ${id} for user ${userId}`);
    const request = await this.prisma.serviceRequest.findUnique({
      where: { id },
      include: {
        vehicle: true,
        owner: {
          select: {
            id: true,
            name: true,
            phone: true,
            email: true,
          },
        },
        quotes: {
          include: {
            provider: {
              select: {
                id: true,
                name: true,
                phone: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!request) {
      throw new NotFoundException(`Service request with ID ${id} not found`);
    }

    const isOwner = request.ownerId === userId;
    const isProvider = userRoles.includes('provider');

    if (!isOwner && !isProvider) {
      throw new ForbiddenException(`Access denied: You do not have access to service request ${id}`);
    }

    return request;
  }

  async update(id: string, userId: string, updateData: UpdateRequestDto) {
    const request = await this.prisma.serviceRequest.findUnique({
      where: { id },
    });

    if (!request) {
      throw new NotFoundException(`Service request with ID ${id} not found`);
    }

    if (request.ownerId !== userId) {
      throw new ForbiddenException(`Access denied: Service request ${id} belongs to another user`);
    }

    return this.prisma.serviceRequest.update({
      where: { id },
      data: updateData,
    });
  }

  /**
   * Add images to a service request
   * 
   * Appends new image URLs to the request's imageUrls array.
   * 
   * @param id - Service request UUID
   * @param imageUrls - Array of Cloudinary URLs to add
   * @returns Updated service request entity
   */
  async addImages(id: string, imageUrls: string[]) {
    const request = await this.prisma.serviceRequest.findUnique({
      where: { id },
    });

    if (!request) {
      throw new NotFoundException(`Service request with ID ${id} not found`);
    }

    return this.prisma.serviceRequest.update({
      where: { id },
      data: {
        imageUrls: {
          push: imageUrls,
        },
      },
    });
  }

  /**
   * Remove an image from a service request
   * 
   * Removes a specific image URL from the request's imageUrls array.
   * 
   * @param id - Service request UUID
   * @param imageUrl - URL to remove
   * @returns Updated service request entity
   */
  async removeImage(id: string, imageUrl: string) {
    const request = await this.prisma.serviceRequest.findUnique({
      where: { id },
    });

    if (!request) {
      throw new NotFoundException(`Service request with ID ${id} not found`);
    }

    const updatedImageUrls = request.imageUrls.filter(url => url !== imageUrl);

    return this.prisma.serviceRequest.update({
      where: { id },
      data: {
        imageUrls: updatedImageUrls,
      },
    });
  }
}
