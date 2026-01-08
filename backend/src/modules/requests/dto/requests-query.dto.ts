import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsEnum } from 'class-validator';
import { PaginationDto } from '../../../shared/dto/pagination.dto';

export enum RequestSort {
  NEWEST = 'newest',
  OLDEST = 'oldest',
  URGENCY = 'urgency',
}

export class RequestsQueryDto extends PaginationDto {
  @ApiPropertyOptional({ description: 'Filter by status (open, quoted, in_progress, completed, cancelled)' })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional({ enum: RequestSort, description: 'Sort order', default: RequestSort.NEWEST })
  @IsOptional()
  @IsEnum(RequestSort)
  sort?: RequestSort = RequestSort.NEWEST;
}
