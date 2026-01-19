import { Test, TestingModule } from '@nestjs/testing';
import { MessagesService } from '../messages.service';
import { PrismaService } from '../../../infrastructure/database/prisma.service';
import { EmailService } from '../../../shared/services/email/email.service';
import { NotFoundException, ForbiddenException } from '@nestjs/common';

describe('MessagesService', () => {
  let service: MessagesService;
  let prisma: PrismaService;
  let emailService: EmailService;

  const mockPrisma = {
    job: {
      findUnique: jest.fn(),
    },
    conversation: {
      findFirst: jest.fn(),
      create: jest.fn(),
      findMany: jest.fn(),
    },
    message: {
      create: jest.fn(),
      updateMany: jest.fn(),
      count: jest.fn(),
    },
    $transaction: jest.fn(),
  };

  const mockEmailService = {
    sendNewMessageNotification: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MessagesService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: EmailService, useValue: mockEmailService },
      ],
    }).compile();

    service = module.get<MessagesService>(MessagesService);
    prisma = module.get<PrismaService>(PrismaService);
    emailService = module.get<EmailService>(EmailService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getOrCreateConversation', () => {
    const mockJob = {
      id: 'job-1',
      ownerId: 'user-1',
      providerId: 'provider-1',
      owner: { id: 'user-1', name: 'Owner' },
      provider: { id: 'provider-1', name: 'Provider' },
    };

    it('should throw NotFoundException when job not found', async () => {
      mockPrisma.job.findUnique.mockResolvedValue(null);

      await expect(
        service.getOrCreateConversation('invalid-job', 'user-1')
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException when user not part of job', async () => {
      mockPrisma.job.findUnique.mockResolvedValue(mockJob);

      await expect(
        service.getOrCreateConversation('job-1', 'unauthorized-user')
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('getConversations', () => {
    it('should call findMany with correct userId filter', async () => {
      const mockConversations = [
        { 
          id: 'conv-1', 
          ownerId: 'user-1', 
          providerId: 'provider-1',
          owner: { id: 'user-1', name: 'Owner', ownerProfile: { avatarUrl: null } },
          provider: { 
            id: 'provider-1', 
            name: 'Provider', 
            ownerProfile: { avatarUrl: null }, 
            providerProfile: { businessName: 'Test Business' } 
          },
          job: { id: 'job-1', title: 'Test Job', request: { title: 'Test Request' } },
          messages: [],
          _count: { messages: 0 },
        },
      ];
      mockPrisma.conversation.findMany.mockResolvedValue(mockConversations);

      const result = await service.getConversations('user-1');

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(1);
      expect(mockPrisma.conversation.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            OR: expect.arrayContaining([
              { ownerId: 'user-1' },
              { providerId: 'user-1' },
            ]),
          }),
        })
      );
    });
  });
});
