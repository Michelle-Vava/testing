import { Test, TestingModule } from '@nestjs/testing';
import { JobsService } from './jobs.service';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { JobStatus, UserRole } from '../../shared/enums';

/**
 * JobsService Unit Tests
 * 
 * Tests job management business logic:
 * - Fetching jobs (owners see their requests, providers see accepted jobs)
 * - Job status updates (progress tracking, completion)
 * - Permission validation for status changes
 * - Job completion workflow
 * 
 * Coverage target: 75%+
 */
describe('JobsService', () => {
  let service: JobsService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    job: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      count: jest.fn(),
    },
    serviceRequest: {
      update: jest.fn(),
    },
    $transaction: jest.fn(),
  };

  const mockJob = {
    id: 'job-id',
    requestId: 'request-id',
    quoteId: 'quote-id',
    providerId: 'provider-id',
    ownerId: 'owner-id',
    status: JobStatus.PENDING,
    scheduledFor: new Date('2024-01-15'),
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JobsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<JobsService>(JobsService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    const paginationDto = { page: 1, limit: 10, skip: 0, take: 10 };

    it('should return jobs for owner (jobs from their requests)', async () => {
      const userId = 'owner-id';
      const userRoles = [UserRole.OWNER];
      const jobs = [mockJob];

      mockPrismaService.job.findMany.mockResolvedValue(jobs);
      mockPrismaService.job.count.mockResolvedValue(1);

      const result = await service.findAll(userId, userRoles, paginationDto);

      expect(mockPrismaService.job.findMany).toHaveBeenCalledWith({
        where: { ownerId: userId },
        include: expect.objectContaining({
          request: expect.any(Object),
          quote: true,
        }),
        skip: 0,
        take: 10,
        orderBy: { createdAt: 'desc' },
      });
      expect(result.data).toEqual(jobs);
      expect(result.meta.total).toBe(1);
    });

    it('should return jobs for provider (jobs they are assigned to)', async () => {
      const userId = 'provider-id';
      const userRoles = [UserRole.PROVIDER];
      const jobs = [mockJob];

      mockPrismaService.job.findMany.mockResolvedValue(jobs);
      mockPrismaService.job.count.mockResolvedValue(1);

      const result = await service.findAll(userId, userRoles, paginationDto);

      expect(mockPrismaService.job.findMany).toHaveBeenCalledWith({
        where: { providerId: userId },
        include: expect.objectContaining({
          request: expect.any(Object),
          quote: true,
        }),
        skip: 0,
        take: 10,
        orderBy: { createdAt: 'desc' },
      });
      expect(result.data).toEqual(jobs);
    });

    it('should calculate correct pagination metadata', async () => {
      const userId = 'owner-id';
      const userRoles = [UserRole.OWNER];
      const jobs = [mockJob];
      const total = 25;

      mockPrismaService.job.findMany.mockResolvedValue(jobs);
      mockPrismaService.job.count.mockResolvedValue(total);

      const result = await service.findAll(userId, userRoles, paginationDto);

      expect(result.meta).toEqual({
        total: 25,
        page: 1,
        limit: 10,
        totalPages: 3,
      });
    });
  });

  describe('findOne', () => {
    const jobId = 'job-id';

    it('should return a job by ID for owner', async () => {
      const userId = 'owner-id';
      const userRoles = [UserRole.OWNER];

      mockPrismaService.job.findUnique.mockResolvedValue(mockJob);

      mockPrismaService.job.findUnique.mockResolvedValue(mockJob);

      const result = await service.findOne(jobId, userId);

      expect(mockPrismaService.job.findUnique).toHaveBeenCalledWith({
        where: { id: jobId },
        include: expect.objectContaining({
          request: expect.any(Object),
          quote: true,
        }),
      });
      expect(result).toEqual(mockJob);
    });

    it('should return a job by ID for provider', async () => {
      const userId = 'provider-id';

      mockPrismaService.job.findUnique.mockResolvedValue(mockJob);

      const result = await service.findOne(jobId, userId);

      expect(result).toEqual(mockJob);
    });

    it('should throw NotFoundException if job does not exist', async () => {
      const userId = 'owner-id';

      mockPrismaService.job.findUnique.mockResolvedValue(null);

      await expect(service.findOne(jobId, userId)).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if user does not own the job', async () => {
      const userId = 'different-user-id';
      const job = { ...mockJob, ownerId: 'owner-id', providerId: 'provider-id' };

      mockPrismaService.job.findUnique.mockResolvedValue(job);

      await expect(service.findOne(jobId, userId)).rejects.toThrow(ForbiddenException);
    });
  });

  describe('updateStatus', () => {
    const jobId = 'job-id';
    const userId = 'provider-id';

    it('should update job status to IN_PROGRESS', async () => {
      const updateDto = { status: JobStatus.IN_PROGRESS };
      const updatedJob = { ...mockJob, status: JobStatus.IN_PROGRESS };

      mockPrismaService.job.findUnique.mockResolvedValue(mockJob);
      mockPrismaService.$transaction.mockImplementation(async (callback) => {
        return callback(mockPrismaService);
      });
      mockPrismaService.job.update.mockResolvedValue(updatedJob);

      const result = await service.updateStatus(jobId, userId, updateDto);

      expect(result.status).toBe(JobStatus.IN_PROGRESS);
    });

    it('should update job status to COMPLETED with completion date', async () => {
      const updateDto = { status: JobStatus.COMPLETED };
      const updatedJob = { ...mockJob, status: JobStatus.COMPLETED, completedAt: new Date() };

      mockPrismaService.job.findUnique.mockResolvedValue(mockJob);
      mockPrismaService.$transaction.mockImplementation(async (callback) => {
        return callback(mockPrismaService);
      });
      mockPrismaService.job.update.mockResolvedValue(updatedJob);

      const result = await service.updateStatus(jobId, userId, updateDto);

      expect(result.status).toBe(JobStatus.COMPLETED);
      expect(result.completedAt).toBeDefined();
    });

    it('should throw NotFoundException if job does not exist', async () => {
      const updateDto = { status: JobStatus.IN_PROGRESS };

      mockPrismaService.job.findUnique.mockResolvedValue(null);

      await expect(service.updateStatus(jobId, userId, updateDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw ForbiddenException if provider tries to update another provider\'s job', async () => {
      const updateDto = { status: JobStatus.IN_PROGRESS };
      const job = { ...mockJob, providerId: 'different-provider', ownerId: 'owner-id' };

      mockPrismaService.job.findUnique.mockResolvedValue(job);

      await expect(service.updateStatus(jobId, userId, updateDto)).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('should throw BadRequestException if trying to update completed job', async () => {
      const updateDto = { status: JobStatus.IN_PROGRESS };
      const completedJob = { ...mockJob, status: JobStatus.COMPLETED, providerId: userId };

      mockPrismaService.job.findUnique.mockResolvedValue(completedJob);

      await expect(service.updateStatus(jobId, userId, updateDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
