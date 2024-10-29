import { IsUUID, IsString, IsNumber, IsOptional } from 'class-validator';

export class UpdatePerusahaanAsalMuatDanTujuanDto {
  @IsUUID()
  @IsOptional()
  companyId: string;

  @IsString()
  @IsOptional()
  namaPerusahaan: string;

  @IsString()
  @IsOptional()
  alamat: string;

  @IsNumber()
  @IsOptional()
  latitude: number;

  @IsNumber()
  @IsOptional()
  longitude: number;

  @IsString()
  @IsOptional()
  locationType: string;
}
