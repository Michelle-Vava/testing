import { IsString, IsArray, IsOptional, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

// Phase 1: Minimal provider profile fields
export class UpdateProviderProfileDto {
  @ApiProperty({ example: 'Joe\'s Auto Repair' })
  @IsString()
  @IsOptional()
  businessName?: string;

  @ApiProperty({ example: ['oil_change', 'brakes', 'tire_service'] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  serviceTypes?: string[];

  @ApiProperty({ example: 'Toronto' })
  @IsString()
  @IsOptional()
  city?: string;

  @ApiProperty({ example: 'ON' })
  @IsString()
  @IsOptional()
  state?: string;

  @ApiProperty({ example: 'Toronto' })
  @IsString()
  @IsOptional()
  shopCity?: string;

  @ApiProperty({ example: 'ON' })
  @IsString()
  @IsOptional()
  shopState?: string;

  @ApiProperty({ example: 25, description: 'Service radius in kilometers' })
  @IsNumber()
  @Min(1)
  @IsOptional()
  serviceRadius?: number;
}
