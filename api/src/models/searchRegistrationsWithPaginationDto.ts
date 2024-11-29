import { Transform, Type } from 'class-transformer';
import { IsOptional, IsUUID, IsArray, IsString, IsBoolean, ArrayNotEmpty } from 'class-validator';
import { PaginationDto } from './paginationDto';

export class SearchRegistrationsWithPaginationDto extends PaginationDto {
  @IsOptional()
  @IsUUID()
  periodId?: string;

  @IsOptional()
  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
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
  companyIds?: string[];

  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  isReported?: boolean;
}
