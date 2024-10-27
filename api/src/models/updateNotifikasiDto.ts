import { IsString, IsEnum, IsDate, IsUUID, IsOptional, IsBoolean, ValidateIf } from 'class-validator';
import { Type } from 'class-transformer';
import { StatusNotifikasi } from './enums/statusNotifikasi';
import { IsCompanyExists } from 'src/validators/isCompanyExists.validator';

export class UpdateNotifikasiDto {
  @IsOptional()
  @IsUUID()
  @IsCompanyExists()
  companyId?: string;

  @IsOptional()
  @IsEnum(StatusNotifikasi)
  status?: StatusNotifikasi;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  tanggalDiterima?: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  tanggalSelesai?: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  tanggalPerubahan?: Date;

  @IsOptional()
  @IsBoolean()
  exceedsThreshold?: boolean;

  // Notes are required if the previous status was DIBATALKAN and the status is being changed
  @ValidateIf((o) => o.status && o.status !== StatusNotifikasi.DIBATALKAN)
  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsString()
  printed?: boolean;  // Flag to mark whether the draft surat has been generated or printed
}
