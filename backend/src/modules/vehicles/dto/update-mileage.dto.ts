import { IsNumber, IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateMileageDto {
  @ApiProperty({ 
    description: 'Current mileage in kilometers',
    example: 50000,
    minimum: 0
  })
  @IsNumber()
  @IsPositive()
  mileage: number;
}
