import { IsString, IsNotEmpty, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMessageDto {
  @ApiProperty({
    description: 'Job ID for the conversation',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @IsUUID()
  @IsNotEmpty()
  jobId: string;

  @ApiProperty({
    description: 'Message content',
    example: 'Hi, what time works best for you tomorrow?'
  })
  @IsString()
  @IsNotEmpty()
  content: string;
}
