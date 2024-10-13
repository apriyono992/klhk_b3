import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsArray, IsString, IsEnum } from 'class-validator';
import { PaginationDto } from './paginationDto';
import { PejabatStatus } from './enums/statusPejabat';

export class SearchDataPejabatDto extends PaginationDto {
  @ApiPropertyOptional({
    description: 'Filter by one or more NIP',
    example: ['123456789', '987654321'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  nip?: string[];

  @ApiPropertyOptional({
    description: 'Filter by one or more Nama Pejabat',
    example: ['John Doe', 'Jane Doe'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  nama?: string[];

  @ApiPropertyOptional({
    description: 'Filter by one or more Jabatan Pejabat',
    example: ['Director', 'Manager'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  jabatan?: string[];

  @ApiPropertyOptional({
    description: 'Filter by one or more Status Pejabat (e.g., PLT, PLH, AKTIF)',
    enum: PejabatStatus,
    isArray: true,
  })
  @IsOptional()
  @IsArray()
  @IsEnum(PejabatStatus, { each: true })
  status?: PejabatStatus[];
}
