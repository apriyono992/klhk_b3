import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsOptional, IsBoolean, IsString, IsUUID } from 'class-validator';
import { Transform } from 'class-transformer';
import { PaginationDto } from './paginationDto';

export class SearchPendingRequestStokBahanB3Dto extends PaginationDto {
  @ApiPropertyOptional({
    description: 'Filter by company IDs (array of UUIDs)',
    example: ['123e4567-e89b-12d3-a456-426614174002', '123e4567-e89b-12d3-a456-426614174003'],
  })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true, message: 'Each companyId must be a valid UUID' })
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
  }) // Ensure it is an array
  companyIds?: string[];

  @ApiPropertyOptional({
    description: 'Filter by approval status',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true') // Convert query string to boolean
  statusApproval?: boolean;

  @ApiPropertyOptional({
    description: 'Filter by dataBahanB3 IDs (array of UUIDs)',
    example: ['123e4567-e89b-12d3-a456-426614174001', '123e4567-e89b-12d3-a456-426614174004'],
  })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true, message: 'Each dataBahanB3Id must be a valid UUID' })
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
  }) // Ensure it is an array
  dataBahanB3Ids?: string[];
}
