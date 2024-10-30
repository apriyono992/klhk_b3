import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';  // Import Swagger decorator
import { PejabatStatus } from './enums/statusPejabat';
import { IsPejabatNipExist } from 'src/validators/dataPejabat.validator';
import { IsApplicationExists } from 'src/validators/isApplicationIdExists.validatior';

export class UpdateDataPejabatDto {
  @ApiProperty({
    description: 'The unique NIP (employee identification number) of the pejabat.',
    example: '123456789',  // Example value
  })
  @IsOptional()
  @IsString()
  @IsPejabatNipExist()
  nip: string;

  @ApiProperty({
    description: 'The full name of the pejabat.',
    example: 'John Doe',  // Example value
  })
  @IsOptional()
  @IsString()
  nama: string;

  @ApiProperty({
    description: 'The job title or position of the pejabat.',
    example: 'Director of Operations',  // Example value
  })
  @IsOptional()
  @IsString()
  jabatan: string;

  @ApiProperty({
    description: 'The application Id of the pejabat will assign to it.',
    example: '12313123123',  // Example value
  })
  @IsOptional()
  @IsString()
  @IsApplicationExists()
  applicationId: string;

  @ApiProperty({
    description: 'The status of the pejabat (e.g., PLT, PLH, AKTIF).',
    enum: PejabatStatus,  // Enum values automatically listed
  })
  @IsOptional()
  @IsEnum(PejabatStatus)
  status: PejabatStatus;
}
