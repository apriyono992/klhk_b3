import { IsNotEmpty, IsString, IsDate, IsNumber, IsArray, Validate, IsOptional, IsLongitude, IsLatitude, IsDateString } from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsJenisSampelExist } from 'src/validators/jenisSample.validator';
import { IsBakuMutuLingkunganExists } from 'src/validators/bakuMutu.validator';
import { IsPhotoValidFile } from 'src/validators/photoFileType.validator';
import { IsProvinceExist } from 'src/validators/province.validator';
import { IsVillageValid } from 'src/validators/village.validator';
import { IsDistrictValid } from 'src/validators/district.validator';
import { IsRegencyValid } from 'src/validators/regency.validator';

export class CreateMercuryMonitoringDto {
  @ApiProperty({
    description: 'ID of the sample type (jenis sampel)',
    example: 'sample123'
  })
  @IsNotEmpty()
  @IsString()
  @IsJenisSampelExist()
  jenisSampelId: string;

  @ApiProperty({
    description: 'ID of the environmental quality standard (baku mutu lingkungan)',
    example: 'qualityStandard456'
  })
  @IsOptional()
  @IsString()
  @Validate(IsBakuMutuLingkunganExists)
  bakuMutuLingkunganId: string;

  @ApiProperty({
    description: 'The date of sample collection',
    example: '2023-08-14T00:00:00.000Z',
    type: 'string',
    format: 'date-time'
  })
  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  tahunPengambilan: Date;

  @ApiProperty({
    description: 'The result of the mercury concentration',
    example: '0.05'
  })
  @IsNotEmpty()
  @IsString()
  hasilKadar: string;

  @ApiProperty({
    description: 'Unit of the mercury concentration measurement',
    example: 'mg/L'
  })
  @IsNotEmpty()
  @IsString()
  satuan: string;

  @ApiProperty({
    description: 'Level of mercury concentration',
    example: 'Low'
  })
  @IsNotEmpty()
  @IsString()
  tingkatKadar: string;

  @ApiProperty({
    description: 'The concentration level description',
    example: 'Safe'
  })
  @IsNotEmpty()
  @IsString()
  konsentrasi: string;

  @ApiProperty({
    description: 'Keterangan Lokasi dari PESK',
    example: 'Tambang Emas Rakyat'
  })
  @IsOptional()
  @IsString()
  keterangan: string;

  @ApiProperty({
    description: 'Sumber Data',
    example: 'Laporan Pemerintah'
  })
  @IsOptional()
  @IsString()
  sumberData: string;

  @ApiProperty({
    description: 'ID of the province',
    example: 'province123',
  })
  @IsNotEmpty()
  @IsString()
  @IsProvinceExist() // Ensure province exists
  provinceId: string;

  @ApiProperty({
    description: 'ID of the regency',
    example: 'regency123',
  })
  @IsNotEmpty()
  @IsString()
  @Validate(IsRegencyValid, ['provinceId']) // Ensure regency belongs to the provided provinceId
  regencyId: string;

  @ApiProperty({
    description: 'ID of the district',
    example: 'district123',
  })
  @IsNotEmpty()
  @IsString()
  @Validate(IsDistrictValid, ['regencyId']) // Ensure district belongs to the provided regencyId
  districtId: string;

  @ApiProperty({
    description: 'ID of the village',
    example: 'village123',
  })
  @IsNotEmpty()
  @IsString()
  @Validate(IsVillageValid, ['districtId']) // Ensure village belongs to the provided districtId
  villageId: string;

  @ApiProperty({
    description: 'Latitude of the small-scale gold mining (PESK) site',
    example: -6.2088,
    type: 'number',
    format: 'float'
  })
  @IsNotEmpty()
  @IsLatitude()
  @Transform(({ value }) => parseFloat(value))
  latitude: number;

  @ApiProperty({
    description: 'Longitude of the small-scale gold mining (PESK) site',
    example: 106.8456,
    type: 'number',
    format: 'float'
  })
  @IsNotEmpty()
  @Transform(({ value }) => parseFloat(value))
  @IsLongitude()
  longitude: number;

  @ApiProperty({
    description: 'Array of photo files for the mercury monitoring data',
    type: 'array',
    items: { type: 'string', format: 'binary' },
    example: ['photo1.jpg', 'photo2.jpg']
  })
  @IsOptional()
  photos: any[];
}
