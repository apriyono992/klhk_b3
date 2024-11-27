import { Type } from 'class-transformer';
import { IsString, IsUUID, IsInt, IsNumber, IsPositive, IsOptional, Min } from 'class-validator';

export class CreatePelaporanBahanB3DistribusiDto {
  @IsUUID()
  companyId: string;

  @IsUUID()
  periodId: string;

  @IsInt()
  @Type(() => Number)
  @Min(1)
  bulan: number;

  @IsInt()
  @Type(() => Number)
  tahun: number;

  @IsUUID()
  dataBahanB3Id: string;

  @IsNumber({ maxDecimalPlaces: 5 })
  @Type(() => Number)
  @IsPositive()
  jumlahB3Distribusi: number;

  @IsOptional()
  dataCustomers?: string[];

  @IsOptional()
  dataTransporters?: string[];
}
