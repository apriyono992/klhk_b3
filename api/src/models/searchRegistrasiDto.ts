import { PaginationDto } from './paginationDto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class SearchRegistrasiDto extends PaginationDto {
  @ApiPropertyOptional({ description: 'Search' })
  @IsOptional()
  @IsString()
  search?: string;
}
