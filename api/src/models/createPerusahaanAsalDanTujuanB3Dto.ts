import { IsUUID, IsString, IsNumber } from 'class-validator';

export class CreatePerusahaanAsalMuatDanTujuanDto {
  @IsUUID()
  companyId: string;

  @IsString()
  namaPerusahaan: string;

  @IsString()
  alamat: string;

  @IsNumber()
  latitude: number;

  @IsNumber()
  longitude: number;

  @IsString()
  locationType: string;
}
