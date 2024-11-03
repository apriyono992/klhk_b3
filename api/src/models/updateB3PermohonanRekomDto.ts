import { IsString, IsBoolean, IsOptional, Validate, IsArray } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBahanB3Exists, IsDataBahanB3Exists } from 'src/validators/dataBahanB3.validator';
import { LocationDetailsDto } from './locationDetailsDto';

export class UpdateB3PermohonanRekomDto {
  @ApiPropertyOptional({ description: 'Foreign key for DataBahanB3' })
  @IsString()
  @IsOptional()
  dataBahanB3Id?: string;

  @ApiPropertyOptional({ description: 'Whether it is listed in B3 PP 74/2001' })
  @IsBoolean()
  @IsOptional()
  b3pp74?: boolean;

  @ApiPropertyOptional({ description: 'Whether it is outside the list of B3 PP 74/2001' })
  @IsBoolean()
  @IsOptional()
  b3DiluarList?: boolean;

  @ApiPropertyOptional({ description: 'Characteristics of the B3' })
  @IsString()
  @IsOptional()
  karakteristikB3?: string;

  @ApiPropertyOptional({ description: 'Phase of the B3 (e.g., cair, padat)' })
  @IsString()
  @IsOptional()
  fasaB3?: string;

  @ApiPropertyOptional({ description: 'Packaging type (e.g., tangki berlapis)' })
  @IsString()
  @IsOptional()
  jenisKemasan?: string;

  // New: Array of origin locations (asalMuat)
  @ApiPropertyOptional({
    description: 'Array of origin locations (asalMuat)',
    type: [LocationDetailsDto],
  })
  @IsArray()
  @IsOptional()
  asalMuat: LocationDetailsDto[];

  // New: Array of destination locations (tujuanBongkar)
  @ApiPropertyOptional({
    description: 'Array of destination locations (tujuanBongkar)',
    type: [LocationDetailsDto],
  })
  @IsArray()
  @IsOptional()
  tujuanBongkar: LocationDetailsDto[];

  @ApiPropertyOptional({ description: 'Purpose of the B3' })
  @IsString()
  @IsOptional()
  tujuanPenggunaan?: string;
}
