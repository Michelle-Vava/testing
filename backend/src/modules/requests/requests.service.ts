import { Injectable, NotFoundException, ForbiddenException, Logger } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { CreateRequestDto } from './dto/create-request.dto';
import { UpdateRequestDto } from './dto/update-request.dto';
import { PaginationDto } from '../../shared/dto/pagination.dto';
import { RequestStatus } from '../../shared/enums';

@Injectable()
export class RequestsService {
  private readonly logger = new Logger(RequestsService.name);

  constructor(private prisma: PrismaService) {}

  async findPublicRecent() {
    this.logger.debug('Finding recent public requests');
    return this.prisma.serviceRequest.findMany({
      where: {
        status: {
          in: [RequestStatus.OPEN, RequestStatus.QUOTED],
        },
      },
      take: 4,
      include: {
        vehicle: {
          select: {
            make: true,
            model: true,
            year: true,
          },
        },
        _count: {
          select: {
            quotes: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findAll(userId: string, userRoles: string[], paginationDto: PaginationDto) {
    this.logger.debug(`Finding all requests for user ${userId}`);
    const isProvider = userRoles && userRoles.includes('provider');
    const { skip, take } = paginationDto;

    if (isProvider) {
      // Providers see all open requests
      const [requests, total] = await Promise.all([
        this.prisma.serviceRequest.findMany({
          where: {
            status: {
              in: [RequestStatus.OPEN, RequestStatus.QUOTED],
            },
          },
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
          orderBy: { createdAt: 'desc' },
          skip,
          take,
        }),
        this.prisma.serviceRequest.count({
          where: {
            status: {
              in: [RequestStatus.OPEN, RequestStatus.QUOTED],
            },
          },
        }),
      ]);
      
      return {
        data: requests,
        meta: {
          total,
          page: paginationDto.page,
          limit: paginationDto.limit,
          totalPages: Math.ceil(total / paginationDto.limit),
        },
      };
    } else {
      // Owners see only their own requests
      const [requests, total] = await Promise.all([
        this.prisma.serviceRequest.findMany({
          where: { ownerId: userId },
          include: {
            vehicle: true,
            _count: {
              select: {
                quotes: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
          skip,
          take,
        }),
        this.prisma.serviceRequest.count({ where: { ownerId: userId } }),
      ]);
      
      return {
        data: requests,
        meta: {
          total,
          page: paginationDto.page,
          limit: paginationDto.limit,
          totalPages: Math.ceil(total / paginationDto.limit),
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
      throw new NotFoundException('Service request not found');
    }

    const isOwner = request.ownerId === userId;
    const isProvider = userRoles.includes('provider');

    if (!isOwner && !isProvider) {
      throw new ForbiddenException('You do not have access to this request');
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
}
