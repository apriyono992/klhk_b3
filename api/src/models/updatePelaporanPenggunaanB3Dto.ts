import { IsString, IsInt, IsNumber, IsOptional, IsArray } from 'class-validator';

export class UpdatePelaporanPenggunaanBahanB3Dto {
  @IsOptional()
  @IsString()
  dataBahanB3Id?: string;

  @IsOptional()
  @IsInt()
  bulan?: number;

  @IsOptional()
  @IsInt()
  tahun?: number;

  @IsOptional()
  @IsString()
  periodId?: string;

  @IsOptional()
  @IsString()
  tipePembelian?: string;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 5 })
  jumlahPembelianB3?: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 5 })
  jumlahB3Digunakan?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  dataSuppliers?: string[];
}