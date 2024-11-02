import { IsUUID, IsString, IsNumber, IsOptional, IsLongitude, IsLatitude } from 'class-validator';

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

  @IsLatitude()
  @IsOptional()
  latitude: number;

  @IsLongitude()
  @IsOptional()
  longitude: number;

  @IsString()
  @IsOptional()
  locationType: string;
}
