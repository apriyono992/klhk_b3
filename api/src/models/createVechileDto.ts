import { IsString, IsInt, IsOptional, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateVehicleDto {
    @IsString()
    noPolisi: string;
  
    @IsString()
    modelKendaraan: string;
  
    @IsInt()
    tahunPembuatan: number;
  
    @IsString()
    nomorRangka: string;
  
    @IsString()
    nomorMesin: string;
  
    @IsString()
    kepemilikan: string;
  }
  