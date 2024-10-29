import { IsInt, IsBoolean, IsOptional } from 'class-validator';

export class UpdatePelaporanPengangkutanDto {
  @IsInt({ message: 'Bulan harus berupa angka antara 1 hingga 12.' })
  @IsOptional()
  bulan?: number;

  @IsInt({ message: 'Tahun harus berupa angka yang valid.' })
  @IsOptional()
  tahun?: number;

  @IsBoolean()
  @IsOptional()
  isDraft?: boolean;
}