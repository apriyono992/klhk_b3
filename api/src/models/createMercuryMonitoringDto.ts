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
  @IsNotEmpty()
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
    description: 'ID of the province',
    example: 'province123',
  })
  @IsNotEmpty()
  @IsString()
  @IsProvinceExist() // Ensure province exists
  peskProvinceId: string;

  @ApiProperty({
    description: 'ID of the regency',
    example: 'regency123',
  })
  @IsNotEmpty()
  @IsString()
  @Validate(IsRegencyValid, ['peskProvinceId']) // Ensure regency belongs to the provided provinceId
  peskRegencyId: string;

  @ApiProperty({
    description: 'ID of the district',
    example: 'district123',
  })
  @IsNotEmpty()
  @IsString()
  @Validate(IsDistrictValid, ['peskRegencyId']) // Ensure district belongs to the provided regencyId
  peskDistrictId: string;

  @ApiProperty({
    description: 'ID of the village',
    example: 'village123',
  })
  @IsNotEmpty()
  @IsString()
  @Validate(IsVillageValid, ['peskDistrictId']) // Ensure village belongs to the provided districtId
  peskVillageId: string;

  @ApiProperty({
    description: 'Latitude of the small-scale gold mining (PESK) site',
    example: -6.2088,
    type: 'number',
    format: 'float'
  })
  @IsNotEmpty()
  @IsLatitude()
  @Transform(({ value }) => parseFloat(value))
  peskLatitude: number;

  @ApiProperty({
    description: 'Longitude of the small-scale gold mining (PESK) site',
    example: 106.8456,
    type: 'number',
    format: 'float'
  })
  @IsNotEmpty()
  @Transform(({ value }) => parseFloat(value))
  @IsLongitude()
  peskLongitude: number;

  @ApiProperty({
    description: 'ID of the province',
    example: 'province123',
  })
  @IsNotEmpty()
  @IsString()
  @IsProvinceExist() // Ensure province exists
  warehouseProvinceId: string;

  @ApiProperty({
    description: 'ID of the regency',
    example: 'regency123',
  })
  @IsNotEmpty()
  @IsString()
  @Validate(IsRegencyValid, ['warehouseProvinceId']) // Ensure regency belongs to the provided provinceId
  warehouseRegencyId: string;

  @ApiProperty({
    description: 'ID of the district',
    example: 'district123',
  })
  @IsNotEmpty()
  @IsString()
  @Validate(IsDistrictValid, ['warehouseRegencyId']) // Ensure district belongs to the provided regencyId
  warehouseDistrictId: string;

  @ApiProperty({
    description: 'ID of the village',
    example: 'village123',
  })
  @IsNotEmpty()
  @IsString()
  @Validate(IsVillageValid, ['warehouseDistrictId']) // Ensure village belongs to the provided districtId
  warehouseVillageId: string;

  @ApiProperty({
    description: 'Latitude of the warehouse location',
    example: -6.2099,
    type: 'number',
    format: 'float'
  })
  @IsNotEmpty()
  @IsLatitude()
  @Transform(({ value }) => parseFloat(value))
  warehouseLatitude: number;

  @ApiProperty({
    description: 'Longitude of the warehouse location',
    example: 106.8467,
    type: 'number',
    format: 'float'
  })
  @IsNotEmpty()
  @IsLongitude()
  @Transform(({ value }) => parseFloat(value))
  warehouseLongitude: number;

  @ApiProperty({
    description: 'Array of photo files for the mercury monitoring data',
    type: 'array',
    items: { type: 'string', format: 'binary' },
    example: ['photo1.jpg', 'photo2.jpg']
  })

  @IsOptional()
  photos: any[];
}
