import { IsOptional, IsEnum, IsNumber, Min, IsString, IsArray, IsUUID, IsBoolean } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { PaginationDto } from './paginationDto';
import { TipePerusahaan } from './enums/tipePerusahaan';

export class SearchBahanB3CompanyDto extends PaginationDto {
  @ApiPropertyOptional({
    description: 'Filter by jenisBahanB3',
    example: 'Solvent',
  })
  @IsOptional()
  @IsString()
  jenisBahanB3?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  companyIds?: string[];

  @ApiPropertyOptional({
    description: 'Minimum stokB3 value',
    example: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  stokB3Min?: number;

  @ApiPropertyOptional({
    description: 'Maximum stokB3 value',
    example: 100,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  stokB3Max?: number;

  @ApiPropertyOptional({
    description: 'Filter by tipePerusahaan (array of enum values)',
    example: ['PRODUSEN', 'PENGOLAH'],
    enum: TipePerusahaan,
    isArray: true,
  })
  @IsOptional()
  @IsArray()
  @IsEnum(TipePerusahaan, { each: true })
  tipePerusahaan?: TipePerusahaan[];

  @ApiPropertyOptional({
    description: 'Include all related fields (company, dataBahanB3, stokHistory)',
    example: true,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  includeAll?: boolean = false;
}
