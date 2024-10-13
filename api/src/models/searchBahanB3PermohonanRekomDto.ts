import { IsOptional, IsArray, IsString, IsBoolean, IsUUID } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationDto } from './paginationDto';

export class SearchBahanB3PermohonanRekomDto extends PaginationDto {
  @ApiPropertyOptional({ description: 'Filter by multiple characteristics of the B3 (karakteristikB3)', type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  karakteristikB3?: string[];

  @ApiPropertyOptional({ description: 'Filter by multiple phases of the B3 (fasaB3)', type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  fasaB3?: string[];

  @ApiPropertyOptional({ description: 'Filter by multiple packaging types (jenisKemasan)', type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  jenisKemasan?: string[];

  @ApiPropertyOptional({ description: 'Filter by multiple origins of the B3 (asalMuat)', type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  asalMuat?: string[];

  @ApiPropertyOptional({ description: 'Filter by multiple destinations of the B3 (tujuanBongkar)', type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tujuanBongkar?: string[];

  @ApiPropertyOptional({ description: 'Filter by multiple purposes of the B3 (tujuanPenggunaan)', type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tujuanPenggunaan?: string[];

  @ApiPropertyOptional({ description: 'Filter by whether the B3 is listed in PP 74/2001 (b3pp74)' })
  @IsOptional()
  @IsBoolean()
  b3pp74?: boolean;

  @ApiPropertyOptional({ description: 'Filter by whether the B3 is outside the list of PP 74/2001 (b3DiluarList)' })
  @IsOptional()
  @IsBoolean()
  b3DiluarList?: boolean;

  @ApiPropertyOptional({ description: 'Filter by application ID' })
  @IsOptional()
  @IsUUID()
  applicationId?: string;
}
