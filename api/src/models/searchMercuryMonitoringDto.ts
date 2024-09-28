import { IsOptional, IsDate, IsString, Validate, IsIn } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsProvinceExist } from 'src/validators/province.validator';
import { IsRegencyValid } from 'src/validators/regency.validator';
import { IsDistrictValid } from 'src/validators/district.validator';
import { IsVillageValid } from 'src/validators/village.validator';
import { IsJenisSampelExist, IsJenisSampelExists } from 'src/validators/jenisSample.validator';
import { IsBakuMutuLingkunganExists } from 'src/validators/bakuMutu.validator';
import { LocationType } from './enums/locationType';
import { ValidateEndDate, ValidateStartDate } from 'src/validators/startDateEndDate.validator';

export class MercuryMonitoringFilterDto {
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
    description: 'ID of the sample type (jenis sampel)',
    example: 'sample123',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Validate(IsJenisSampelExists)
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
    description: 'The start date for sample collection',
    example: '2022-01-01T00:00:00.000Z',
    required: false,
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  @ValidateStartDate('tahunPengambilanEnd')
  tahunPengambilanStart?: Date;

  @ApiProperty({
    description: 'The end date for sample collection',
    example: '2023-12-31T23:59:59.000Z',
    required: false,
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  @ValidateEndDate('tahunPengambilanStart')
  tahunPengambilanEnd?: Date;

  @ApiProperty({
    description: 'The mercury concentration level',
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
    description: 'Specify which location to show: pesk, warehouse, or empty to show both',
    enum: LocationType,
    example: "",
    required: false,
  })
  @IsOptional()
  @IsIn([LocationType.PESK, LocationType.WAREHOUSE])
  locationType?: LocationType;
}
