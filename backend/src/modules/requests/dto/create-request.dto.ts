import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID, IsEnum, IsOptional, IsInt, Min, Max } from 'class-validator';

export enum RequestUrgency {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent',
}

export class CreateRequestDto {
  @ApiProperty({ description: 'ID of the vehicle (optional - can create inline)', required: false })
  @IsOptional()
  @IsUUID()
  vehicleId?: string;

  @ApiProperty({ description: 'Vehicle make (required if vehicleId not provided)', required: false })
  @IsOptional()
  @IsString()
  make?: string;

  @ApiProperty({ description: 'Vehicle model (required if vehicleId not provided)', required: false })
  @IsOptional()
  @IsString()
  model?: string;

  @ApiProperty({ description: 'Vehicle year (required if vehicleId not provided)', required: false })
  @IsOptional()
  @IsInt()
  @Min(1900)
  @Max(new Date().getFullYear() + 1)
  year?: number;

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
