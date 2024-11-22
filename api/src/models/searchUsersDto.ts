import { Transform, Type } from 'class-transformer';
import { IsArray, IsOptional, IsString, IsUUID } from 'class-validator';
import { PaginationDto } from './paginationDto';

export class SearchUsersDto extends PaginationDto {
  @IsOptional()
  @IsArray()
  @IsUUID('all', { each: true }) // Memastikan setiap elemen array adalah UUID
  @Transform(({ value }) => (Array.isArray(value) ? value : [value])) // Memastikan single value menjadi array
  companyIds?: string[];

  @IsOptional()
  @IsString()
  nama?: string; // Filter tambahan berdasarkan nama pengguna (opsional)
}
