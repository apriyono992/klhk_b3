import { IsString, IsInt, IsOptional, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateCompanyDto } from './CreateCompanyDto';
import { CreateVehicleDto } from './createVechileDto';

export class CreateSuratRekomendasiB3Dto {
  @IsInt()
  tipe: number; // Tipe surat (e.g., 1 for BARU, 2 for PERPANJANGAN, etc.)

  @IsString()
  kodePermohonanRekomendasi: string;

  @ValidateNested()
  @Type(() => CreateCompanyDto)
  company: CreateCompanyDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateVehicleDto)
  vehicles: CreateVehicleDto[];
}
