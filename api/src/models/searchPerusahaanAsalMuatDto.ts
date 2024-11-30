import { IsOptional, IsUUID, IsString, IsNumber, IsBoolean, IsLongitude, IsLatitude, IsArray } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationDto } from './paginationDto';
import { Transform } from 'class-transformer';

export class SearchPerusahaanAsalMuatDto extends PaginationDto {
  @ApiPropertyOptional({ description: 'ID perusahaan', example: '123e4567-e89b-12d3-a456-426614174000' })
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
  @IsString({ each: true })
  companyId?: string;

  @ApiPropertyOptional({ description: 'Nama perusahaan asal muat', example: 'PT. Muatan Kimia' })
  @IsOptional()
  @IsString()
  namaPerusahaan?: string;

  @ApiPropertyOptional({ description: 'Provinsi ID', example: 'province123' })
  @IsOptional()
  @IsUUID()
  provinceId?: string;

  @ApiPropertyOptional({ description: 'Kabupaten/Kota ID', example: 'regency123' })
  @IsOptional()
  @IsUUID()
  regencyId?: string;

  @ApiPropertyOptional({ description: 'Kecamatan ID', example: 'district123' })
  @IsOptional()
  @IsUUID()
  districtId?: string;

  @ApiPropertyOptional({ description: 'Desa/Kelurahan ID', example: 'village123' })
  @IsOptional()
  @IsUUID()
  villageId?: string;

  @ApiPropertyOptional({ description: 'Longitude', example: 107.6191 })
  @IsOptional()
  @Transform(({ value }) => parseFloat(value))
  @IsLongitude()
  longitude?: number;

  @ApiPropertyOptional({ description: 'Latitude', example: -6.9175 })
  @IsOptional()
  @Transform(({ value }) => parseFloat(value))
  @IsLatitude()
  latitude?: number;

  @ApiPropertyOptional({ description: 'ID pelaporan terkait', example: 'report123' })
  @IsOptional()
  @IsUUID()
  reportId?: string;

  @ApiPropertyOptional({ description: 'Return all records without pagination', example: false })
  @IsOptional()
  @IsBoolean()
  returnAll?: boolean = false;
}
