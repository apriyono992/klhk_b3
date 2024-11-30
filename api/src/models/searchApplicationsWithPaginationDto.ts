import { Transform, Type } from 'class-transformer';
import { IsOptional, IsBoolean, IsUUID, IsArray, IsString } from 'class-validator';
import { PaginationDto } from './paginationDto';

export class SearchApplicationsWithPaginationDto extends PaginationDto {
  @IsOptional()
  @IsUUID()
  periodId?: string;

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
  companyIds?: string[];

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
  vehicleIds?: string[];

  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  isReported?: boolean;
}
