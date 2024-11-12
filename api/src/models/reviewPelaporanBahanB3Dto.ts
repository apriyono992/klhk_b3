import { IsEnum, IsString } from 'class-validator';

export class ReviewPelaporanBahanB3Dto {
  @IsEnum(StatusPengajuan)
  status: StatusPengajuan;

  @IsString()
  adminNote: string;
}
