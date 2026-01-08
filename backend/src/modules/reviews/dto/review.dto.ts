import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReviewDto {
  @ApiProperty({
    description: 'Job ID for the review',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsString()
  jobId: string;

  @ApiProperty({
    description: 'Rating from 1 to 5 stars',
    minimum: 1,
    maximum: 5,
    example: 5,
  })
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiProperty({
    description: 'Optional review comment',
    required: false,
    example: 'Great service! Very professional and timely.',
  })
  @IsOptional()
  @IsString()
  comment?: string;
}

export class UpdateReviewDto {
  @ApiProperty({
    description: 'Updated rating from 1 to 5 stars',
    minimum: 1,
    maximum: 5,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  rating?: number;

  @ApiProperty({
    description: 'Updated review comment',
    required: false,
  })
  @IsOptional()
  @IsString()
  comment?: string;
}

export class RespondToReviewDto {
  @ApiProperty({
    description: 'Provider response to the review',
    example: 'Thank you for your feedback! It was a pleasure working with you.',
  })
  @IsString()
  response: string;
}
