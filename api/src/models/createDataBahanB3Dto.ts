import { IsEnum, IsString, Validate } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';  // Import Swagger decorator
import { TipeBahan } from './enums/tipeBahan';
import { IsBahanB3Exists } from 'src/validators/dataBahanB3.validator';

export class CreateDataBahanB3Dto {
  @ApiProperty({
    description: 'The unique CAS number of the chemical substance.',
    example: '50-00-0',  // Example value
  })
  @IsString()
  @Validate(IsBahanB3Exists, ['namaDagang'])
  casNumber: string;

  @ApiProperty({
    description: 'The chemical name of the substance.',
    example: 'Formaldehyde',  // Example value
  })
  @IsString()
  namaBahanKimia: string;

  @ApiProperty({
    description: 'The trade name of the substance.',
    example: 'Formalin',  // Example value
  })
  @IsString()
  namaDagang: string;

  @ApiProperty({
    description: 'The type of substance (e.g., DAPAT_DIPERGUNAKAN, TERBATAS_DIPERGUNAKAN, etc.).',
    enum: TipeBahan,  // Enum values automatically listed
  })
  @IsEnum(TipeBahan)
  tipeBahan: TipeBahan;
}
