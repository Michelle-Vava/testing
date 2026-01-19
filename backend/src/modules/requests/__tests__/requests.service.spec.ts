import { Test, TestingModule } from '@nestjs/testing';
import { RequestsService } from '../requests.service';
import { PrismaService } from '../../../infrastructure/database/prisma.service';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { RequestStatus, UserRole } from '../../../shared/enums';

/**
 * RequestsService Unit Tests
 * 
 * Tests service request management business logic:
 * - Creating service requests
 * - Role-based request filtering (owners vs providers)
 * - Request updates with ownership validation
 * - Public request viewing for landing page
 * 
 * Coverage target: 75%+
 */
describe('RequestsService', () => {
  let service: RequestsService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    serviceRequest: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      count: jest.fn(),
    },
    vehicle: {
      findUnique: jest.fn(),
    },
  };

  const mockRequest = {
    id: 'request-id',
    vehicleId: 'vehicle-id',
    ownerId: 'owner-id',
    title: 'Oil Change',
    description: 'Need oil change for my car',
    urgency: 'medium',
    status: RequestStatus.OPEN,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RequestsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<RequestsService>(RequestsService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findPublicRecent', () => {
    it('should return recent open/quoted requests for public view', async () => {
      const publicRequests = [
        {
          ...mockRequest,
          vehicle: { make: 'Toyota', model: 'Camry', year: 2020 },
          quotes: [{ id: 'q1' }, { id: 'q2' }, { id: 'q3' }],
        },
      ];

      mockPrismaService.serviceRequest.findMany.mockResolvedValue(publicRequests);

      const result = await service.findPublicRecent();

      expect(mockPrismaService.serviceRequest.findMany).toHaveBeenCalledWith({
        where: {
          status: {
            in: [RequestStatus.OPEN, RequestStatus.QUOTED],
          },
          deletedAt: null,
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
      expect(result).toHaveLength(1);
      expect(result[0]).toHaveProperty('vehicle');
      expect(result[0]).toHaveProperty('quoteCount');
    });
  });

  describe('findAll', () => {
    const paginationDto = {
      page: 1,
      limit: 20,
      skip: 0,
      take: 20,
    };

    it('should return all open requests for providers', async () => {
      const userId = 'provider-id';
      const userRoles = [UserRole.PROVIDER];
      const openRequests = [mockRequest];

      mockPrismaService.serviceRequest.findMany.mockResolvedValue(openRequests);
      mockPrismaService.serviceRequest.count.mockResolvedValue(1);

      const result = await service.findAll(userId, userRoles, paginationDto);

      expect(mockPrismaService.serviceRequest.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            status: {
              in: [RequestStatus.OPEN, RequestStatus.QUOTED],
            },
            deletedAt: null,
          }),
        })
      );
      expect(result.data).toHaveLength(1);
      expect(result.meta.total).toBe(1);
    });

    it('should return only own requests for owners', async () => {
      const userId = 'owner-id';
      const userRoles = [UserRole.OWNER];
      const ownRequests = [mockRequest];

      mockPrismaService.serviceRequest.findMany.mockResolvedValue(ownRequests);
      mockPrismaService.serviceRequest.count.mockResolvedValue(1);

      const result = await service.findAll(userId, userRoles, paginationDto);

      expect(mockPrismaService.serviceRequest.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { ownerId: userId, deletedAt: null },
        })
      );
      expect(result.data).toHaveLength(1);
    });
  });

  describe('create', () => {
    const userId = 'owner-id';
    const createRequestDto = {
      vehicleId: 'vehicle-id',
      title: 'Brake Service',
      description: 'Need brake pads replaced',
      urgency: 'high' as any, // Type assertion for test
    };

    it('should create a new service request', async () => {
      const mockVehicle = {
        id: createRequestDto.vehicleId,
        ownerId: userId,
        make: 'Toyota',
        model: 'Camry',
      };

      const createdRequest = {
        id: 'new-request-id',
        ownerId: userId,
        ...createRequestDto,
        status: RequestStatus.OPEN,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.vehicle.findUnique.mockResolvedValue(mockVehicle);
      mockPrismaService.serviceRequest.create.mockResolvedValue(createdRequest);

      const result = await service.create(userId, createRequestDto);

      expect(mockPrismaService.vehicle.findUnique).toHaveBeenCalledWith({
        where: { id: createRequestDto.vehicleId },
      });
      expect(mockPrismaService.serviceRequest.create).toHaveBeenCalledWith({
        data: {
          ...createRequestDto,
          ownerId: userId,
          status: RequestStatus.OPEN,
        },
        include: { vehicle: true },
      });
      expect(result.ownerId).toBe(userId);
      expect(result.status).toBe(RequestStatus.OPEN);
    });
  });

  describe('findOne', () => {
    const requestId = 'request-id';

    it('should return request for owner', async () => {
      const userId = 'owner-id';
      const userRoles = [UserRole.OWNER];

      const requestWithDetails = {
        ...mockRequest,
        vehicle: { make: 'Honda', model: 'Civic', year: 2019 },
        quotes: [],
      };

      mockPrismaService.serviceRequest.findUnique.mockResolvedValue(requestWithDetails);

      const result = await service.findOne(requestId, userId, userRoles);

      expect(result).toEqual(requestWithDetails);
    });

    it('should return request for provider', async () => {
      const userId = 'provider-id';
      const userRoles = [UserRole.PROVIDER];

      const requestWithDetails = {
        ...mockRequest,
        vehicle: { make: 'Honda', model: 'Civic', year: 2019 },
        quotes: [],
      };

      mockPrismaService.serviceRequest.findUnique.mockResolvedValue(requestWithDetails);

      const result = await service.findOne(requestId, userId, userRoles);

      expect(result).toEqual(requestWithDetails);
    });

    it('should throw NotFoundException if request does not exist', async () => {
      const userId = 'owner-id';
      const userRoles = [UserRole.OWNER];

      mockPrismaService.serviceRequest.findUnique.mockResolvedValue(null);

      await expect(service.findOne(requestId, userId, userRoles)).rejects.toThrow(
        NotFoundException
      );
    });

    it('should throw ForbiddenException if owner tries to view another owner request', async () => {
      const userId = 'other-owner-id';
      const userRoles = [UserRole.OWNER];

      const otherOwnerRequest = { ...mockRequest, ownerId: 'owner-id' };
      mockPrismaService.serviceRequest.findUnique.mockResolvedValue(otherOwnerRequest);

      await expect(service.findOne(requestId, userId, userRoles)).rejects.toThrow(
        ForbiddenException
      );
    });
  });

  describe('update', () => {
    const requestId = 'request-id';
    const userId = 'owner-id';
    const updateDto = {
      title: 'Updated Title',
      urgency: 'urgent' as any, // Type assertion for test
    };

    it('should update request if user owns it', async () => {
      mockPrismaService.serviceRequest.findUnique.mockResolvedValue(mockRequest);
      const updatedRequest = { ...mockRequest, ...updateDto };
      mockPrismaService.serviceRequest.update.mockResolvedValue(updatedRequest);

      const result = await service.update(requestId, userId, updateDto);

      expect(mockPrismaService.serviceRequest.update).toHaveBeenCalledWith({
        where: { id: requestId },
        data: updateDto,
      });
      expect(result.title).toBe('Updated Title');
      expect(result.urgency).toBe('urgent');
    });

    it('should throw NotFoundException if request does not exist', async () => {
      mockPrismaService.serviceRequest.findUnique.mockResolvedValue(null);

      await expect(service.update(requestId, userId, updateDto)).rejects.toThrow(
        NotFoundException
      );
    });

    it('should throw ForbiddenException if user does not own request', async () => {
      const otherOwnerRequest = { ...mockRequest, ownerId: 'other-owner-id' };
      mockPrismaService.serviceRequest.findUnique.mockResolvedValue(otherOwnerRequest);

      await expect(service.update(requestId, userId, updateDto)).rejects.toThrow(
        ForbiddenException
      );
    });
  });
});
