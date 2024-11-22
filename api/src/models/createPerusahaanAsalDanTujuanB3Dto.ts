import { IsUUID, IsString, IsNumber, IsLatitude, IsLongitude, IsNotEmpty, IsEnum, ArrayNotEmpty, IsArray, IsOptional, Validate } from 'class-validator';
import { TipeLokasiMuatDanBongkar } from './enums/tipeLokasiMuatDanBongkar';
import { IsVillageValid } from 'src/validators/village.validator';
import { IsDistrictValid } from 'src/validators/district.validator';
import { IsRegencyValid } from 'src/validators/regency.validator';
import { IsProvinceExist } from 'src/validators/province.validator';
import { Transform } from 'class-transformer';
import { IsCompanyExists } from 'src/validators/isCompanyExists.validator';

export class CreatePerusahaanAsalMuatDanTujuanDto {
  @IsUUID()
  @IsNotEmpty()
  @IsCompanyExists()
  companyId: string;

  @IsString()
  @IsNotEmpty()
  namaPerusahaan: string;

  @IsString()
  @IsNotEmpty()
  alamat: string;

  @IsOptional()
  @Transform(({ value }) => parseFloat(value))
  @IsLongitude()
  longitude?: number;

  @IsOptional() 
  @Transform(({ value }) => parseFloat(value))
  @IsLatitude()
  latitude?: number;

  @IsString()
  @IsProvinceExist() // Ensure province exists
  provinceId: string;

  @IsString()
  @Validate(IsRegencyValid, ['provinceId']) // Ensure regency belongs 
  regencyId: string;

  @IsString()
  @Validate(IsDistrictValid, ['regencyId']) // Ensure district 
  districtId: string;

  @IsString()
  @Validate(IsVillageValid, ['districtId']) // Ensure village belongs 
  villageId: string;

  @IsArray()
  @IsOptional() 
  @IsUUID(undefined, { each: true })
  dataPICIds: string[];

  @IsOptional()
  @IsEnum(TipeLokasiMuatDanBongkar)
  locationType: TipeLokasiMuatDanBongkar;
}
