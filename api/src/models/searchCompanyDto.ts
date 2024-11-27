import { IsArray, IsEnum, IsOptional, IsString } from 'class-validator';
import { PaginationDto } from './paginationDto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { TipePerusahaan } from './enums/tipePerusahaan';

export class SearchCompanyDto extends PaginationDto {
  @ApiPropertyOptional({
    description: 'Filter by company name',
    example: 'PT. ABC Chemical',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    description: 'Filter by NPWP',
    example: '123456789',
  })
  @IsOptional()
  @IsString()
  npwp?: string;

  @ApiPropertyOptional({
    description: 'Filter by business sector (bidang usaha)',
    example: 'Manufacturing',
  })
  @IsOptional()
  @IsString()
  bidangUsaha?: string;

  @ApiPropertyOptional({
    description: 'Filter by kodeDBKlhk',
    example: 'KLH001',
  })
  @IsOptional()
  @IsString()
  kodeDBKlhk?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  companyIds?: string[];

  @IsOptional()
  @IsArray()
  @IsEnum(TipePerusahaan, { each: true })
  tipePerusahaan?: TipePerusahaan[];
}
