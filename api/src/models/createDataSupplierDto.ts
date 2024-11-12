import { Transform, Type } from 'class-transformer';
import { IsString, IsOptional, IsEmail, IsNumber, IsLongitude, IsLatitude, Validate, IsArray, ValidateNested, ArrayNotEmpty, IsUUID } from 'class-validator';
import { IsDistrictValid } from 'src/validators/district.validator';
import { IsProvinceExist } from 'src/validators/province.validator';
import { IsRegencyValid } from 'src/validators/regency.validator';
import { IsVillageValid } from 'src/validators/village.validator';
import { CreateDataPICDto } from './createDataPICDto';

export class CreateDataSupplierDto {
  @IsString()
  namaSupplier: string;

  @IsString()
  alamat: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  telepon?: string;

  @IsOptional()
  @IsString()
  fax?: string;

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
