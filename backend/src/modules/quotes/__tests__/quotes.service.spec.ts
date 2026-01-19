import { Test, TestingModule } from '@nestjs/testing';
import { QuotesService } from '../quotes.service';
import { PrismaService } from '../../../infrastructure/database/prisma.service';
import { NotificationsService } from '../../notifications/notifications.service';
import { EmailService } from '../../../shared/services/email/email.service';
import { NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { QuoteStatus, RequestStatus, UserRole } from '../../../shared/enums';

/**
 * QuotesService Unit Tests
 * 
 * Tests quote management business logic:
 * - Creating quotes for requests
 * - Quote acceptance/rejection
 * - Permission validation (only providers can quote, only owners can accept)
 * - Job creation upon quote acceptance
 * 
 * Coverage target: 75%+
 */
describe('QuotesService', () => {
  let service: QuotesService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    quote: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      updateMany: jest.fn(),
    },
    serviceRequest: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    job: {
      create: jest.fn(),
      findFirst: jest.fn(), // Added for job locking check
    },
    user: {
      findUnique: jest.fn(),
    },
    $transaction: jest.fn(),
  };

  const mockNotificationsService = {
    create: jest.fn(),
  };

  const mockEmailService = {
    sendNotificationEmail: jest.fn(),
    sendQuoteAcceptedEmail: jest.fn(),
    sendQuoteRejectedEmail: jest.fn(),
  };

  const mockRequest = {
    id: 'request-id',
    ownerId: 'owner-id',
    status: RequestStatus.OPEN,
    title: 'Brake Repair',
    vehicleId: 'vehicle-id',
  };

  const mockQuote = {
    id: 'quote-id',
    requestId: 'request-id',
    providerId: 'provider-id',
    amount: '250.00',
    estimatedDuration: '2 hours',
    description: 'Brake pad replacement',
    status: QuoteStatus.PENDING,
    createdAt: new Date(),
    updatedAt: new Date(),
    provider: {
      id: 'provider-id',
      name: 'Test Provider',
      ownerProfile: {
        avatarUrl: 'http://example.com/avatar.jpg',
      },
      providerProfile: {
        businessName: 'Test Garage',
        rating: 4.5,
        reviewCount: 10,
      },
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QuotesService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: EmailService,
          useValue: mockEmailService,
        },
        {
          provide: NotificationsService,
          useValue: mockNotificationsService,
        },
      ],
    }).compile();

    service = module.get<QuotesService>(QuotesService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findByRequest', () => {
    const userId = 'owner-id';
    const userRoles = [UserRole.OWNER];

    it('should return all quotes for a request', async () => {
      const quotes = [mockQuote];

      mockPrismaService.serviceRequest.findUnique.mockResolvedValue(mockRequest);
      mockPrismaService.quote.findMany.mockResolvedValue(quotes);

      const result = await service.findByRequest(mockRequest.id, userId, userRoles);

      expect(mockPrismaService.serviceRequest.findUnique).toHaveBeenCalledWith({
        where: { id: mockRequest.id },
      });
      expect(mockPrismaService.quote.findMany).toHaveBeenCalledWith({
        where: { requestId: mockRequest.id },
        include: expect.objectContaining({
          provider: { select: expect.any(Object) },
        }),
        orderBy: { createdAt: 'desc' },
      });
      // QuoteEntity wraps the raw quote data
      expect(result).toHaveLength(1);
      expect(result[0]).toBeInstanceOf(Object);
      expect(result[0].id).toBe(mockQuote.id);
      expect(result[0].amount).toBe(mockQuote.amount);
      expect(result[0].provider?.id).toBe(mockQuote.provider.id);
      expect(result[0].provider?.name).toBe(mockQuote.provider.name);
    });
  });

  describe('create', () => {
    const userId = 'provider-id';
    const userRoles = [UserRole.PROVIDER];
    const createQuoteDto = {
      requestId: 'request-id',
      amount: '250.00',
      estimatedDuration: '2 hours',
      description: 'Brake pad replacement',
    };

    it('should create a new quote for a request', async () => {
      mockPrismaService.serviceRequest.findUnique.mockResolvedValue(mockRequest);
      mockPrismaService.quote.create.mockResolvedValue(mockQuote);

      const result = await service.create(userId, userRoles, createQuoteDto);

      expect(mockPrismaService.serviceRequest.findUnique).toHaveBeenCalledWith({
        where: { id: createQuoteDto.requestId },
      });
      expect(mockPrismaService.quote.create).toHaveBeenCalled();
      expect(result.providerId).toBe(userId);
    });

    it('should throw NotFoundException if request does not exist', async () => {
      mockPrismaService.serviceRequest.findUnique.mockResolvedValue(null);

      await expect(service.create(userId, userRoles, createQuoteDto)).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if request is not open', async () => {
      mockPrismaService.serviceRequest.findUnique.mockResolvedValue({
        ...mockRequest,
        status: RequestStatus.IN_PROGRESS,
      });

      await expect(service.create(userId, userRoles, createQuoteDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('accept', () => {
    const quoteId = 'quote-id';
    const userId = 'owner-id';

    it('should accept a quote and create a job', async () => {
      const quoteWithRequest = {
        ...mockQuote,
        request: mockRequest,
      };

      const updatedQuote = {
        ...mockQuote,
        status: QuoteStatus.ACCEPTED,
      };

      const createdJob = {
        id: 'job-id',
        requestId: mockRequest.id,
        quoteId: quoteId,
        providerId: mockQuote.providerId,
        ownerId: userId,
      };

      mockPrismaService.quote.findUnique.mockResolvedValue(quoteWithRequest);
      mockPrismaService.job.findFirst.mockResolvedValue(null); // No existing job (job locking check)
      // Mock the transaction properly
      mockPrismaService.$transaction.mockImplementation(async (callback) => {
        return callback(mockPrismaService);
      });
      mockPrismaService.quote.update.mockResolvedValue(updatedQuote);
      mockPrismaService.job.create.mockResolvedValue(createdJob);

      const result = await service.accept(quoteId, userId);

      expect(mockPrismaService.quote.findUnique).toHaveBeenCalledWith({
        where: { id: quoteId },
        include: { request: true },
      });
      expect(mockPrismaService.job.findFirst).toHaveBeenCalledWith({
        where: { requestId: mockRequest.id },
      });
      expect(result.quote.status).toBe(QuoteStatus.ACCEPTED);
      expect(result.job).toBeDefined();
    });

    it('should throw NotFoundException if quote not found', async () => {
      mockPrismaService.quote.findUnique.mockResolvedValue(null);

      await expect(service.accept(quoteId, userId)).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if user is not the request owner', async () => {
      const quoteWithRequest = {
        ...mockQuote,
        request: { ...mockRequest, ownerId: 'different-owner' },
      };

      mockPrismaService.quote.findUnique.mockResolvedValue(quoteWithRequest);

      await expect(service.accept(quoteId, userId)).rejects.toThrow(ForbiddenException);
    });

    it('should throw BadRequestException if quote is already accepted', async () => {
      const quoteWithRequest = {
        ...mockQuote,
        status: QuoteStatus.ACCEPTED,
        request: mockRequest,
      };

      mockPrismaService.quote.findUnique.mockResolvedValue(quoteWithRequest);

      await expect(service.accept(quoteId, userId)).rejects.toThrow(BadRequestException);
    });
  });

  describe('reject', () => {
    const quoteId = 'quote-id';
    const userId = 'owner-id';

    it('should reject a quote', async () => {
      const quoteWithRequest = {
        ...mockQuote,
        request: mockRequest,
      };

      const updatedQuote = {
        ...mockQuote,
        status: QuoteStatus.REJECTED,
      };

      mockPrismaService.quote.findUnique.mockResolvedValue(quoteWithRequest);
      mockPrismaService.quote.update.mockResolvedValue(updatedQuote);

      const result = await service.reject(quoteId, userId);

      expect(mockPrismaService.quote.update).toHaveBeenCalledWith({
        where: { id: quoteId },
        data: { status: QuoteStatus.REJECTED },
      });
      expect(result.status).toBe(QuoteStatus.REJECTED);
    });

    it('should throw NotFoundException if quote not found', async () => {
      mockPrismaService.quote.findUnique.mockResolvedValue(null);

      await expect(service.reject(quoteId, userId)).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if user is not the request owner', async () => {
      const quoteWithRequest = {
        ...mockQuote,
        request: { ...mockRequest, ownerId: 'different-owner' },
      };

      mockPrismaService.quote.findUnique.mockResolvedValue(quoteWithRequest);

      await expect(service.reject(quoteId, userId)).rejects.toThrow(ForbiddenException);
    });
  });
});
