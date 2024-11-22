import { Transform, Type } from 'class-transformer';
import { IsOptional, IsUUID, IsArray, IsString, IsBoolean } from 'class-validator';
import { PaginationDto } from './paginationDto';

export class SearchRegistrationsWithPaginationDto extends PaginationDto {
  @IsOptional()
  @IsUUID()
  periodId?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  companyIds?: string[];

  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  isReported?: boolean;
}
