import { IsString, IsNumber, IsOptional, Min, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PartCondition } from '@prisma/client';

// Re-export for convenience
export { PartCondition } from '@prisma/client';

export class CreatePartDto {
  @ApiProperty({ description: 'Name of the part', example: 'Brake Pads' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ description: 'Part category', example: 'brakes' })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiProperty({ 
    description: 'Condition of the part',
    enum: PartCondition,
    example: 'AFTERMARKET'
  })
  @IsEnum(PartCondition)
  condition: PartCondition;

  @ApiProperty({ description: 'Price of the part', example: 49.99 })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiPropertyOptional({ description: 'Additional notes (e.g., fits 2011 Accord 2.4L)' })
  @IsOptional()
  @IsString()
  notes?: string;
}
