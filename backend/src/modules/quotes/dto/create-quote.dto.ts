import { IsString, IsNotEmpty, IsUUID, IsBoolean, IsOptional, Matches, IsArray, ValidateNested } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { AddQuotePartDto } from '../../parts/dto/add-quote-part.dto';

/**
 * DTO for creating a new quote
 */
export class CreateQuoteDto {
  @ApiProperty({ description: 'UUID of the service request', format: 'uuid' })
  @IsUUID()
  @IsNotEmpty()
  requestId!: string;

  @ApiProperty({ description: 'Total quote amount', example: '150.00' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d+(\.\d{1,2})?$/, { message: 'Amount must be a positive number with up to 2 decimal places' })
  amount!: string;

  @ApiPropertyOptional({ description: 'Labor cost portion', example: '100.00' })
  @IsString()
  @IsOptional()
  @Matches(/^\d+(\.\d{1,2})?$/, { message: 'Labor cost must be a positive number with up to 2 decimal places' })
  laborCost?: string;

  @ApiPropertyOptional({ description: 'Parts cost portion', example: '50.00' })
  @IsString()
  @IsOptional()
  @Matches(/^\d+(\.\d{1,2})?$/, { message: 'Parts cost must be a positive number with up to 2 decimal places' })
  partsCost?: string;

  @ApiProperty({ description: 'Estimated time to complete', example: '2 hours' })
  @IsString()
  @IsNotEmpty()
  estimatedDuration!: string;

  @ApiPropertyOptional({ description: 'Detailed quote description' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ description: 'Whether warranty is included', default: false })
  @IsBoolean()
  @IsOptional()
  includesWarranty?: boolean;

  @ApiPropertyOptional({ description: 'Parts included in the quote', type: [AddQuotePartDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AddQuotePartDto)
  parts?: AddQuotePartDto[];
}
