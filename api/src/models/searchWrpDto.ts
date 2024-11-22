import { Transform, Type } from 'class-transformer';
import { IsOptional, IsEnum, IsString, IsDate, IsNumber, IsBoolean } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { StatusWpr } from './enums/statusWpr';
import { PaginationDto } from './paginationDto';

export class SearchWprDto extends PaginationDto {
  @ApiPropertyOptional({ description: 'ID Provinsi', example: 'province123' })
  @IsOptional()
  @IsString()
  provinceId?: string;

  @ApiPropertyOptional({ description: 'ID Kabupaten/Kota', example: 'regency123' })
  @IsOptional()
  @IsString()
  regencyId?: string;

  @ApiPropertyOptional({ description: 'ID Kecamatan', example: 'district123' })
  @IsOptional()
  @IsString()
  districtId?: string;

  @ApiPropertyOptional({ description: 'ID Desa/Kelurahan', example: 'village123' })
  @IsOptional()
  @IsString()
  villageId?: string;

  @ApiPropertyOptional({ description: 'Status Wilayah', enum: StatusWpr, example: 'Berizin' })
  @IsOptional()
  @IsEnum(StatusWpr)
  status?: StatusWpr;

  @ApiPropertyOptional({ description: 'Tanggal mulai pengambilan data', example: '2024-01-01' })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  startDate?: Date;

  @ApiPropertyOptional({ description: 'Tanggal akhir pengambilan data', example: '2024-12-31' })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  endDate?: Date;

  @ApiPropertyOptional({ description: 'Luas wilayah minimal', example: 100.0 })
  @IsOptional()
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  minArea?: number;

  @ApiPropertyOptional({ description: 'Luas wilayah maksimal', example: 500.0 })
  @IsOptional()
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  maxArea?: number;

  @ApiPropertyOptional({ description: 'Kembalikan semua data tanpa paginasi', example: true, default: false })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  returnAll?: boolean = false;
}
