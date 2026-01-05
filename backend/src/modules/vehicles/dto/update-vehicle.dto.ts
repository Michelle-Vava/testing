import { IsString, IsOptional, IsInt, Min } from 'class-validator';

export class UpdateVehicleDto {
  @IsOptional()
  @IsString()
  licensePlate?: string;

  @IsOptional()
  @IsString()
  color?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  mileage?: number;
}
