import { Test, TestingModule } from '@nestjs/testing';
import { PartsService } from '../parts.service';
import { PrismaService } from '../../../infrastructure/database/prisma.service';
import { NotFoundException, ForbiddenException } from '@nestjs/common';

describe('PartsService', () => {
  let service: PartsService;
  let prisma: PrismaService;

  const mockPrisma = {
    partInventory: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PartsService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<PartsService>(PartsService);
    prisma = module.get<PrismaService>(PrismaService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new part listing', async () => {
      const mockPart = {
        id: 'part-1',
        providerId: 'provider-1',
        name: 'Brake Pads',
        category: 'brakes',
        condition: 'AFTERMARKET',
        price: 45.00,
        notes: 'Fits 2011-2015 Honda Civic',
        isActive: true,
      };
      mockPrisma.partInventory.create.mockResolvedValue(mockPart);

      const result = await service.create('provider-1', {
        name: 'Brake Pads',
        category: 'brakes',
        condition: 'AFTERMARKET',
        price: 45.00,
        notes: 'Fits 2011-2015 Honda Civic',
      });

      expect(result).toEqual(mockPart);
      expect(mockPrisma.partInventory.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          providerId: 'provider-1',
          name: 'Brake Pads',
        }),
      });
    });
  });

  describe('findByProvider', () => {
    it('should return parts for a provider', async () => {
      const mockParts = [
        { id: 'part-1', name: 'Brake Pads' },
        { id: 'part-2', name: 'Oil Filter' },
      ];
      mockPrisma.partInventory.findMany.mockResolvedValue(mockParts);

      const result = await service.findByProvider('provider-1');

      expect(result).toEqual(mockParts);
      expect(mockPrisma.partInventory.findMany).toHaveBeenCalledWith({
        where: { providerId: 'provider-1' },
        orderBy: { createdAt: 'desc' },
      });
    });
  });

  describe('remove', () => {
    it('should throw NotFoundException when part not found', async () => {
      mockPrisma.partInventory.findUnique.mockResolvedValue(null);

      await expect(
        service.remove('provider-1', 'invalid-part')
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException when provider does not own part', async () => {
      mockPrisma.partInventory.findUnique.mockResolvedValue({
        id: 'part-1',
        providerId: 'other-provider',
      });

      await expect(
        service.remove('provider-1', 'part-1')
      ).rejects.toThrow(ForbiddenException);
    });

    it('should delete part when provider owns it', async () => {
      const mockPart = { id: 'part-1', providerId: 'provider-1' };
      mockPrisma.partInventory.findUnique.mockResolvedValue(mockPart);
      mockPrisma.partInventory.delete.mockResolvedValue(mockPart);

      const result = await service.remove('provider-1', 'part-1');

      expect(result).toEqual(mockPart);
      expect(mockPrisma.partInventory.delete).toHaveBeenCalledWith({
        where: { id: 'part-1' },
      });
    });
  });
});
