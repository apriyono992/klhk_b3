import { ApiProperty } from '@nestjs/swagger';
import {
  IsDefined,
  IsOptional,
  IsString,
  Length,
  MinLength,
} from 'class-validator';
import { IsEmailExist } from 'src/validators/isEmailExists.validator';
import { CreateAttachmentDto } from '../createAttachmentsDto';

export class RegisterUserDTO {
  @IsDefined()
  @IsString()
  @IsEmailExist(false, { message: 'Email already exists' })
  @ApiProperty({
    example: 'test@gmail.com',
    description: "User's email",
  })
  email: string;

  @IsDefined()
  @IsString()
  @MinLength(8)
  @ApiProperty({
    example: 'password',
    description: 'User password',
    minLength: 8,
  })
  password: string;

  @IsDefined()
  @IsString()
  @ApiProperty({
    example: 'John',
    description: 'User full name',
  })
  fullName: string;

  @IsDefined()
  @IsString()
  @ApiProperty({
    example: '08953797772233',
    description: 'Phone number',
  })
  phoneNumber: string;

  @IsDefined()
  @IsString()
  @ApiProperty({
    example: 'Jl. Benjamin Sueb',
    description: 'Address of the user',
  })
  address: string;

  @IsDefined()
  @IsString()
  @ApiProperty({
    example: 'http://localhost:3002/uploads/photos/tes.png',
    description: 'photo ID card',
  })
  idPhotoUrl: string;

  @IsDefined()
  @IsString()
  @ApiProperty({
    example: 'e83da097-a4fb-4b29-9739-575ca83b9d10',
    description: 'User address cityId',
  })
  cityId: string;

  @IsDefined()
  @IsString()
  @ApiProperty({
    example: 'e83da097-a4fb-4b29-9739-575ca83b9d10',
    description: 'User address provinceId',
  })
  provinceId: string;

  @IsDefined()
  @IsString()
  @Length(16)
  @ApiProperty({
    example: '3271846128362167',
    description: 'ID number (KTP) of the user',
    minLength: 16,
    maxLength: 16,
  })
  idNumber: string;

  @ApiProperty({
    description: 'An array of files to be uploaded as attachments',
    type: 'array',
    items: {
      type: 'string',
      format: 'binary',
    },
    required: true,
  })
  @IsOptional()
  attachments?: CreateAttachmentDto[];
}
