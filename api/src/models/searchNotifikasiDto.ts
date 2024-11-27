import { PaginationDto } from './paginationDto';
import { IsArray, IsEnum, IsOptional, IsUUID, IsDate } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { StatusNotifikasi } from './enums/statusNotifikasi';
import { EndDateConstraint, ValidateEndDate } from 'src/validators/startDateEndDate.validator';

export class SearchNotifikasiDto extends PaginationDto {
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
  @IsEnum(StatusNotifikasi, { each: true })
  statuses?: StatusNotifikasi[];

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  startDate?: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  @ValidateEndDate('startDate')
  endDate?: Date;
}
