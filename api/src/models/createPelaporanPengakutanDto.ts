import { IsUUID, IsInt, IsBoolean, IsArray, IsOptional } from 'class-validator';
import { CreatePengangkutanDetailDto } from './createPelaporanPengakutanDetailDto';

export class CreatePelaporanPengangkutanDto {
  @IsUUID()
  applicationId: string;

  @IsUUID()
  companyId: string;

  @IsUUID()
  vehicleId: string;

  @IsInt({ message: 'Bulan harus berupa angka antara 1 hingga 12.' })
  bulan: number;

  @IsInt({ message: 'Tahun harus berupa angka yang valid.' })
  tahun: number;

  @IsArray({ message: 'Pengangkutan details harus berupa array.' })
  pengangkutanDetails: CreatePengangkutanDetailDto[];

  @IsBoolean()
  @IsOptional()
  isDraft?: boolean;

  @IsUUID()
  periodId: string; // Associate report with a period
}
