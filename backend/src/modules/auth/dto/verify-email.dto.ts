import { IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO for email verification request
 */
export class VerifyEmailDto {
  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Email verification token sent to user',
    example: 'abc123def456',
  })
  token: string;
}

/**
 * DTO for resending verification email
 */
export class ResendVerificationDto {
  @ApiProperty({
    description: 'User email address to resend verification to',
    example: 'user@example.com',
  })
  @IsEmail()
  email: string;
}
