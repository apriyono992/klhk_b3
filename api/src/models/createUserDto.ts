import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsDefined,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  MinLength,
} from 'class-validator';
import { IsEmailExist } from 'src/validators/isEmailExists.validator';
import { CreateAttachmentDto } from './createAttachmentsDto';

export class CreateUserDTO {
  @IsOptional()
  @IsDefined()
  @IsString()
  @IsEmailExist(false, { message: 'Email already exists' })
  @ApiProperty({
    example: 'test@gmail.com',
    description: "User's email",
  })
  email: string;

  @IsOptional()
  @IsDefined()
  @IsString()
  @MinLength(8)
  @ApiProperty({
    example: 'password',
    description: 'User password',
    minLength: 8,
  })
  password: string;

  @IsOptional()
  @IsDefined()
  @IsString()
  @ApiProperty({
    example: 'John',
    description: 'User full name',
  })
  fullName: string;

  @IsOptional()
  @IsDefined()
  @IsString()
  @ApiProperty({
    example: '08953797772233',
    description: 'Phone number',
  })
  phoneNumber: string;

  @IsOptional()
  @IsDefined()
  @IsString()
  @ApiProperty({
    example: 'Jl. Benjamin Sueb',
    description: 'Address of the user',
  })
  address: string;

  @IsOptional()
  @IsDefined()
  @IsString()
  @ApiProperty({
    example: 'http://localhost:3002/uploads/photos/tes.png',
    description: 'photo ID card',
  })
  idPhotoUrl: string;

  @IsOptional()
  @IsDefined()
  @IsString()
  @ApiProperty({
    example: 'e83da097-a4fb-4b29-9739-575ca83b9d10',
    description: 'User address cityId',
  })
 
  cityId: string;

  @IsOptional()
  @IsDefined()
  @IsString()
  @ApiProperty({
    example: 'e83da097-a4fb-4b29-9739-575ca83b9d10',
    description: 'User address provinceId',
  })
  provinceId: string;

  @IsOptional()
  @IsDefined()
  @Length(16)
  @ApiProperty({
    example: '3271846128362167',
    description: 'ID number (KTP) of the user',
    minLength: 16,
    maxLength: 16,
  })
  idNumber: string;

  @IsOptional()
  @IsArray()
  @IsUUID(4, { each: true })
  companyIds?: string[]; // Array ID untuk relasi perusahaan

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  rolesIds?: string[]; // Array ID untuk relasi roles
}
