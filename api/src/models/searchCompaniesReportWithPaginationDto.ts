import { Transform, Type } from 'class-transformer';
import { IsOptional, IsUUID, IsArray, IsString, IsBoolean, IsEnum } from 'class-validator';
import { PaginationDto } from './paginationDto';
import { JenisPelaporan } from './enums/jenisPelaporan';

export class SearchCompaniesReportWithPaginationDto extends PaginationDto {
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
  @IsEnum(JenisPelaporan, { message: 'Jenis laporan harus berupa enum yang valid.' })
  jenisLaporan?: JenisPelaporan;

  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  isReported?: boolean;
}
