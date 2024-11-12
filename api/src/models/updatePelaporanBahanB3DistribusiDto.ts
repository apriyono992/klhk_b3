import { IsUUID, IsInt, IsNumber, IsOptional, Min, IsPositive } from 'class-validator';

export class UpdatePelaporanBahanB3DistribusiDto {
  @IsOptional()
  @IsUUID()
  dataBahanB3Id?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  bulan?: number;

  @IsOptional()
  @IsInt()
  tahun?: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 5 })
  @IsPositive()
  jumlahB3Distribusi?: number;

  @IsOptional()
  dataCustomers?: string[];

  @IsOptional()
  dataTransporters?: string[];
}
