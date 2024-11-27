import { IsOptional, IsUUID, IsEnum, IsString, IsDate, IsBoolean, IsArray } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { TipeProdukDihasilkan } from './enums/tipeProdukDihasilkan';
import { Transform, Type } from 'class-transformer';
import { PaginationDto } from './paginationDto';

export class SearchPelaporanB3DihasilkanDto extends PaginationDto {
  @ApiPropertyOptional({ description: 'ID perusahaan', example: '123e4567-e89b-12d3-a456-426614174000' })
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
  companyId?: string[];

  @ApiPropertyOptional({ description: 'ID periode', example: '321e4567-e89b-12d3-a456-426614174999' })
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
  periodId?: string[];

  @ApiPropertyOptional({ description: 'ID bahan B3', example: '111e4567-e89b-12d3-a456-426614174111' })
  @IsOptional()
  @IsUUID()
  dataBahanB3Id?: string;

  @ApiPropertyOptional({ description: 'Tipe produk (B3 atau NON_B3)', enum: TipeProdukDihasilkan, example: 'B3' })
  @IsOptional()
  @IsEnum(TipeProdukDihasilkan)
  tipeProduk?: TipeProdukDihasilkan;

  @ApiPropertyOptional({ description: 'Tanggal mulai pencarian (format: YYYY-MM-DD)', example: '2024-01-01' })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  startDate?: Date;

  @ApiPropertyOptional({ description: 'Tanggal akhir pencarian (format: YYYY-MM-DD)', example: '2024-12-31' })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  endDate?: Date;

  @ApiPropertyOptional({ description: 'Jika true, mengembalikan semua data tanpa pagination', example: false })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  returnAll?: boolean;

  @ApiPropertyOptional({ description: 'Jika true, mengembaliakn semua data apa pun', example: false })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  isFinalize?: boolean;
  
}
