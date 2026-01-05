import { Controller, Get, Post, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AuthenticatedRequest } from '../../shared/types/express-request.interface';

@ApiTags('payments')
@ApiBearerAuth()
@Controller('payments')
@UseGuards(JwtAuthGuard)
export class PaymentsController {
  constructor(private paymentsService: PaymentsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all payments/transactions' })
  async listTransactions(@Request() req: AuthenticatedRequest) {
    return this.paymentsService.listTransactions(req.user.sub, req.user.roles);
  }

  @Post('charge/:jobId')
  @ApiOperation({ summary: 'Create a payment charge for a completed job' })
  async createCharge(@Request() req: AuthenticatedRequest, @Param('jobId') jobId: string) {
    return this.paymentsService.createCharge(jobId, req.user.sub);
  }

  @Post('payout/:jobId')
  @ApiOperation({ summary: 'Request payout for a paid job (providers only)' })
  async createPayout(@Request() req: AuthenticatedRequest, @Param('jobId') jobId: string) {
    return this.paymentsService.createPayout(jobId, req.user.sub);
  }
}
