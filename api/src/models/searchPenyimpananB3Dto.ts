import { Transform, Type } from 'class-transformer';
import { IsOptional, IsEnum, IsNumber, Min, IsString, IsBoolean, Validate, IsArray, ArrayMinSize } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { StatusPenyimpananB3 } from 'src/models/enums/statusPenyimpananB3';
import { PaginationDto } from './paginationDto';
import { IsVillageValid } from 'src/validators/village.validator';
import { IsDistrictValid } from 'src/validators/district.validator';
import { IsRegencyValid } from 'src/validators/regency.validator';
import { IsProvinceExist } from 'src/validators/province.validator';

export class SearchPenyimpananB3Dto extends PaginationDto {
  @ApiPropertyOptional({
    description: 'Filter by company ID',
    example: '12345',
  })
  @IsOptional()
  @IsString()
  companyId?: string;

  @ApiPropertyOptional({
    description: 'Filter by province ID',
    example: 'province123',
  })
  @IsOptional()
  @IsString()
  @Validate(IsProvinceExist)
  provinceId?: string;

  @ApiPropertyOptional({
    description: 'Filter by regency ID (must belong to the selected province)',
    example: 'regency123',
  })
  @IsOptional()
  @IsString()
  @Validate(IsRegencyValid, ['provinceId'])
  regencyId?: string;

  @ApiPropertyOptional({
    description: 'Filter by district ID (must belong to the selected regency)',
    example: 'district123',
  })
  @IsOptional()
  @IsString()
  @Validate(IsDistrictValid, ['regencyId'])
  districtId?: string;

  @ApiPropertyOptional({
    description: 'Filter by village ID (must belong to the selected district)',
    example: 'village123',
  })
  @IsOptional()
  @IsString()
  @Validate(IsVillageValid, ['districtId'])
  villageId?: string;

  @ApiPropertyOptional({
    description: 'Filter by one or more statuses',
    example: [StatusPenyimpananB3.APPROVED, StatusPenyimpananB3.PENDING],
    enum: StatusPenyimpananB3,
    type: [String],
  })
  @IsOptional()
    @Transform(({ value }) => {
    // Jika sudah berupa array, trim setiap elemen
    if (Array.isArray(value)) {
      return value.map((item) => item.trim());
    }
    // Jika berupa string dengan koma, pecah menjadi array dan trim setiap elemen
    if (typeof value === 'string') {
      return value.split(',').map((item) => item.trim());
    }
    // Jika bukan array atau string, kembalikan seperti apa adanya
    return [value];
  })
  @IsArray()
  @ArrayMinSize(1, { message: 'At least one status must be provided' })
  @IsEnum(StatusPenyimpananB3, { each: true, message: 'Status must be a valid enum value' })
  status?: StatusPenyimpananB3[];

  @ApiPropertyOptional({
    description: 'Filter by partial match of alamatGudang',
    example: 'Jl. Industri',
  })
  @IsOptional()
  @IsString()
  alamatGudang?: string;

  @ApiPropertyOptional({
    description: 'Filter by approval status',
    example: true,
  })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isApproved?: boolean;

  @ApiPropertyOptional({
    description: 'If true, include all records without pagination',
    example: false,
    default: false,
  })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  includeAll?: boolean;
}
