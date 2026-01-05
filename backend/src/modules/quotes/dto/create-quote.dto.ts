import { IsString, IsNotEmpty, IsUUID, IsBoolean, IsOptional } from 'class-validator';

export class CreateQuoteDto {
  @IsUUID()
  @IsNotEmpty()
  requestId!: string;

  @IsString()
  @IsNotEmpty()
  amount!: string;

  @IsString()
  @IsNotEmpty()
  estimatedDuration!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsBoolean()
  @IsOptional()
  includesWarranty?: boolean;
}
