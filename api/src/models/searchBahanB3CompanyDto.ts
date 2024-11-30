import { IsOptional, IsEnum, IsNumber, Min, IsString, IsArray, IsUUID, IsBoolean } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
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
