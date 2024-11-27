import { IsOptional, IsString, IsArray, IsUUID, IsBoolean } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationDto } from './paginationDto';
import { Transform } from 'class-transformer';

export class SearchVehicleDto extends PaginationDto {
  @ApiPropertyOptional({ description: 'Search by multiple vehicle registration numbers (noPolisi)', type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
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
  })
  noPolisi?: string[];

  @ApiPropertyOptional({ description: 'Search by vehicle model' })
  @IsOptional()
  @IsString()
  modelKendaraan?: string;

  @ApiPropertyOptional({ description: 'Search by vehicle owner (kepemilikan)' })
  @IsOptional()
  @IsString()
  kepemilikan?: string;

  @ApiPropertyOptional({ description: 'Filter by application ID' })
  @IsOptional()
  @IsUUID()
  applicationId?: string;

  @ApiPropertyOptional({ description: 'Filter by company ID' })
  @IsOptional()
  @IsUUID()
  companyId?: string;

  @ApiPropertyOptional({ description: 'Include Deleted' })
  @IsOptional()
  @IsBoolean()
  includeDeleted?: boolean;
}
