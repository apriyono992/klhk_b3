import { PaginationDto } from './paginationDto';
import { IsArray, IsEnum, IsOptional, IsUUID, IsDate } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { StatusNotifikasi } from './enums/statusNotifikasi';
import { EndDateConstraint, ValidateEndDate } from 'src/validators/startDateEndDate.validator';

export class SearchNotifikasiDto extends PaginationDto {
  @IsOptional()
  @IsArray()
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  @IsUUID(undefined, { each: true })
  companyIds?: string[];

  @IsOptional()
  @IsArray()
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
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
