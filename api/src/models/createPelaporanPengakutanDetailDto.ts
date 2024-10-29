import { IsUUID, IsNumber, IsArray, IsString } from 'class-validator';
import { CreatePerusahaanAsalMuatDanTujuanDto } from './createPerusahaanAsalDanTujuanB3Dto';

export class CreatePengangkutanDetailDto {
  @IsUUID()
  b3SubstanceId: string;

  @IsNumber({}, { message: 'Jumlah B3 harus berupa angka.' })
  jumlahB3: number;

  @IsArray()
  perusahaanAsalMuat: CreatePerusahaanAsalMuatDanTujuanDto[];

  @IsArray()
  perusahaanTujuanBongkar: CreatePerusahaanAsalMuatDanTujuanDto[];
}
