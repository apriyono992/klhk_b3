import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsArray, IsString, IsEnum } from 'class-validator';
import { PaginationDto } from './paginationDto';
import { TembusanTipe } from './enums/tipeTembusan';
import { Transform } from 'class-transformer';

export class SearchDataTembusanDto extends PaginationDto {
  @ApiPropertyOptional({
    description: 'Filter by one or more Nama Tembusan',
    example: ['General Directorate', 'Operations'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
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
  nama?: string[];

  @ApiPropertyOptional({
    description: 'Filter by one or more Tipe Tembusan (e.g., UMUM, DIREKTUR)',
    enum: TembusanTipe,
    isArray: true,
  })
  @IsOptional()
  @IsArray()
  @IsEnum(TembusanTipe, { each: true })
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
  tipe?: TembusanTipe[];
}
