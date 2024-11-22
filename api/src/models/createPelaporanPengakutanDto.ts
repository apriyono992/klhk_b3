import { IsUUID, IsInt, IsBoolean, IsArray, IsOptional } from 'class-validator';
import { CreatePengangkutanDetailDto } from './createPelaporanPengakutanDetailDto';
import { IsCompanyExists } from 'src/validators/isCompanyExists.validator';
import { IsApplicationExists } from 'src/validators/isApplicationIdExists.validatior';

export class CreatePelaporanPengangkutanDto {
  @IsUUID()
  @IsApplicationExists()
  applicationId: string;

  @IsUUID()
  @IsCompanyExists()
  companyId: string;

  @IsUUID()
  @IsOptional()
  vehicleId: string;

  @IsOptional()
  @IsInt({ message: 'Bulan harus berupa angka antara 1 hingga 12.' })
  bulan: number;
  
  @IsOptional()
  @IsInt({ message: 'Tahun harus berupa angka yang valid.' })
  tahun: number;

  @IsOptional()
  @IsArray({ message: 'Pengangkutan details harus berupa array.' })
  pengangkutanDetails: CreatePengangkutanDetailDto[];

  @IsBoolean()
  @IsOptional()
  isDraft?: boolean;

  @IsUUID()
  periodId: string; // Associate report with a period
}
