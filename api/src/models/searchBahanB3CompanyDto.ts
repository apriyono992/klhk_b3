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

  @ApiPropertyOptional({
    description: 'Filter by companyId',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsOptional()
  @IsUUID()
  companyId?: string;

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
