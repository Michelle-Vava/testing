import { Test, TestingModule } from '@nestjs/testing';
import { MaintenanceService } from './maintenance.service';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { NotFoundException, ForbiddenException } from '@nestjs/common';

describe('MaintenanceService', () => {
  let service: MaintenanceService;
  let prisma: PrismaService;

  const mockPrismaService = {
    vehicle: {
      findUnique: jest.fn(),
    },
    maintenanceRecord: {
      findMany: jest.fn(),
      create: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MaintenanceService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<MaintenanceService>(MaintenanceService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAllForVehicle', () => {
    it('should return maintenance records for a vehicle', async () => {
      const vehicleId = 'vehicle-1';
      const userId = 'user-1';
      const records = [{ id: 'record-1', serviceType: 'Oil Change' }];

      mockPrismaService.vehicle.findUnique.mockResolvedValue({ id: vehicleId, ownerId: userId });
      mockPrismaService.maintenanceRecord.findMany.mockResolvedValue(records);

      const result = await service.findAllForVehicle(vehicleId, userId);
      expect(result).toEqual(records);
    });

    it('should throw NotFoundException if vehicle not found', async () => {
      mockPrismaService.vehicle.findUnique.mockResolvedValue(null);

      await expect(service.findAllForVehicle('invalid', 'user-1')).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if user does not own vehicle', async () => {
      mockPrismaService.vehicle.findUnique.mockResolvedValue({ id: 'vehicle-1', ownerId: 'other-user' });

      await expect(service.findAllForVehicle('vehicle-1', 'user-1')).rejects.toThrow(ForbiddenException);
    });
  });

  describe('create', () => {
    it('should create a maintenance record', async () => {
      const vehicleId = 'vehicle-1';
      const userId = 'user-1';
      const dto = {
        serviceType: 'Oil Change',
        serviceDate: '2023-01-01',
        mileage: 10000,
        cost: 50,
        notes: 'Regular service',
      };

      mockPrismaService.vehicle.findUnique.mockResolvedValue({ id: vehicleId, ownerId: userId });
      mockPrismaService.maintenanceRecord.create.mockResolvedValue({ id: 'record-1', ...dto });

      const result = await service.create(vehicleId, userId, dto);
      expect(result).toHaveProperty('id');
      expect(result.serviceType).toBe(dto.serviceType);
    });
  });
});
