import { Transform, Type } from 'class-transformer';
import { IsOptional, IsBoolean, IsUUID, IsArray, IsString } from 'class-validator';
import { PaginationDto } from './paginationDto';

export class SearchApplicationsWithPaginationDto extends PaginationDto {
  @IsOptional()
  @IsUUID()
  periodId?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  companyIds?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  vehicleIds?: string[];

  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  isReported?: boolean;
}
