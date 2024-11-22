import {
    IsNotEmpty,
    IsString,
    IsDate,
    IsOptional,
    IsLatitude,
    IsLongitude,
    Validate,
    IsArray,
    IsUUID,
  } from 'class-validator';
  import { Transform, Type } from 'class-transformer';
  import { ApiProperty } from '@nestjs/swagger';
  import { IsJenisSampelExist } from 'src/validators/jenisSample.validator';
  import { IsBakuMutuLingkunganExists } from 'src/validators/bakuMutu.validator';
  import { IsPhotoValidFile } from 'src/validators/photoFileType.validator';
  import { IsProvinceExist } from 'src/validators/province.validator';
  import { IsVillageValid } from 'src/validators/village.validator';
  import { IsDistrictValid } from 'src/validators/district.validator';
  import { IsRegencyValid } from 'src/validators/regency.validator';
  
  export class UpdateMercuryMonitoringDto {
    @ApiProperty({
      description: 'ID of the sample type (jenis sampel)',
      example: 'sample123',
      required: false,
    })
    @IsOptional()
    @IsString()
    @IsJenisSampelExist()
    jenisSampelId?: string;
  
    @ApiProperty({
      description: 'ID of the environmental quality standard (baku mutu lingkungan)',
      example: 'qualityStandard456',
      required: false,
    })
    @IsOptional()
    @IsString()
    @Validate(IsBakuMutuLingkunganExists)
    bakuMutuLingkunganId?: string;
  
    @ApiProperty({
      description: 'The date of sample collection',
      example: '2023-08-14T00:00:00.000Z',
      type: 'string',
      format: 'date-time',
      required: false,
    })
    @IsDate()
    @IsOptional()
    @Type(() => Date)
    tahunPengambilan?: Date;
  
    @ApiProperty({
      description: 'The result of the mercury concentration',
      example: '0.05',
      required: false,
    })
    @IsOptional()
    @IsString()
    hasilKadar?: string;
  
    @ApiProperty({
      description: 'Unit of the mercury concentration measurement',
      example: 'mg/L',
      required: false,
    })
    @IsOptional()
    @IsString()
    satuan?: string;
  
    @ApiProperty({
      description: 'Level of mercury concentration',
      example: 'Low',
      required: false,
    })
    @IsOptional()
    @IsString()
    tingkatKadar?: string;
  
    @ApiProperty({
      description: 'The concentration level description',
      example: 'Safe',
      required: false,
    })
    @IsOptional()
    @IsString()
    konsentrasi?: string;
  
    @ApiProperty({
      description: 'Keterangan Lokasi dari PESK',
      example: 'Tambang Emas Rakyat',
      required: false,
    })
    @IsOptional()
    @IsString()
    keterangan?: string;

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
      required: false,
    })
    @IsOptional()
    @IsString()
    @IsProvinceExist()
    provinceId?: string;
  
    @ApiProperty({
      description: 'ID of the regency',
      example: 'regency123',
      required: false,
    })
    @IsOptional()
    @IsString()
    @Validate(IsRegencyValid, ['provinceId'])
    regencyId?: string;
  
    @ApiProperty({
      description: 'ID of the district',
      example: 'district123',
      required: false,
    })
    @IsOptional()
    @IsString()
    @Validate(IsDistrictValid, ['regencyId'])
    districtId?: string;
  
    @ApiProperty({
      description: 'ID of the village',
      example: 'village123',
      required: false,
    })
    @IsOptional()
    @IsString()
    @Validate(IsVillageValid, ['districtId'])
    villageId?: string;
  
    @ApiProperty({
      description: 'Latitude of the small-scale gold mining (PESK) site',
      example: -6.2088,
      type: 'number',
      format: 'float',
      required: false,
    })
    @IsOptional()
    @IsLatitude()
    @Transform(({ value }) => parseFloat(value))
    latitude?: number;
  
    @ApiProperty({
      description: 'Longitude of the small-scale gold mining (PESK) site',
      example: 106.8456,
      type: 'number',
      format: 'float',
      required: false,
    })
    @IsOptional()
    @Transform(({ value }) => parseFloat(value))
    @IsLongitude()
    longitude?: number;
  
    @ApiProperty({
      description: 'Array of photo files for the mercury monitoring data',
      type: 'array',
      items: { type: 'string', format: 'binary' },
      example: ['photo1.jpg', 'photo2.jpg'],
      required: false,
    })
    @IsOptional()
    @IsArray()
    @Validate(IsPhotoValidFile)
    photos?: any[];
  }
  