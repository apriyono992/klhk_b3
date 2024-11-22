import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsDate, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { PaginationDto } from 'src/models/paginationDto';

export class SearchStokB3PeriodeDto extends PaginationDto {
  @ApiPropertyOptional({
    description: 'ID Perusahaan',
    example: 'company-123',
  })
  @IsOptional()
  @IsString()
  companyId?: string;

  @ApiPropertyOptional({
    description: 'ID Data Bahan B3',
    example: 'bahanB3-456',
  })
  @IsOptional()
  @IsString()
  dataBahanB3Id?: string;

  @ApiPropertyOptional({
    description: 'Tanggal awal pencarian (startDate)',
    example: '2024-01-01',
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  startDate?: Date;

  @ApiPropertyOptional({
    description: 'Tanggal akhir pencarian (endDate)',
    example: '2024-12-31',
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  endDate?: Date;
}
