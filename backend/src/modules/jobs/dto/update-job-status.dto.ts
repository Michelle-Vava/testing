import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { JobStatus } from '../../../shared/enums';

export class UpdateJobStatusDto {
  @ApiProperty({ enum: JobStatus, description: 'The new status of the job' })
  @IsNotEmpty()
  @IsEnum(JobStatus)
  status!: JobStatus;
}
