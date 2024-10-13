import { IsEnum, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';  // Import Swagger decorator
import { PejabatStatus } from './enums/statusPejabat';
import { IsPejabatExist } from 'src/validators/dataPejabat.validator';

export class CreateDataPejabatDto {
  @ApiProperty({
    description: 'The unique NIP (employee identification number) of the pejabat.',
    example: '123456789',  // Example value
  })
  @IsString()
  @IsPejabatExist()
  nip: string;

  @ApiProperty({
    description: 'The full name of the pejabat.',
    example: 'John Doe',  // Example value
  })
  @IsString()
  nama: string;

  @ApiProperty({
    description: 'The job title or position of the pejabat.',
    example: 'Director of Operations',  // Example value
  })
  @IsString()
  jabatan: string;

  @ApiProperty({
    description: 'The status of the pejabat (e.g., PLT, PLH, AKTIF).',
    enum: PejabatStatus,  // Enum values automatically listed
  })
  @IsEnum(PejabatStatus)
  status: PejabatStatus;
}
