import { ApiProperty } from '@nestjs/swagger';

export class VehicleResponseDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  id: string;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174001' })
  ownerId: string;

  @ApiProperty({ example: 'Toyota' })
  make: string;

  @ApiProperty({ example: 'Camry' })
  model: string;

  @ApiProperty({ example: 2022 })
  year: number;

  @ApiProperty({ example: '1HGBH41JXMN109186' })
  vin: string;

  @ApiProperty({ example: 'ABC123', required: false, nullable: true })
  licensePlate: string | null;

  @ApiProperty({ example: 45000, required: false, nullable: true })
  mileage: number | null;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
