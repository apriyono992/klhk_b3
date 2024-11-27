import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsArray, IsString, IsEnum } from 'class-validator';
import { PaginationDto } from './paginationDto';
import { PejabatStatus } from './enums/statusPejabat';
import { Transform } from 'class-transformer';

export class SearchDataPejabatDto extends PaginationDto {
  @ApiPropertyOptional({
    description: 'Filter by one or more NIP',
    example: ['123456789', '987654321'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
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
  nip?: string[];

  @ApiPropertyOptional({
    description: 'Filter by one or more Nama Pejabat',
    example: ['John Doe', 'Jane Doe'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
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
  nama?: string[];

  @ApiPropertyOptional({
    description: 'Filter by one or more Jabatan Pejabat',
    example: ['Director', 'Manager'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
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
  jabatan?: string[];

  @ApiPropertyOptional({
    description: 'Filter by one or more Status Pejabat (e.g., PLT, PLH, AKTIF)',
    enum: PejabatStatus,
    isArray: true,
  })
  @IsOptional()
  @IsArray()
  @IsEnum(PejabatStatus, { each: true })
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
  status?: PejabatStatus[];
}
