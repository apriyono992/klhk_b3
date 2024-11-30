import { IsString, IsInt, IsNumber, IsArray, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePelaporanPenggunaanBahanB3Dto {
  @IsString()
  companyId: string;

  @IsString()
  dataBahanB3Id: string;

  @IsInt()
  bulan: number; // 1 untuk Januari, 2 untuk Februari, dst.

  @IsInt()
  tahun: number;

  @IsString()
  periodId: string;

  @IsString()
  tipePembelian: string; // Misal: 'Import', 'Lokal'

  @IsOptional() 
  @IsString()
  registrasiId: string; // ID Registrasi

  @IsNumber({ maxDecimalPlaces: 5 })
  jumlahPembelianB3: number; // Menggunakan float dengan maksimal 5 angka desimal

  @IsNumber({ maxDecimalPlaces: 5 })
  jumlahB3Digunakan: number; // Menggunakan float dengan maksimal 5 angka desimal

  @IsArray()
  @IsString({ each: true })
  dataSuppliers: string[]; // Array ID DataSupplier
}
