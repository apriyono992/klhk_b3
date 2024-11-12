import { IsString, IsOptional, IsEmail, IsNumber, ValidateNested, IsArray, Validate, IsLatitude, IsLongitude } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { UpdateDataPICDto } from './updateDataPICDto';
import { IsVillageValid } from 'src/validators/village.validator';
import { IsDistrictValid } from 'src/validators/district.validator';
import { IsRegencyValid } from 'src/validators/regency.validator';
import { IsProvinceExist } from 'src/validators/province.validator';

export class UpdateDataCustomerDto {
  @IsOptional()
  @IsString()
  namaCustomer?: string;

  @IsOptional()
  @IsString()
  alamat?: string;

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

  @IsOptional()
  @IsString()
  @IsProvinceExist() // Ensure province exists
  provinceId: string;

  @IsOptional()
  @IsString()
  @Validate(IsRegencyValid, ['provinceId']) // Ensure regency belongs 
  regencyId: string;

  @IsOptional()
  @IsString()
  @Validate(IsDistrictValid, ['regencyId']) // Ensure district 
  districtId: string;

  @IsString()
  @Validate(IsVillageValid, ['districtId']) // Ensure village belongs 
  villageId: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateDataPICDto)
  dataPICs?: UpdateDataPICDto[];
}
