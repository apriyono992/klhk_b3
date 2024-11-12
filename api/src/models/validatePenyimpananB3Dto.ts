import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { StatusPenyimpananB3 } from './enums/statusPenyimpananB3';

export class ValidatePenyimpananDto {
  @ApiProperty({
    description: 'ID of the Penyimpanan B3 to validate',
    example: 'penyimpanan123',
  })
  @IsNotEmpty()
  @IsString()
  penyimpananB3Id: string;

  @ApiProperty({
    description: 'Mark the Penyimpanan B3 as approved or not',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  isValid: boolean;

  @ApiProperty({
    description: 'Status of the Penyimpanan B3',
    enum: StatusPenyimpananB3,
    example: 'APPROVED',
  })
  @IsOptional()
  @IsEnum(StatusPenyimpananB3)
  status: StatusPenyimpananB3;

  @ApiProperty({
    description: 'Optional user ID of the admin validating the Penyimpanan B3',
    example: 'admin123',
  })
  @IsOptional()
  @IsString()
  userId?: string;
}
