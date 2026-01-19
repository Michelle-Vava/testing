import { Controller, Get, Put, Param, Body, UseGuards, Request, Logger, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse, ApiBody, ApiQuery } from '@nestjs/swagger';
import { JobsService } from './jobs.service';
import { UpdateJobStatusDto } from './dto/update-job-status.dto';
import { JobResponseDto } from './dto/job-response.dto';
import { PaginationDto } from '../../shared/dto/pagination.dto';
import { AuthenticatedRequest } from '../../shared/types/express-request.interface';

/**
 * JobsController handles active job management
 * 
 * Jobs represent accepted quotes that are being fulfilled.
 * Tracks job lifecycle from pending to completion with status updates.
 * Both owners and providers can view their respective jobs.
 */
@ApiTags('jobs')
@ApiBearerAuth()
@Controller('jobs')
export class JobsController {
  private readonly logger = new Logger(JobsController.name);

  constructor(private jobsService: JobsService) {}

  /**
   * Get paginated list of jobs with role-based filtering
   * 
   * Owners see jobs for their service requests.
   * Providers see jobs they are performing.
   * 
   * @param req - Authenticated request with user JWT payload
   * @param paginationDto - Pagination parameters
   * @returns Paginated list of jobs with request, vehicle, and quote data
   */
  @Get()
  @ApiOperation({ summary: 'Get all jobs (owners see theirs, providers see theirs)' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number (default: 1)' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page (default: 20, max: 100)' })
  @ApiResponse({ 
    status: 200, 
    description: 'Paginated list of jobs',
    type: [JobResponseDto]
  })
  async findAll(@Request() req: AuthenticatedRequest, @Query() paginationDto: PaginationDto) {
    this.logger.log(`User ${req.user.id} fetching all jobs`);
    return this.jobsService.findAll(req.user.id, req.user.roles, paginationDto);
  }

  /**
   * Get detailed job information
   * 
   * Returns job with full details including request, vehicle, quote, and provider info.
   * Only job owner or provider can access.
   * 
   * @param req - Authenticated request with user JWT payload
   * @param id - Job UUID
   * @returns Job entity with related data
   * @throws NotFoundException if job doesn't exist
   * @throws ForbiddenException if user is neither owner nor provider
   */
  @Get(':id')
  @ApiOperation({ summary: 'Get a specific job by ID' })
  @ApiResponse({ status: 200, description: 'Job details', type: JobResponseDto })
  @ApiResponse({ status: 404, description: 'Job not found.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async findOne(@Request() req: AuthenticatedRequest, @Param('id') id: string) {
    this.logger.log(`User ${req.user.id} fetching job ${id}`);
    return this.jobsService.findOne(id, req.user.id);
  }

  /**
   * Update job status
   * 
   * Providers update job status as work progresses (pending -> in_progress -> completed).
   * Status changes track timestamps (startedAt, completedAt).
   * 
   * @param req - Authenticated request with user JWT payload
   * @param id - Job UUID
   * @param statusData - New status and optional notes
   * @returns Updated job entity
   * @throws NotFoundException if job doesn't exist
   * @throws ForbiddenException if user is not the job's provider
   */
  @Put(':id/status')
  @ApiOperation({ summary: 'Update job status (providers only)' })
  @ApiBody({ type: UpdateJobStatusDto })
  @ApiResponse({ status: 200, description: 'Job status updated successfully', type: JobResponseDto })
  @ApiResponse({ status: 404, description: 'Job not found.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async updateStatus(@Request() req: AuthenticatedRequest, @Param('id') id: string, @Body() statusData: UpdateJobStatusDto) {
    this.logger.log(`User ${req.user.id} updating job ${id} status to ${statusData.status}`);
    return this.jobsService.updateStatus(id, req.user.id, statusData);
  }
}




