import { IsEnum, IsString } from 'class-validator';
import { StatusPengajuan } from './enums/statusPengajuanPelaporan';

export class ReviewPelaporanBahanB3Dto {
  @IsEnum(StatusPengajuan)
  status: StatusPengajuan;

  @IsString()
  adminNote: string;
}
