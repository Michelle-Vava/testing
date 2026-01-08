import { ApiProperty } from '@nestjs/swagger';
import { RequestStatus } from '../../../shared/enums';

export class RequestResponseDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  id: string;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174001' })
  ownerId: string;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174002' })
  vehicleId: string;

  @ApiProperty({ example: 'oil_change' })
  serviceType: string;

  @ApiProperty({ example: 'Need oil change and filter replacement' })
  description: string;

  @ApiProperty({ enum: ['low', 'medium', 'high', 'urgent'], example: 'medium' })
  urgency: string;

  @ApiProperty({ example: '123 Main St, City, State 12345', required: false, nullable: true })
  preferredLocation: string | null;

  @ApiProperty({ required: false, nullable: true })
  preferredDate: Date | null;

  @ApiProperty({ enum: RequestStatus, example: RequestStatus.OPEN })
  status: RequestStatus;

  @ApiProperty({ type: [String], example: ['https://example.com/image1.jpg'], required: false })
  imageUrls?: string[];

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
