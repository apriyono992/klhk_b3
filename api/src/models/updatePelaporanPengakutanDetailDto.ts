import { IsUUID, IsNumber, IsArray, IsString, IsOptional, ValidateNested } from 'class-validator';
import { CreatePerusahaanAsalMuatDanTujuanDto } from './createPerusahaanAsalDanTujuanB3Dto';
import { Type } from 'class-transformer';
import { PerusahaanTujuanBongkarDto } from './createPelaporanPengakutanDetailDto';

export class UpdatePengangkutanDetailDto {
  @IsUUID()
  @IsOptional()
  b3SubstanceId: string;

  @IsNumber({}, { message: 'Jumlah B3 harus berupa angka.' })
  @IsOptional()
  jumlahB3: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  perusahaanAsalMuat: string[];


  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PerusahaanTujuanBongkarDto)
  perusahaanTujuanBongkar: PerusahaanTujuanBongkarDto[];
}
