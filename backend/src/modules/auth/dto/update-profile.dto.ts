import { IsOptional, IsString, IsArray, IsNumber, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateProfileDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  state?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  zipCode?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  avatarUrl?: string;

  // Provider-specific fields
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  businessName?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  serviceTypes?: string[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  yearsInBusiness?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  shopAddress?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  shopCity?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  shopState?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  shopZipCode?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  serviceArea?: string[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  hourlyRate?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  website?: string;
}
