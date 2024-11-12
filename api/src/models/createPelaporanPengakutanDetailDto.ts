import { IsUUID, IsNumber, IsArray, IsString, IsOptional } from 'class-validator';
import { CreatePerusahaanAsalMuatDanTujuanDto } from './createPerusahaanAsalDanTujuanB3Dto';

export class CreatePengangkutanDetailDto {
  @IsUUID()
  b3SubstanceId: string;

  @IsNumber({}, { message: 'Jumlah B3 harus berupa angka.' })
  jumlahB3: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  perusahaanAsalMuat: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  perusahaanTujuanBongkar: string[];
}
