import { Transform } from 'class-transformer';
import {  IsUUID, IsEmail, IsNotEmpty, IsArray, ArrayNotEmpty, IsLongitude, IsLatitude, IsString, Validate, IsOptional } from 'class-validator';
import { IsDistrictValid } from 'src/validators/district.validator';
import { IsProvinceExist } from 'src/validators/province.validator';
import { IsRegencyValid } from 'src/validators/regency.validator';
import { IsVillageValid } from 'src/validators/village.validator';

export class UpdateDataTransporterDto {
  @IsString()
  namaCustomer: string;

  @IsOptional()
  @IsString()
  alamat: string;

  @IsOptional()
  @IsEmail()
  email: string;

  @IsString()
  telepon: string;

  @IsOptional()
  @IsOptional()
  @IsString()
  fax?: string;

  @IsOptional()
  @IsUUID()
  companyId: string;

  @IsOptional()
  @IsOptional()
  @Transform(({ value }) => parseFloat(value))
  @IsLongitude()
  longitude?: number;

  @IsOptional()
  @IsOptional() 
  @Transform(({ value }) => parseFloat(value))
  @IsLatitude()
  latitude?: number;

  @IsOptional()
  @IsString()
  @IsProvinceExist() // Ensure province exists
  provinceId: string;

  @IsString()
  @Validate(IsRegencyValid, ['provinceId']) // Ensure regency belongs 
  regencyId: string;

  @IsOptional()
  @IsString()
  @Validate(IsDistrictValid, ['regencyId']) // Ensure district 
  districtId: string;

  @IsOptional()
  @IsString()
  @Validate(IsVillageValid, ['districtId']) // Ensure village belongs 
  villageId: string;

  @IsOptional()
  @IsArray()
  @IsUUID(undefined, { each: true })
  dataPICIds: string[];
}
