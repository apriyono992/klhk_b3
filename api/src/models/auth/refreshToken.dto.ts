import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsString } from 'class-validator';

export class RefreshTokenDTO {
  @IsDefined()
  @IsString()
  @ApiProperty({
    example: '60f3b3b3-0b7b-4b3b-8b3b-3b0b7b3b0b7b',
    description: 'User id from login response',
  })
  userId: string;

  @IsDefined()
  @IsString()
  @ApiProperty({
    example: 'refresh_token',
    description: 'Refresh token from login response',
  })
  refreshToken: string;
}