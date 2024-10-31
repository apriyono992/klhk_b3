import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsString } from 'class-validator';

export class ResetPasswordRequestDTO {
  @IsDefined()
  @IsString()
  @ApiProperty({
    example: 'test@gmail.com',
    description: "User's email",
  })
  email: string;

  @IsDefined()
  @IsString()
  @ApiProperty({
    example: 'password',
    description: "User's new password",
  })
  newPassword: string;
}
