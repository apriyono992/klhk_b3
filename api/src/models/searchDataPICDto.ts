import { IsArray, IsEnum, IsIn, IsOptional, IsString } from 'class-validator';
import { PaginationDto } from './paginationDto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { TipePerusahaan } from './enums/tipePerusahaan'; // Enum untuk tipe perusahaan
import { Transform } from 'class-transformer';

export class SearchDataPICDto extends PaginationDto {
    @ApiPropertyOptional({
    description: 'Type of company related to the PIC (customer, supplier, transporter)',
    example: 'customer',
    enum: ['customer', 'supplier', 'transporter'],
    })
    @IsOptional()
    @IsString()
    @IsIn(['customer', 'supplier', 'transporter'], {
    message: 'Type must be one of the following values: customer, supplier, transporter',
    })
    @Transform(({ value }) => value?.toLowerCase().trim())
    type?: string;

@ApiPropertyOptional({
    description: 'List of company IDs to filter',
    type: [String],
    example: ['companyId1', 'companyId2'],
  })
  @IsOptional()
  @IsArray()
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
  @IsString({ each: true })
  companyIds?: string[];
}
