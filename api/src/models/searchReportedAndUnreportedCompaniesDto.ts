import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsOptional, IsString, IsUUID } from 'class-validator';
import { Transform } from 'class-transformer';
import { PaginationDto } from './paginationDto';

export class SearchReportedAndUnreportedCompaniesDto extends PaginationDto {
  @ApiPropertyOptional({
    description: 'Period ID to filter by',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsOptional()
  @IsUUID()
  periodId?: string;

  @ApiPropertyOptional({
    description: 'Filter by company IDs (array of UUIDs)',
    example: ['abcd1234', 'efgh5678'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
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
  @IsUUID(undefined, { each: true })
  companyIds?: string[];

  @ApiPropertyOptional({
    description: 'Filter by jenis pelaporan (array of strings)',
    example: ['Penggunaan Bahan B3', 'Produksi B3'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
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
  @IsString({ each: true })
  jenisPelaporan?: string[];

  @ApiPropertyOptional({
    description: 'Filter by tipe perusahaan (array of strings)',
    example: ['PERUSAHAAN_PRODUSEN', 'PERUSAHAAN_PENGGUNA'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
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
  @IsString({ each: true })
  tipePerusahaan?: string[];

  @ApiPropertyOptional({
    description: 'Filter by status pelaporan (array of strings)',
    example: 'true',
    type: Boolean,
  })
  @IsOptional()
  @IsBoolean()
  statusPelaporan?: boolean;

}
