import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsArray, IsString, IsEnum } from 'class-validator';
import { PaginationDto } from './paginationDto';
import { TipeBahan } from './enums/tipeBahan';
import { Transform } from 'class-transformer';

export class SearchDataBahanB3Dto extends PaginationDto {
  @ApiPropertyOptional({
    description: 'Filter by one or more CAS numbers',
    example: ['50-00-0', '67-56-1'],  // Example with multiple CAS numbers
    type: [String],
  })
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
  casNumber?: string[];

  @ApiPropertyOptional({
    description: 'Filter by one or more Nama Dagang (Trade Name)',
    example: ['Formalin', 'Methanol'],  // Example with multiple trade names
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  namaDagang?: string[];

  @ApiPropertyOptional({
    description: 'Filter by Nama Bahan Kimia (Chemical Name)',
    example: 'Formaldehyde',
  })
  @IsOptional()
  @IsString()
  namaBahanKimia?: string;

  @ApiPropertyOptional({
    description: 'Filter by one or more Tipe Bahan (e.g., DAPAT_DIPERGUNAKAN, TERBATAS_DIPERGUNAKAN, etc.)',
    example: ['DAPAT_DIPERGUNAKAN', 'TERBATAS_DIPERGUNAKAN'],
    enum: TipeBahan,
    isArray: true,
  })
  @IsOptional()
  @IsArray()
  @IsEnum(TipeBahan, { each: true })
  tipeBahan?: TipeBahan[];
}
