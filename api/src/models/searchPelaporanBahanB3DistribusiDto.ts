
import { IsOptional, IsUUID, IsEnum, IsString, IsDate, IsBoolean, IsNumber, Validate } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { PaginationDto } from './paginationDto';
import { IsProvinceExist } from 'src/validators/province.validator';
import { IsRegencyValid } from 'src/validators/regency.validator';
import { IsDistrictValid } from 'src/validators/district.validator';
import { IsVillageValid } from 'src/validators/village.validator';

export class SearchPelaporanBahanB3DistribusiDto extends PaginationDto {
  @ApiPropertyOptional({ description: 'ID perusahaan', example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsOptional()
  @IsUUID()
  companyId?: string;

  @ApiPropertyOptional({ description: 'ID periode', example: '321e4567-e89b-12d3-a456-426614174999' })
  @IsOptional()
  @IsUUID()
  periodId?: string;

  @ApiPropertyOptional({ description: 'ID bahan B3', example: '111e4567-e89b-12d3-a456-426614174111' })
  @IsOptional()
  @IsUUID()
  dataBahanB3Id?: string;

  @ApiPropertyOptional({ description: 'Bidang usaha perusahaan', example: 'Manufaktur' })
  @IsOptional()
  @IsString()
  bidangUsaha?: string;

  @ApiPropertyOptional({ description: 'Tipe perusahaan', example: ['Eksportir', 'Importer'] })
  @IsOptional()
  @IsString({ each: true })
  tipePerusahaan?: string[];

  @ApiPropertyOptional({ description: 'Longitude lokasi perusahaan', example: 106.827183 })
  @IsOptional()
  @IsNumber()
  longitude?: number;

  @ApiPropertyOptional({ description: 'Latitude lokasi perusahaan', example: -6.175394 })
  @IsOptional()
  @IsNumber()
  latitude?: number;

  @ApiPropertyOptional({ description: 'ID provinsi', example: '34e4567-e89b-12d3-a456-426614174888' })
  @IsOptional()
  @IsProvinceExist() // Ensure province exists
  provinceId?: string;

  @ApiPropertyOptional({ description: 'ID kabupaten/kota', example: '45e4567-e89b-12d3-a456-426614174999' })
  @IsOptional()
  @Validate(IsRegencyValid, ['provinceId']) // Ensure regency belongs 
  regencyId?: string;

  @ApiPropertyOptional({ description: 'ID kecamatan', example: '56e4567-e89b-12d3-a456-426614174000' })
  @IsOptional()
  @Validate(IsDistrictValid, ['regencyId']) // Ensure district 
  districtId?: string;

  @ApiPropertyOptional({ description: 'ID desa/kelurahan', example: '67e4567-e89b-12d3-a456-426614174111' })
  @IsOptional()
  @Validate(IsVillageValid, ['districtId']) // Ensure village belongs 
  villageId?: string;

  @ApiPropertyOptional({ description: 'Tanggal mulai pencarian (format: YYYY-MM-DD)', example: '2024-01-01' })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  startDate?: Date;

  @ApiPropertyOptional({ description: 'Tanggal akhir pencarian (format: YYYY-MM-DD)', example: '2024-12-31' })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  endDate?: Date;

  @ApiPropertyOptional({ description: 'Jika true, mengembalikan semua data tanpa pagination', example: false })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  returnAll?: boolean;
}
