import { ApiProperty } from '@nestjs/swagger';
import { StatusPermohonan } from './enums/statusPermohonan';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { IsApplicationExists } from 'src/validators/isApplicationIdExists.validatior';


export class UpdateApplicationStatusDto {
  @ApiProperty({
    description: 'The ID of the application to update',
    example: 'app12345',
  })
  @IsApplicationExists()
  @IsString()
  applicationId: string;

  @ApiProperty({
    description: 'The new status of the application',
    enum: StatusPermohonan,
    example: 'APPROVED',
  })
  @IsEnum(StatusPermohonan)
  status: StatusPermohonan;

  @ApiProperty({
    description: 'The user ID of the person updating the status (optional)',
    required: false,
    example: 'user12345',
  })
  @IsOptional()
  @IsString()
  userId?: string;
}
