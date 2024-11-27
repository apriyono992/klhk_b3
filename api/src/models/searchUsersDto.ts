import { Transform, Type } from 'class-transformer';
import { IsArray, IsOptional, IsString, IsUUID } from 'class-validator';
import { PaginationDto } from './paginationDto';

export class SearchUsersDto extends PaginationDto {
  @IsOptional()
  @IsArray()
  @IsUUID('all', { each: true }) // Memastikan setiap elemen array adalah UUID
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
  }) // Memastikan single value menjadi array
  companyIds?: string[];

  @IsOptional()
  @IsString()
  nama?: string; // Filter tambahan berdasarkan nama pengguna (opsional)
}
