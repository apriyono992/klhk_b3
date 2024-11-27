import { IsOptional, IsString, IsEnum, IsArray, ArrayNotEmpty } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { StatusPermohonan } from 'src/models/enums/statusPermohonan';
import { IsCompanyExists } from 'src/validators/isCompanyExists.validator';
import { IsApplicationExists } from 'src/validators/isApplicationIdExists.validatior';
import { IsKodePermohonanExists } from 'src/validators/isKodePermohonanExists.validator';
import { PaginationDto } from './paginationDto';
import { Transform } from 'class-transformer';

export class SearchApplicationDto extends PaginationDto {
    @ApiPropertyOptional({ description: 'Filter by company IDs', type: [String] })
    @IsOptional()
    @IsArray()
    @ArrayNotEmpty()
    @IsString({ each: true })
    @IsCompanyExists({ each: true })
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
    companyId?: string[];
  
    @ApiPropertyOptional({ description: 'Filter by application IDs', type: [String] })
    @IsOptional()
    @IsArray()
    @ArrayNotEmpty()
    @IsString({ each: true })
    @IsApplicationExists({ each: true })
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
    applicationId?: string[];
  
    @ApiPropertyOptional({ description: 'Filter by application statuses', enum: StatusPermohonan, isArray: true })
    @IsOptional()
    @IsArray()
    @ArrayNotEmpty()
    @IsEnum(StatusPermohonan, { each: true })
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
    status?: StatusPermohonan[];
  
    @ApiPropertyOptional({ description: 'Search by kodePermohonan', type: [String] })
    @IsOptional()
    @IsArray()
    @ArrayNotEmpty()
    @IsString({ each: true })
    @IsKodePermohonanExists({ each: true })
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
    kodePermohonan?: string[];

    
    @ApiPropertyOptional({ description: 'Search by Period', type: [String] })
    @IsOptional()
    @IsArray()
    @ArrayNotEmpty()
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
    periodId?: string[];
}
