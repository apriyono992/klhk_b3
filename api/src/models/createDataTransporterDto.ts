import { Transform } from 'class-transformer';
import {  IsUUID, IsEmail, IsNotEmpty, IsArray, ArrayNotEmpty, IsLongitude, IsLatitude, IsString, Validate, IsOptional } from 'class-validator';
import { IsDistrictValid } from 'src/validators/district.validator';
import { IsProvinceExist } from 'src/validators/province.validator';
import { IsRegencyValid } from 'src/validators/regency.validator';
import { IsVillageValid } from 'src/validators/village.validator';

export class CreateDataTransporterDto {
  @IsString()
  @IsNotEmpty()
  namaCustomer: string;

  @IsString()
  @IsNotEmpty()
  alamat: string;

  @IsEmail()
  email: string;

  @IsString()
  telepon: string;

  @IsOptional()
  @IsString()
  fax?: string;

  @IsUUID()
  companyId: string;

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
  @ArrayNotEmpty()
  @IsUUID(undefined, { each: true })
  dataPICIds: string[];
}
