import { IsEnum, IsNumber, IsOptional, IsString,  } from 'class-validator';
import { IsCompanyExists } from 'src/validators/isCompanyExists.validator';
import { StatusPenyimpananB3 } from './enums/statusPenyimpananB3';

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
}