import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID, IsEnum } from 'class-validator';

export enum RequestUrgency {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent',
}

export class CreateRequestDto {
  @ApiProperty({ description: 'ID of the vehicle' })
  @IsNotEmpty()
  @IsUUID()
  vehicleId: string;

  @ApiProperty({ description: 'Title of the request' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ description: 'Detailed description of the issue' })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({ enum: RequestUrgency, description: 'Urgency level' })
  @IsNotEmpty()
  @IsEnum(RequestUrgency)
  urgency: RequestUrgency;
}
