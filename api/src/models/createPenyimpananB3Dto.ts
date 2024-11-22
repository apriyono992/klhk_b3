import { IsEnum, IsNumber, IsOptional, IsString, Validate,  } from 'class-validator';
import { IsCompanyExists } from 'src/validators/isCompanyExists.validator';
import { StatusPenyimpananB3 } from './enums/statusPenyimpananB3';
import { IsProvinceExist } from 'src/validators/province.validator';
import { IsRegencyValid } from 'src/validators/regency.validator';
import { IsDistrictValid } from 'src/validators/district.validator';
import { IsVillageValid } from 'src/validators/village.validator';

export class CreatePenyimpananB3Dto {

    @IsCompanyExists()
    @IsString()
    companyId: string;
    
    @IsString()
    @IsOptional()
    alamatGudang: string;

    @IsNumber()
    @IsOptional()
    longitude: number;

    @IsNumber()
    @IsOptional()
    latitude: number;

    @IsNumber()
    @IsOptional()
    luasArea: number;

    @IsEnum(StatusPenyimpananB3)
    @IsOptional()
    status: StatusPenyimpananB3;

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

    @IsOptional()
    @IsString()
    @Validate(IsVillageValid, ['districtId']) // Ensure village belongs 
    villageId: string;
}