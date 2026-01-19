import { Test, TestingModule } from '@nestjs/testing';
import { VehiclesService } from '../vehicles.service';
import { PrismaService } from '../../../infrastructure/database/prisma.service';
import { NotFoundException, ForbiddenException } from '@nestjs/common';

/**
 * VehiclesService Unit Tests
 * 
 * Tests all vehicle CRUD operations with ownership validation:
 * - Creating vehicles for users
 * - Retrieving vehicles with pagination
 * - Updating vehicle details
 * - Deleting vehicles
 * - Mileage updates
 * - Ownership authorization checks
 * 
 * Coverage target: 80%+
 */
describe('VehiclesService', () => {
  let service: VehiclesService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    vehicle: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
  };

  const mockVehicle = {
    id: 'vehicle-id',
    ownerId: 'owner-id',
    make: 'Toyota',
    model: 'Camry',
    year: 2020,
    vin: '1HGBH41JXMN109186',
    licensePlate: 'ABC123',
    color: 'Silver',
    mileage: 50000,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VehiclesService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<VehiclesService>(VehiclesService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    const ownerId = 'owner-id';
    const paginationDto = {
      page: 1,
      limit: 20,
      skip: 0,
      take: 20,
    };

    it('should return paginated vehicles for owner', async () => {
      const mockVehicles = [mockVehicle, { ...mockVehicle, id: 'vehicle-id-2' }];
      mockPrismaService.vehicle.findMany.mockResolvedValue(mockVehicles);
      mockPrismaService.vehicle.count.mockResolvedValue(2);

      const result = await service.findAll(ownerId, paginationDto);

      expect(mockPrismaService.vehicle.findMany).toHaveBeenCalledWith({
        where: { ownerId, deletedAt: null },
        orderBy: { createdAt: 'desc' },
        skip: paginationDto.skip,
        take: paginationDto.take,
      });
      expect(result.data).toHaveLength(2);
      expect(result.meta).toEqual({
        total: 2,
        page: 1,
        limit: 20,
        totalPages: 1,
        hasNextPage: false,
        hasPrevPage: false,
      });
    });

    it('should handle empty results', async () => {
      mockPrismaService.vehicle.findMany.mockResolvedValue([]);
      mockPrismaService.vehicle.count.mockResolvedValue(0);

      const result = await service.findAll(ownerId, paginationDto);

      expect(result.data).toHaveLength(0);
      expect(result.meta.total).toBe(0);
      expect(result.meta.totalPages).toBe(0);
    });
  });

  describe('create', () => {
    const ownerId = 'owner-id';
    const createVehicleDto = {
      make: 'Honda',
      model: 'Civic',
      year: 2021,
      vin: '2HGFC2F59MH123456',
      licensePlate: 'XYZ789',
      color: 'Blue',
      mileage: 15000,
    };

    it('should create a new vehicle', async () => {
      const expectedVehicle = {
        id: 'new-vehicle-id',
        ownerId,
        ...createVehicleDto,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.vehicle.create.mockResolvedValue(expectedVehicle);

      const result = await service.create(ownerId, createVehicleDto);

      expect(mockPrismaService.vehicle.create).toHaveBeenCalledWith({
        data: {
          ...createVehicleDto,
          ownerId,
        },
      });
      expect(result).toEqual(expectedVehicle);
      expect(result.ownerId).toBe(ownerId);
    });
  });

  describe('findOne', () => {
    const vehicleId = 'vehicle-id';
    const userId = 'owner-id';

    it('should return vehicle with owner details if authorized', async () => {
      const vehicleWithOwner = {
        ...mockVehicle,
        owner: {
          id: userId,
          name: 'John Doe',
          email: 'john@example.com',
          phone: '1234567890',
        },
      };

      mockPrismaService.vehicle.findUnique.mockResolvedValue(vehicleWithOwner);

      const result = await service.findOne(vehicleId, userId);

      expect(mockPrismaService.vehicle.findUnique).toHaveBeenCalledWith({
        where: { id: vehicleId, deletedAt: null },
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
      expect(result).toEqual(vehicleWithOwner);
    });

    it('should throw NotFoundException if vehicle does not exist', async () => {
      mockPrismaService.vehicle.findUnique.mockResolvedValue(null);

      await expect(service.findOne(vehicleId, userId)).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if user does not own vehicle', async () => {
      const otherUserVehicle = { ...mockVehicle, ownerId: 'other-user-id' };
      mockPrismaService.vehicle.findUnique.mockResolvedValue(otherUserVehicle);

      await expect(service.findOne(vehicleId, userId)).rejects.toThrow(ForbiddenException);
      await expect(service.findOne(vehicleId, userId)).rejects.toThrow(
        /Access denied.*belongs to another user/
      );
    });
  });

  describe('update', () => {
    const vehicleId = 'vehicle-id';
    const userId = 'owner-id';
    const updateVehicleDto = {
      mileage: 55000,
      color: 'Red',
    };

    it('should update vehicle if user owns it', async () => {
      mockPrismaService.vehicle.findUnique.mockResolvedValue(mockVehicle);
      const updatedVehicle = { ...mockVehicle, ...updateVehicleDto };
      mockPrismaService.vehicle.update.mockResolvedValue(updatedVehicle);

      const result = await service.update(vehicleId, userId, updateVehicleDto);

      expect(mockPrismaService.vehicle.findUnique).toHaveBeenCalledWith({
        where: { id: vehicleId, deletedAt: null },
      });
      expect(mockPrismaService.vehicle.update).toHaveBeenCalledWith({
        where: { id: vehicleId },
        data: updateVehicleDto,
      });
      expect(result.mileage).toBe(55000);
      expect(result.color).toBe('Red');
    });

    it('should throw NotFoundException if vehicle does not exist', async () => {
      mockPrismaService.vehicle.findUnique.mockResolvedValue(null);

      await expect(service.update(vehicleId, userId, updateVehicleDto)).rejects.toThrow(
        NotFoundException
      );
    });

    it('should throw ForbiddenException if user does not own vehicle', async () => {
      const otherUserVehicle = { ...mockVehicle, ownerId: 'other-user-id' };
      mockPrismaService.vehicle.findUnique.mockResolvedValue(otherUserVehicle);

      await expect(service.update(vehicleId, userId, updateVehicleDto)).rejects.toThrow(
        ForbiddenException
      );
    });
  });

  describe('delete', () => {
    const vehicleId = 'vehicle-id';
    const userId = 'owner-id';

    it('should delete vehicle if user owns it', async () => {
      mockPrismaService.vehicle.findUnique.mockResolvedValue(mockVehicle);
      mockPrismaService.vehicle.update.mockResolvedValue({ ...mockVehicle, deletedAt: new Date() });

      const result = await service.delete(vehicleId, userId);

      expect(mockPrismaService.vehicle.findUnique).toHaveBeenCalledWith({
        where: { id: vehicleId, deletedAt: null },
      });
      expect(mockPrismaService.vehicle.update).toHaveBeenCalledWith({
        where: { id: vehicleId },
        data: { deletedAt: expect.any(Date) },
      });
      expect(result.message).toMatch(/deleted successfully/);
    });

    it('should throw NotFoundException if vehicle does not exist', async () => {
      mockPrismaService.vehicle.findUnique.mockResolvedValue(null);

      await expect(service.delete(vehicleId, userId)).rejects.toThrow(NotFoundException);
      expect(mockPrismaService.vehicle.update).not.toHaveBeenCalled();
    });

    it('should throw ForbiddenException if user does not own vehicle', async () => {
      const otherUserVehicle = { ...mockVehicle, ownerId: 'other-user-id' };
      mockPrismaService.vehicle.findUnique.mockResolvedValue(otherUserVehicle);

      await expect(service.delete(vehicleId, userId)).rejects.toThrow(ForbiddenException);
      expect(mockPrismaService.vehicle.delete).not.toHaveBeenCalled();
    });
  });

  describe('updateMileage', () => {
    const vehicleId = 'vehicle-id';
    const userId = 'owner-id';
    const newMileage = 60000;

    it('should update mileage if user owns vehicle', async () => {
      mockPrismaService.vehicle.findUnique.mockResolvedValue(mockVehicle);
      const updatedVehicle = { ...mockVehicle, mileage: newMileage };
      mockPrismaService.vehicle.update.mockResolvedValue(updatedVehicle);

      const result = await service.updateMileage(vehicleId, userId, newMileage);

      expect(mockPrismaService.vehicle.update).toHaveBeenCalledWith({
        where: { id: vehicleId },
        data: { mileage: newMileage },
      });
      expect(result.mileage).toBe(newMileage);
    });

    it('should throw NotFoundException if vehicle does not exist', async () => {
      mockPrismaService.vehicle.findUnique.mockResolvedValue(null);

      await expect(service.updateMileage(vehicleId, userId, newMileage)).rejects.toThrow(
        NotFoundException
      );
    });

    it('should throw ForbiddenException if user does not own vehicle', async () => {
      const otherUserVehicle = { ...mockVehicle, ownerId: 'other-user-id' };
      mockPrismaService.vehicle.findUnique.mockResolvedValue(otherUserVehicle);

      await expect(service.updateMileage(vehicleId, userId, newMileage)).rejects.toThrow(
        ForbiddenException
      );
    });
  });
});
