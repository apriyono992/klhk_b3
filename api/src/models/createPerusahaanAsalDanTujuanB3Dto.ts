import { IsUUID, IsString, IsNumber, IsLatitude, IsLongitude, IsNotEmpty } from 'class-validator';

export class CreatePerusahaanAsalMuatDanTujuanDto {
  @IsUUID()
  @IsNotEmpty()
  companyId: string;

  @IsString()
  @IsNotEmpty()
  namaPerusahaan: string;

  @IsString()
  @IsNotEmpty()
  alamat: string;

  @IsLatitude()
  @IsNotEmpty()
  latitude: number;

  @IsLongitude()
  @IsNotEmpty()
  longitude: number;

  @IsString()
  locationType: string;
}
