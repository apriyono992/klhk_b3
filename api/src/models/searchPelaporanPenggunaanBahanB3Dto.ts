import { IsOptional, IsUUID, IsInt, IsString, IsDateString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationDto } from './paginationDto';

export class SearchPelaporanPenggunaanBahanB3Dto extends PaginationDto {
  @ApiPropertyOptional({ description: 'ID perusahaan', example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsOptional()
  @IsUUID()
  companyId?: string;

  @ApiPropertyOptional({ description: 'ID periode', example: '321e4567-e89b-12d3-a456-426614174999' })
  @IsOptional()
  @IsUUID()
  periodId?: string;

  @ApiPropertyOptional({ description: 'ID bahan B3', example: '111e4567-e89b-12d3-a456-426614174111' })
  @IsOptional()
  @IsUUID()
  dataBahanB3Id?: string;

  @ApiPropertyOptional({ description: 'Bulan laporan', example: 10 })
  @IsOptional()
  @IsInt()
  bulan?: number;

  @ApiPropertyOptional({ description: 'Tahun laporan', example: 2024 })
  @IsOptional()
  @IsInt()
  tahun?: number;

  @ApiPropertyOptional({ description: 'Tipe pembelian', example: 'IMPORT' })
  @IsOptional()
  @IsString()
  tipePembelian?: string;

  @ApiPropertyOptional({ description: 'Tanggal mulai', example: '2024-01-01' })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({ description: 'Tanggal akhir', example: '2024-12-31' })
  @IsOptional()
  @IsDateString()
  endDate?: string;
}
