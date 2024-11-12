import { IsString, IsUUID, IsInt, IsOptional, IsNumber, IsPositive, MaxLength, Min, IsEnum } from 'class-validator';
import { TipeProdukDihasilkan } from './enums/tipeProdukDihasilkan';
import { IsCompanyExists } from 'src/validators/isCompanyExists.validator';

export class CreatePelaporanBahanB3DihasilkanDto {
  @IsEnum(TipeProdukDihasilkan)
  tipeProduk: TipeProdukDihasilkan;

  @IsUUID()
  @IsCompanyExists()
  companyId: string;

  @IsUUID()
  periodId: string;

  @IsInt()
  @Min(1)
  bulan: number;

  @IsInt()
  tahun: number;

  @IsOptional()
  @IsString()
  prosesProduksi?: string;

  @IsOptional()
  @IsUUID()
  dataBahanB3Id?: string;

  @IsOptional()
  @IsUUID()
  namaProduk?: string;

  @IsNumber({ maxDecimalPlaces: 5 })
  @IsPositive()
  jumlahB3Dihasilkan: number;
}
