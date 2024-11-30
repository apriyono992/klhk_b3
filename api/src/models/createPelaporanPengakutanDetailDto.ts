import { Transform, Type } from 'class-transformer';
import { IsUUID, IsNumber, IsArray, IsString, IsOptional, ValidateNested, IsEnum, IsLatitude, IsLongitude } from 'class-validator';
import { TipeLokasiMuatDanBongkar } from './enums/tipeLokasiMuatDanBongkar';

export class PerusahaanTujuanBongkarDetailDto {
  @IsUUID()
  perusahaanTujuanBongkarId: string;
  @IsEnum(TipeLokasiMuatDanBongkar, { message: 'Tipe lokasi muat dan bongkar harus berupa enum Gudang atau Pelabuhan.' })
  locationType: TipeLokasiMuatDanBongkar;

  @IsOptional() 
  @Transform(({ value }) => parseFloat(value))
  @IsLongitude()
  longitudeTujuanBongkar: number;

  @IsOptional() 
  @Transform(({ value }) => parseFloat(value))
  @IsLatitude()
  latitudeTujuanBokar: number;
}

export class PerusahaanTujuanBongkarDto {
  
  @IsOptional()
  @IsUUID()
  perusahaanAsalMuatId: string;

  @IsEnum(TipeLokasiMuatDanBongkar, { message: 'Tipe lokasi muat dan bongkar harus berupa enum Gudang atau Pelabuhan.' })
  locationType: TipeLokasiMuatDanBongkar;

  @IsOptional() 
  @Transform(({ value }) => parseFloat(value))
  @IsLongitude({ message: 'Longitude harus berupa angka.' })
  longitudeAsalMuat: number;

  @IsOptional() 
  @Transform(({ value }) => parseFloat(value))
  @IsLatitude({message: 'Latitude harus berupa angka.'})
  latitudeAsalMuat: number;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PerusahaanTujuanBongkarDetailDto)
  perusahaanTujuanBongkar: PerusahaanTujuanBongkarDetailDto[];
}

export class PerusahaanAsalMuatDto {
  
  @IsOptional()
  @IsUUID()
  perusahaanAsalMuatId: string;

  @IsEnum(TipeLokasiMuatDanBongkar, { message: 'Tipe lokasi muat dan bongkar harus berupa enum GUDANG atau NON_B3.' })
  locationType: TipeLokasiMuatDanBongkar;

  @IsOptional() 
  @Transform(({ value }) => parseFloat(value))
  @IsLongitude({ message: 'Longitude harus berupa angka.' })
  longitudeAsalMuat: number;

  @IsOptional() 
  @Transform(({ value }) => parseFloat(value))
  @IsLatitude({message: 'Latitude harus berupa angka.'})
  latitudeAsalMuat: number;
}


export class CreatePengangkutanDetailDto {
  @IsUUID()
  b3SubstanceId: string;

  @IsNumber({}, { message: 'Jumlah B3 harus berupa angka.' })
  jumlahB3: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  perusahaanAsalMuat: string[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PerusahaanTujuanBongkarDto)
  perusahaanAsalMuatDanTujuanBongkar: PerusahaanTujuanBongkarDto[];
}
