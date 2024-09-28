import { IsString, IsInt, IsOptional, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateCompanyDto {
  @IsString()
  name: string;

  @IsString()
  penanggungJawab: string;

  @IsString()
  alamatKantor: string;

  @IsString()
  telpKantor: string;

  @IsOptional()
  @IsString()
  faxKantor?: string;

  @IsOptional()
  @IsString()
  emailKantor?: string;

  @IsOptional()
  @IsString()
  npwp?: string;

  @IsOptional()
  @IsString()
  nomorInduk?: string;

  @IsOptional()
  @IsString()
  kodeDBKlh?: string;

  @IsOptional()
  @IsArray()
  alamatPool?: string[];

  @IsOptional()
  @IsString()
  bidangUsaha?: string;
}
