import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsString } from 'class-validator';
import { IsEmailExist } from 'src/validators/isEmailExists.validator';

export class ForgotPasswordRequestDTO {
  @IsDefined()
  @IsString()
  @IsEmailExist(true, { message: 'Email does not exist' })
  @ApiProperty({
    example: 'test@gmail.com',
    description: "User's email",
  })
  email: string;
}
