import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDefined, IsNumber, IsString } from 'class-validator';

export class LoginRequestDTO {
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
    description: "User's password",
  })
  password: string;

  @IsDefined()
  @IsString()
  clientId: string;

  @IsDefined()
  @IsString()
  clientSecret: string;

  @IsDefined()
  @IsNumber()
  expiresInMins: number; 
  
  @IsDefined()
  @IsBoolean()
  remember: boolean;
}
