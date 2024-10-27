import { IsString, IsEnum, IsDate, IsUUID, IsOptional, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';
import { StatusNotifikasi } from './enums/statusNotifikasi';
import { IsCompanyExists } from 'src/validators/isCompanyExists.validator';

export class CreateNotifikasiDto {
  @IsUUID()
  @IsCompanyExists()
  companyId: string;

  @IsEnum(StatusNotifikasi)
  status: StatusNotifikasi;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  tanggalDiterima?: Date;

  @IsOptional()
  @IsBoolean()
  exceedsThreshold?: boolean;
}
