import { IsString, IsUUID, IsInt, IsOptional, IsNumber, IsPositive, MaxLength, Min, IsEnum } from 'class-validator';
import { TipeProdukDihasilkan } from './enums/tipeProdukDihasilkan';

export class UpdatePelaporanB3DihasilkanDto {

  @IsOptional()
  @IsEnum(TipeProdukDihasilkan)
  tipeProduk: TipeProdukDihasilkan;


  @IsOptional()
  @IsUUID()
  periodId?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  bulan?: number;

  @IsOptional()
  @IsInt()
  tahun?: number;

  @IsOptional()
  @IsString()
  prosesProduksi?: string;

  @IsOptional()
  @IsUUID()
  namaProduk?: string;

  @IsOptional()
  @IsUUID()
  dataBahanB3Id?: string;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 5 })
  @IsPositive()
  jumlahB3Dihasilkan?: number;
}
