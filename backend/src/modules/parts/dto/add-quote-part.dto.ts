import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEnum, IsNumber, Min, IsOptional, IsUUID, IsInt } from 'class-validator';
import { PartCondition } from '@prisma/client';

export class AddQuotePartDto {
  @ApiProperty({ description: 'Part inventory ID (if from inventory)', required: false })
  @IsOptional()
  @IsUUID()
  partId?: string;

  @ApiProperty({ description: 'Part name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ enum: PartCondition, description: 'Part condition' })
  @IsEnum(PartCondition)
  condition: PartCondition;

  @ApiProperty({ description: 'Part price' })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({ description: 'Quantity', default: 1 })
  @IsInt()
  @Min(1)
  quantity: number = 1;

  @ApiProperty({ description: 'Additional notes', required: false })
  @IsOptional()
  @IsString()
  notes?: string;
}
