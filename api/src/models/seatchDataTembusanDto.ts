import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsArray, IsString, IsEnum } from 'class-validator';
import { PaginationDto } from './paginationDto';
import { TembusanTipe } from './enums/tipeTembusan';

export class SearchDataTembusanDto extends PaginationDto {
  @ApiPropertyOptional({
    description: 'Filter by one or more Nama Tembusan',
    example: ['General Directorate', 'Operations'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  nama?: string[];

  @ApiPropertyOptional({
    description: 'Filter by one or more Tipe Tembusan (e.g., UMUM, DIREKTUR)',
    enum: TembusanTipe,
    isArray: true,
  })
  @IsOptional()
  @IsArray()
  @IsEnum(TembusanTipe, { each: true })
  tipe?: TembusanTipe[];
}
