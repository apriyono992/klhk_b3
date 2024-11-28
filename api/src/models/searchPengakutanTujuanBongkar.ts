import { PaginationDto } from './paginationDto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class SearchPengakutanTujuanBongkar extends PaginationDto {
  @ApiPropertyOptional({ description: 'Search' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ description: 'Status' })
  @IsString()
  status: string;
}
