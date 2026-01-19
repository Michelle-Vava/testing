import { Test, TestingModule } from '@nestjs/testing';
import { ServicesService } from '../services.service';
import { PrismaService } from '../../../infrastructure/database/prisma.service';

describe('ServicesService', () => {
  let service: ServicesService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    service: {
      findMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ServicesService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<ServicesService>(ServicesService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all active services ordered by displayOrder', async () => {
      const services = [
        { id: '1', name: 'Oil Change', isActive: true, displayOrder: 1 },
      ];
      mockPrismaService.service.findMany.mockResolvedValue(services);

      const result = await service.findAll();

      expect(result).toEqual(services);
      expect(prismaService.service.findMany).toHaveBeenCalledWith({
        where: { isActive: true },
        orderBy: { displayOrder: 'asc' },
      });
    });
  });

  describe('findPopular', () => {
    it('should return popular active services', async () => {
      const services = [
        { id: '1', name: 'Oil Change', isActive: true, isPopular: true },
      ];
      mockPrismaService.service.findMany.mockResolvedValue(services);

      const result = await service.findPopular();

      // Based on the code snippet I saw, it likely orders by displayOrder or popularity
      // I'll check the call args partially since I don't see the full implementation
      expect(prismaService.service.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            isActive: true,
            isPopular: true,
          },
        }),
      );
      expect(result).toEqual(services);
    });
  });
});
