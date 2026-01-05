import { ApiProperty } from '@nestjs/swagger';
import { JobStatus } from '../../../shared/enums';

export class JobResponseDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  id: string;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174001' })
  requestId: string;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174002' })
  ownerId: string;

  @ApiProperty({ example: 'John Doe' })
  ownerName: string;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174003' })
  providerId: string;

  @ApiProperty({ example: 'Jane Smith Auto Service' })
  providerName: string;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174004' })
  quoteId: string;

  @ApiProperty({ example: 150.00 })
  agreedPrice: number;

  @ApiProperty({ example: 'Oil change and filter replacement' })
  description: string;

  @ApiProperty({ enum: JobStatus, example: JobStatus.PENDING })
  status: JobStatus;

  @ApiProperty({ required: false, nullable: true })
  scheduledDate: Date | null;

  @ApiProperty({ required: false, nullable: true })
  completedAt: Date | null;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
