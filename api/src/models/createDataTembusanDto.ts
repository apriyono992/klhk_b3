import { IsEnum, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';  // Import Swagger decorator
import { TembusanTipe } from './enums/tipeTembusan';
import { IsTembusanExist } from 'src/validators/dataTembusan.validator';

export class CreateDataTembusanDto {
  @ApiProperty({
    description: 'The name of the tembusan.',
    example: 'General Directorate of Environment',  // Example value
  })
  @IsString()
  @IsTembusanExist()
  nama: string;

  @ApiProperty({
    description: 'The type of the tembusan (e.g., UMUM, DIREKTUR).',
    enum: TembusanTipe,  // Enum values automatically listed
  })
  @IsEnum(TembusanTipe)
  tipe: TembusanTipe;
}
