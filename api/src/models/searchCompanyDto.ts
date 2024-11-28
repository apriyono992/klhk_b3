import { IsArray, IsEnum, IsOptional, IsString } from 'class-validator';
import { PaginationDto } from './paginationDto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { TipePerusahaan } from './enums/tipePerusahaan';
import { Transform } from 'class-transformer';

export class SearchCompanyDto extends PaginationDto {
  @ApiPropertyOptional({
    description: 'Filter by company name',
    example: 'PT. ABC Chemical',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    description: 'Filter by NPWP',
    example: '123456789',
  })
  @IsOptional()
  @IsString()
  npwp?: string;

  @ApiPropertyOptional({
    description: 'Filter by business sector (bidang usaha)',
    example: 'Manufacturing',
  })
  @IsOptional()
  @IsString()
  bidangUsaha?: string;

  @ApiPropertyOptional({
    description: 'Filter by kodeDBKlhk',
    example: 'KLH001',
  })
  @IsOptional()
  @IsString()
  kodeDBKlhk?: string;

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
  companyId?: string[];
  companyIds?: string[];

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
  @IsEnum(TipePerusahaan, { each: true })
  tipePerusahaan?: TipePerusahaan[];
}
