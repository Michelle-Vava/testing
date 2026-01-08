import { Controller, Post, Body, Headers, BadRequestException, RawBodyRequest, Req } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import { Request } from 'express';

@ApiTags('webhooks')
@Controller('webhooks')
export class WebhooksController {
  constructor(private paymentsService: PaymentsService) {}

  /**
   * Stripe webhook endpoint
   * 
   * Receives and processes webhook events from Stripe to keep payment status in sync.
   * Verifies webhook signature to ensure events are from Stripe.
   */
  @Post('stripe')
  @ApiOperation({ summary: 'Handle Stripe webhook events' })
  async handleStripeWebhook(
    @Headers('stripe-signature') signature: string,
    @Req() req: RawBodyRequest<Request>,
  ) {
    if (!signature) {
      throw new BadRequestException('Missing stripe-signature header');
    }

    const rawBody = req.rawBody;
    if (!rawBody) {
      throw new BadRequestException('Missing request body');
    }

    try {
      await this.paymentsService.handleWebhook(rawBody, signature);
      return { received: true };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new BadRequestException(`Webhook Error: ${message}`);
    }
  }
}
