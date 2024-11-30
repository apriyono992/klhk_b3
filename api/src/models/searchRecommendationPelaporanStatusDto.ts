import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsUUID, IsArray, isBoolean, IsBoolean } from 'class-validator';
import { Transform } from 'class-transformer';
import { PaginationDto } from './paginationDto';

export class SearchRecommendationPelaporanStatusDto extends PaginationDto {
  @ApiPropertyOptional({
    description: 'Filter by period ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsOptional()
  @IsUUID()
  periodId?: string;

  @ApiPropertyOptional({
    description: 'Filter by company IDs (array of UUIDs)',
    example: ['abcd1234', 'efgh5678'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @Transform(({ value }) => {
    if (Array.isArray(value)) return value.map((v) => v.trim());
    if (typeof value === 'string') return value.split(',').map((v) => v.trim());
    return [value];
  })
  @IsUUID(undefined, { each: true })
  companyIds?: string[];

  @ApiPropertyOptional({
    description: 'Filter by recommendation status',
    example: 'pending',
  })
  @IsOptional()
  @IsBoolean()
  status?: boolean;
}