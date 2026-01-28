import { Controller, Get, Post, Body, Param, Request, ForbiddenException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { QuotesService } from './quotes.service';
import { CreateQuoteDto } from './dto/create-quote.dto';
import { AuthenticatedRequest } from '../../shared/types/express-request.interface';

/**
 * QuotesController handles quote management for service requests
 * 
 * Providers create quotes on service requests, owners review and accept/reject them.
 * Accepting a quote creates a job and changes request status.
 */
@ApiTags('quotes')
@ApiBearerAuth()
@Controller('quotes')
export class QuotesController {
  constructor(private quotesService: QuotesService) {}

  /**
   * Get all quotes for a specific service request
   * 
   * Request owner and providers can view quotes. Returns quote details with provider info.
   * 
   * @param req - Authenticated request with user JWT payload
   * @param requestId - Service request UUID to get quotes for
   * @returns List of quotes for the request
   * @throws ForbiddenException if user lacks permission to view quotes
   */
  @Get('request/:requestId')
  @ApiOperation({ summary: 'Get all quotes for a service request' })
  async findByRequest(@Request() req: AuthenticatedRequest, @Param('requestId') requestId: string) {
    return this.quotesService.findByRequest(requestId, req.user.id, req.user.roles);
  }

  /**
   * Create a new quote on a service request
   * 
   * Providers submit quotes with pricing, timeline, and service details.
   * Only users with 'provider' role and active status can create quotes.
   * 
   * @param req - Authenticated request with user JWT payload
   * @param quoteData - Quote details (requestId, amount, estimatedDuration, description, warranty)
   * @returns Created quote entity
   * @throws ForbiddenException if user is not an active provider
   */
  @Post()
  @ApiOperation({ summary: 'Create a new quote (active providers only)' })
  async create(@Request() req: AuthenticatedRequest, @Body() quoteData: CreateQuoteDto) {
    // Note: providerIsActive check should be done in guard or service
    if (!req.user.roles?.includes('provider')) {
      throw new ForbiddenException('Only providers can submit quotes. Complete onboarding first.');
    }
    return this.quotesService.create(req.user.id, req.user.roles, quoteData);
  }

  /**
   * Accept a quote and create a job
   * 
   * Owner accepts provider's quote, which creates a job and updates request status.
   * Automatically rejects all other quotes on the same request.
   * 
   * @param req - Authenticated request with user JWT payload
   * @param id - Quote UUID to accept
   * @returns Created job entity
   * @throws ForbiddenException if user doesn't own the request
   * @throws BadRequestException if quote already accepted/rejected
   */
  @Post(':id/accept')
  @ApiOperation({ summary: 'Accept a quote (creates a job)' })
  async accept(@Request() req: AuthenticatedRequest, @Param('id') id: string) {
    return this.quotesService.accept(id, req.user.id);
  }

  /**
   * Reject a quote
   * 
   * Owner declines provider's quote. Quote status changes to 'rejected'.
   * 
   * @param req - Authenticated request with user JWT payload
   * @param id - Quote UUID to reject
   * @returns Updated quote entity
   * @throws ForbiddenException if user doesn't own the request
   */
  @Post(':id/reject')
  @ApiOperation({ summary: 'Reject a quote' })
  async reject(@Request() req: AuthenticatedRequest, @Param('id') id: string) {
    return this.quotesService.reject(id, req.user.id);
  }
}



