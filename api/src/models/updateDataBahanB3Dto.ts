import { IsEnum, IsOptional, IsString, Validate } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TipeBahan } from './enums/tipeBahan';
import { IsBahanB3Exists, IsNamaBahanKimiaB3Exist } from 'src/validators/dataBahanB3.validator';

export class UpdateDataBahanB3Dto {
  @ApiProperty({
    description: 'The chemical name of the substance.',
    example: 'Formaldehyde',
  })
  @IsOptional()
  @IsString()
  @IsNamaBahanKimiaB3Exist()
  namaBahanKimia: string;

  @ApiProperty({
    description: 'The trade name of the substance.',
    example: 'Formalin',
  })
  @IsOptional()
  @IsString()
  namaDagang: string;

  @ApiProperty({
    description: 'The type of substance (e.g., DAPAT_DIPERGUNAKAN, TERBATAS_DIPERGUNAKAN, etc.).',
    enum: TipeBahan,
  })
  @IsOptional()
  @IsEnum(TipeBahan)
  tipeBahan: TipeBahan;
}