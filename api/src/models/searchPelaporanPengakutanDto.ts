import { IsOptional, IsUUID, IsInt, IsString, IsArray, IsNumber } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationDto } from './paginationDto';

export class SearchPelaporanPengakutanDto extends PaginationDto {
  @ApiPropertyOptional({ description: 'Filter by Application ID', example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsOptional()
  @IsUUID()
  applicationId?: string;

  @ApiPropertyOptional({ description: 'Filter by Period ID', example: '123e4567-e89b-12d3-a456-426614174001' })
  @IsOptional()
  @IsUUID()
  periodId?: string;

  @ApiPropertyOptional({ description: 'Filter by month (1 for January, 2 for February, etc.)', example: 1 })
  @IsOptional()
  @IsInt()
  bulan?: number;

  @ApiPropertyOptional({ description: 'Filter by year', example: 2023 })
  @IsOptional()
  @IsInt()
  tahun?: number;

  @ApiPropertyOptional({ description: 'Filter by Vehicle IDs', isArray: true })
  @IsOptional()
  @IsArray()
  @IsUUID(undefined, { each: true })
  vehicleIds?: string[];

  @ApiPropertyOptional({ description: 'Filter by B3Substance IDs', isArray: true })
  @IsOptional()
  @IsArray()
  @IsUUID(undefined, { each: true })
  b3SubstanceIds?: string[];

  // Filter by combined longitude and latitude for perusahaanAsalMuat
  @ApiPropertyOptional({ description: 'Longitude for perusahaanAsalMuat', example: 106.84513 })
  @IsOptional()
  @IsNumber()
  longitudeAsalMuat?: number;

  @ApiPropertyOptional({ description: 'Latitude for perusahaanAsalMuat', example: -6.21462 })
  @IsOptional()
  @IsNumber()
  latitudeAsalMuat?: number;

  // Filter by combined longitude and latitude for perusahaanTujuanBongkar
  @ApiPropertyOptional({ description: 'Longitude for perusahaanTujuanBongkar', example: 106.84513 })
  @IsOptional()
  @IsNumber()
  longitudeTujuanBongkar?: number;

  @ApiPropertyOptional({ description: 'Latitude for perusahaanTujuanBongkar', example: -6.21462 })
  @IsOptional()
  @IsNumber()
  latitudeTujuanBongkar?: number;
}
