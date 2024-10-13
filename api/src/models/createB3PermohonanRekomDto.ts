import { IsString, IsBoolean, IsNotEmpty, IsOptional, Validate } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsDataBahanB3Exists } from 'src/validators/dataBahanB3.validator';

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

  @ApiProperty({ description: 'Whether it is outside the list of B3 PP 74/2001' })
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

  @ApiProperty({ description: 'Origin of the B3' })
  @IsString()
  @IsNotEmpty()
  asalMuat: string;

  @ApiProperty({ description: 'Destination of the B3' })
  @IsString()
  @IsNotEmpty()
  tujuanBongkar: string;

  @ApiProperty({ description: 'Purpose of the B3' })
  @IsString()
  @IsNotEmpty()
  tujuanPenggunaan: string;

  @ApiProperty({ description: 'Foreign key to the Application model' })
  @IsString()
  @IsNotEmpty()
  applicationId: string;
}
