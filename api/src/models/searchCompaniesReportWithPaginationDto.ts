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
