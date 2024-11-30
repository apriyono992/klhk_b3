import { IsString, IsInt, IsOptional, IsArray, ValidateNested, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TipePerusahaan } from './enums/tipePerusahaan';
import { SkalaPerusahaan } from './enums/skalaPerusahaan';

export class CreateCompanyDto {
  @ApiProperty({
    description: 'The name of the company',
    example: 'PT. ABC Industries',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Person in charge of the company',
    example: 'John Doe',
  })
  @IsString()
  penanggungJawab: string;

  @ApiProperty({
    description: 'Company office address',
    example: 'Jl. Sudirman No. 123, Jakarta',
  })
  @IsString()
  alamatKantor: string;

  @ApiProperty({
    description: 'Office phone number',
    example: '+62 21 5551234',
  })
  @IsString()
  telpKantor: string;

  @ApiPropertyOptional({
    description: 'Office fax number',
    example: '+62 21 5555678',
  })
  @IsOptional()
  @IsString()
  faxKantor?: string;

  @ApiPropertyOptional({
    description: 'Office email address',
    example: 'contact@company.com',
  })
  @IsOptional()
  @IsString()
  emailKantor?: string;

  @ApiPropertyOptional({
    description: 'Company NPWP (Tax ID)',
    example: '01.234.567.8-999.000',
  })
  @IsOptional()
  @IsString()
  npwp?: string;

  @ApiPropertyOptional({
    description: 'Company registration number',
    example: '1234567890',
  })
  @IsOptional()
  @IsString()
  nomorInduk?: string;

  @ApiPropertyOptional({
    description: 'DBKlh Code for the company',
    example: 'DBK-2023-001',
  })
  @IsOptional()
  @IsString()
  kodeDBKlh?: string;

  @ApiPropertyOptional({
    description: 'Addresses of company pools',
    example: ['Jl. Pool A No. 1', 'Jl. Pool B No. 2'],
  })
  @IsOptional()
  @IsArray()
  alamatPool?: string[];

  @ApiPropertyOptional({
    description: 'Business field of the company',
    example: 'Manufacturing',
  })
  @IsOptional()
  @IsString()
  bidangUsaha?: string;

  @IsOptional()
  @IsArray()
  @IsEnum(TipePerusahaan, { each: true })
  tipePerusahaan?: TipePerusahaan[];

  @IsOptional()
  @IsEnum(SkalaPerusahaan)
  skalaPerusahaan: SkalaPerusahaan;
}
