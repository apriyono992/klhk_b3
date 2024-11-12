import { IsString, IsOptional, IsArray, IsEnum } from 'class-validator';
import { TipePerusahaan } from './enums/tipePerusahaan';

export class UpdateCompanyDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  penanggungJawab?: string;

  @IsOptional()
  @IsString()
  alamatKantor?: string;

  @IsOptional()
  @IsString()
  telpKantor?: string;

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
  @IsString({ each: true })
  alamatPool?: string[]; // Added alamatPool to the update DTO

  @IsOptional()
  @IsString()
  bidangUsaha?: string;

  @IsOptional()
  @IsArray()
  @IsEnum(TipePerusahaan, { each: true })
  tipePerusahaan?: TipePerusahaan[];
}
