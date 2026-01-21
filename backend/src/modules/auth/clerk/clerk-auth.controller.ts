import { Controller, Post, Body, Headers, Get, Put, BadRequestException, Logger, RawBodyRequest, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { Webhook } from 'svix';
import { Request } from 'express';
import { ClerkAuthService } from './clerk-auth.service';
import { Public } from '../decorators/public.decorator';
import { CurrentUser } from '../decorators/current-user.decorator';
import { UpdateProfileDto } from '../dto/update-profile.dto';
import { User } from '@prisma/client';
import { UserEntity } from '../entities/user.entity';

interface ClerkWebhookEvent {
  type: string;
  data: {
    id: string;
    email_addresses: Array<{ email_address: string; id: string }>;
    first_name: string | null;
    last_name: string | null;
    image_url: string | null;
    phone_numbers?: Array<{ phone_number: string }>;
    public_metadata?: Record<string, any>;
    private_metadata?: Record<string, any>;
  };
}

/**
 * ClerkAuthController - Handles Clerk webhook and user endpoints
 * 
 * Webhook: Clerk sends events when users sign up/update/delete
 * User endpoints: Get current user, update profile, etc.
 */
@ApiTags('auth')
@Controller('auth')
export class ClerkAuthController {
  private readonly logger = new Logger(ClerkAuthController.name);

  constructor(
    private clerkAuthService: ClerkAuthService,
    private configService: ConfigService,
  ) {}

  /**
   * Clerk Webhook Handler
   * 
   * Receives events from Clerk when users are created/updated/deleted.
   * Syncs users to your database.
   * 
   * Set up in Clerk Dashboard → Webhooks:
   * URL: https://your-api.com/auth/webhook
   * Events: user.created, user.updated, user.deleted
   */
  @Post('webhook')
  @Public()
  @ApiOperation({ summary: 'Clerk webhook handler' })
  async handleClerkWebhook(
    @Headers('svix-id') svixId: string,
    @Headers('svix-timestamp') svixTimestamp: string,
    @Headers('svix-signature') svixSignature: string,
    @Req() req: RawBodyRequest<Request>,
  ) {
    const webhookSecret = this.configService.get<string>('CLERK_WEBHOOK_SECRET');
    
    if (!webhookSecret) {
      this.logger.error('CLERK_WEBHOOK_SECRET not configured');
      throw new BadRequestException('Webhook not configured');
    }

    // Verify webhook signature using svix
    const wh = new Webhook(webhookSecret);
    let event: ClerkWebhookEvent;

    try {
      // Use raw body for signature verification
      const payload = req.rawBody?.toString() || JSON.stringify(req.body);
      event = wh.verify(payload, {
        'svix-id': svixId,
        'svix-timestamp': svixTimestamp,
        'svix-signature': svixSignature,
      }) as ClerkWebhookEvent;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      this.logger.error(`Webhook verification failed: ${errorMessage}`);
      throw new BadRequestException('Invalid webhook signature');
    }

    this.logger.log(`Received Clerk webhook: ${event.type}`);

    const { type, data } = event;

    switch (type) {
      case 'user.created':
        await this.handleUserCreated(data);
        break;
      case 'user.updated':
        await this.handleUserUpdated(data);
        break;
      case 'user.deleted':
        await this.handleUserDeleted(data);
        break;
      default:
        this.logger.log(`Unhandled webhook event: ${type}`);
    }

    return { received: true };
  }

  private async handleUserCreated(data: ClerkWebhookEvent['data']) {
    const email = data.email_addresses[0]?.email_address;
    if (!email) {
      this.logger.warn('User created without email, skipping');
      return;
    }

    const name = `${data.first_name || ''} ${data.last_name || ''}`.trim() || 'User';
    const phone = data.phone_numbers?.[0]?.phone_number;

    await this.clerkAuthService.createFromExternalAuth({
      externalAuthId: data.id,
      email,
      name,
      avatarUrl: data.image_url || undefined,
      phone,
      authProvider: 'clerk',
    });

    this.logger.log(`Created user from webhook: ${email}`);
  }

  private async handleUserUpdated(data: ClerkWebhookEvent['data']) {
    const email = data.email_addresses[0]?.email_address;
    const name = `${data.first_name || ''} ${data.last_name || ''}`.trim();
    const phone = data.phone_numbers?.[0]?.phone_number;

    try {
      // NOTE: Only sync profile data from Clerk, NOT roles
      // Roles are managed exclusively in the backend database
      await this.clerkAuthService.updateFromExternalAuth(data.id, {
        email,
        name: name || undefined,
        avatarUrl: data.image_url || undefined,
        phone,
      });
      this.logger.log(`Updated user from webhook: ${data.id}`);
    } catch (error) {
      // User might not exist yet
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logger.warn(`Could not update user ${data.id}: ${errorMessage}`);
    }
  }

  private async handleUserDeleted(data: ClerkWebhookEvent['data']) {
    try {
      await this.clerkAuthService.deleteFromExternalAuth(data.id);
      this.logger.log(`Deleted user from webhook: ${data.id}`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logger.warn(`Could not delete user ${data.id}: ${errorMessage}`);
    }
  }

  /**
   * Get current authenticated user
   */
  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user profile' })
  async getCurrentUser(@CurrentUser() user: User) {
    return this.clerkAuthService.getCurrentUser(user.id);
  }

  /**
   * Update current user's profile
   */
  @Put('profile')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update user profile' })
  async updateProfile(
    @CurrentUser() user: User,
    @Body() updateDto: UpdateProfileDto,
  ) {
    return this.clerkAuthService.updateProfile(user.id, updateDto);
  }

  /**
   * Update current user's roles (e.g., become a provider)
   */
  @Put('roles')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update user roles' })
  async updateRoles(
    @CurrentUser() user: User,
    @Body() updateDto: { roles: string[] },
  ) {
    return this.clerkAuthService.updateRoles(user.id, updateDto.roles);
  }

  /**
   * Update current user's roles (alternative endpoint for compatibility)
   */
  @Put('update-roles')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update user roles (alternative endpoint)' })
  async updateRolesAlt(
    @CurrentUser() user: User,
    @Body() updateDto: { roles: string[] },
  ) {
    return this.clerkAuthService.updateRoles(user.id, updateDto.roles);
  }

  /**
   * Set primary role (reorder roles array to put selected role first)
   */
  @Put('set-primary-role')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Set primary role by reordering roles array' })
  async setPrimaryRole(
    @CurrentUser() user: User,
    @Body() setPrimaryRoleDto: { primaryRole: string },
  ) {
    const { primaryRole } = setPrimaryRoleDto;
    
    // Ensure the role exists in user's roles
    if (!user.roles.includes(primaryRole)) {
      throw new Error(`User does not have role: ${primaryRole}`);
    }

    // Reorder roles array to put primaryRole first
    const reorderedRoles = [
      primaryRole,
      ...user.roles.filter(r => r !== primaryRole)
    ];

    const updatedUser = await this.clerkAuthService.updateRoles(user.id, reorderedRoles);

    return new UserEntity(updatedUser);
  }
}
