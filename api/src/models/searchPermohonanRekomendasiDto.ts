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
    @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
    companyId?: string[];
  
    @ApiPropertyOptional({ description: 'Filter by application IDs', type: [String] })
    @IsOptional()
    @IsArray()
    @ArrayNotEmpty()
    @IsString({ each: true })
    @IsApplicationExists({ each: true })
    @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
    applicationId?: string[];
  
    @ApiPropertyOptional({ description: 'Filter by application statuses', enum: StatusPermohonan, isArray: true })
    @IsOptional()
    @IsArray()
    @ArrayNotEmpty()
    @IsEnum(StatusPermohonan, { each: true })
    @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
    status?: StatusPermohonan[];
  
    @ApiPropertyOptional({ description: 'Search by kodePermohonan', type: [String] })
    @IsOptional()
    @IsArray()
    @ArrayNotEmpty()
    @IsString({ each: true })
    @IsKodePermohonanExists({ each: true })
    @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
    kodePermohonan?: string[];
  }
