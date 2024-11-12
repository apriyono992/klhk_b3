import { IsString, IsUUID, IsInt, IsNumber, IsPositive, IsOptional, Min } from 'class-validator';

export class CreatePelaporanBahanB3DistribusiDto {
  @IsUUID()
  companyId: string;

  @IsUUID()
  periodId: string;

  @IsInt()
  @Min(1)
  bulan: number;

  @IsInt()
  tahun: number;

  @IsUUID()
  dataBahanB3Id: string;

  @IsNumber({ maxDecimalPlaces: 5 })
  @IsPositive()
  jumlahB3Distribusi: number;

  @IsOptional()
  dataCustomers?: string[];

  @IsOptional()
  dataTransporters?: string[];
}
