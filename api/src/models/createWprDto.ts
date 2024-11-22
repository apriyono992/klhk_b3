import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsString, IsOptional, IsNotEmpty, IsNumber, IsDate, Validate, IsLatitude, IsLongitude, IsEnum, IsJSON, IsArray } from 'class-validator';
import { IsDistrictValid } from 'src/validators/district.validator';
import { IsProvinceExist } from 'src/validators/province.validator';
import { IsRegencyValid } from 'src/validators/regency.validator';
import { IsVillageValid } from 'src/validators/village.validator';
import { StatusWpr } from './enums/statusWpr';
import { CreateAttachmentDto } from './createAttachmentsDto';

export class CreateWprDto {
  @IsOptional()
  @IsString()
  sumberData?: string;

  @IsOptional()
  @IsString()
  keterangan?: string;


  @IsOptional()
  @Type(() => Date)
  @IsDate()
  tahunPengambilan: Date;

  @IsOptional()
  @IsEnum(StatusWpr)
  status: StatusWpr;

  @IsOptional()
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  luasWilayah: number;
  
  @ApiProperty({
    description: 'ID of the province',
    example: 'province123',
  })
  @IsOptional()
  @IsString()
  @IsProvinceExist() // Ensure province exists
  provinceId: string;

  @ApiProperty({
    description: 'ID of the regency',
    example: 'regency123',
  })
  @IsOptional()
  @IsString()
  @Validate(IsRegencyValid, ['provinceId']) // Ensure regency belongs to the provided provinceId
  regencyId: string;

  @ApiProperty({
    description: 'ID of the district',
    example: 'district123',
  })
  @IsOptional()
  @IsString()
  @Validate(IsDistrictValid, ['regencyId']) // Ensure district belongs to the provided regencyId
  districtId: string;

  @ApiProperty({
    description: 'ID of the village',
    example: 'village123',
  })
  @IsOptional()
  @IsString()
  @Validate(IsVillageValid, ['districtId']) // Ensure village belongs to the provided districtId
  villageId: string;

  @ApiProperty({
    description: 'Latitude of the small-scale gold mining (PESK) site',
    example: -6.2088,
    type: 'number',
    format: 'float'
  })
  @IsOptional()
  @Transform(({ value }) => parseFloat(value))
  @IsLatitude()
  latitude: number;

  @ApiProperty({
    description: 'Longitude of the small-scale gold mining (PESK) site',
    example: 106.8456,
    type: 'number',
    format: 'float'
  })
  @IsOptional()
  @Transform(({ value }) => parseFloat(value))
  @IsLongitude()
  longitude: number;

  @ApiProperty({
    description: 'Polygon data in GeoJSON format',
    example: {
      type: 'Polygon',
      coordinates: [
        [
          [106.8456, -6.2088],
          [106.8466, -6.2098],
          [106.8476, -6.2108],
          [106.8456, -6.2088],
        ],
      ],
    },
  })
  @IsOptional()
  @IsJSON()
  polygon: object;

  @ApiProperty({
    description: 'Array of photo files for the mercury monitoring data',
    type: 'array',
    items: { type: 'string', format: 'binary' },
    example: ['photo1.jpg', 'photo2.jpg']
  })
  @IsOptional()
  photos: CreateAttachmentDto[];
}


export class UpdateWprDto extends CreateWprDto {
    @IsOptional()
    @IsArray()
    @ApiProperty({})
    deletePhotoIds: string[];
}