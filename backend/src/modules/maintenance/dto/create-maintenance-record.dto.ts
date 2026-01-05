import { IsString, IsOptional, IsNumber, IsPositive, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateMaintenanceRecordDto {
  @ApiProperty({ description: 'Type of service performed', example: 'Oil Change' })
  @IsString()
  serviceType: string;

  @ApiProperty({ description: 'Date when service was performed', example: '2026-01-04' })
  @IsDateString()
  serviceDate: string;

  @ApiPropertyOptional({ description: 'Mileage at time of service (km)', example: 50000 })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  mileage?: number;

  @ApiPropertyOptional({ description: 'Cost of service', example: 89.99 })
  @IsOptional()
  @IsNumber()
  cost?: number;

  @ApiPropertyOptional({ description: 'Additional notes about the service' })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({ description: 'Name of shop or mechanic who performed service' })
  @IsOptional()
  @IsString()
  performedBy?: string;
}
