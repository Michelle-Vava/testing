import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from '../entities/user.entity';

export class AuthResponseDto {
  @ApiProperty({ type: UserEntity })
  user: UserEntity;

  @ApiProperty({ description: 'JWT Access Token', required: false })
  accessToken?: string;
}
