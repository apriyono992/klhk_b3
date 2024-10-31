import { IsString, IsBoolean, IsNotEmpty, Validate, IsArray, ArrayNotEmpty , IsOptional} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsDataBahanB3Exists } from 'src/validators/dataBahanB3.validator';
import { LocationDetailsDto } from './locationDetailsDto';

// Updated DTO for creating a B3Substance
export class CreateB3PermohonanRekomDto {
  @ApiProperty({ description: 'Foreign key for DataBahanB3' })
  @Validate(IsDataBahanB3Exists)
  @IsString()
  @IsNotEmpty()
  dataBahanB3Id: string;

  @ApiProperty({ description: 'Whether it is listed in B3 PP 74/2001' })
  @IsBoolean()
  @IsNotEmpty()
  b3pp74: boolean;

  @ApiProperty({
    description: 'Whether it is outside the list of B3 PP 74/2001',
  })
  @IsBoolean()
  @IsNotEmpty()
  b3DiluarList: boolean;

  @ApiProperty({ description: 'Characteristics of the B3' })
  @IsString()
  @IsNotEmpty()
  karakteristikB3: string;

  @ApiProperty({ description: 'Phase of the B3 (e.g., cair, padat)' })
  @IsString()
  @IsNotEmpty()
  fasaB3: string;

  @ApiProperty({ description: 'Packaging type (e.g., tangki berlapis)' })
  @IsString()
  @IsNotEmpty()
  jenisKemasan: string;

  // New: Array of origin locations (asalMuat)
  @ApiProperty({
    description: 'Array of origin locations (asalMuat)',
    type: [LocationDetailsDto],
  })
  @IsArray()
  @ArrayNotEmpty()
  asalMuat: LocationDetailsDto[];

  // New: Array of destination locations (tujuanBongkar)
  @ApiProperty({
    description: 'Array of destination locations (tujuanBongkar)',
    type: [LocationDetailsDto],
  })
  @IsArray()
  @ArrayNotEmpty()
  tujuanBongkar: LocationDetailsDto[];

  @ApiProperty({ description: 'Purpose of the B3' })
  @IsString()
  @IsNotEmpty()
  tujuanPenggunaan: string;

  @ApiProperty({ description: 'Foreign key to the Application model' })
  @IsString()
  @IsNotEmpty()
  applicationId: string;

  @ApiProperty({ description: 'Foreign key to the Application model' })
  @IsString()
  @IsOptional()
  registrasiId: string;
}
