import { IsString, IsEnum, IsDate, IsUUID, IsOptional, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';
import { StatusNotifikasi } from './enums/statusNotifikasi';
import { IsCompanyExists } from 'src/validators/isCompanyExists.validator';
import { IsReferenceExists } from 'src/validators/notifikasi.validator';
import { DataBahanB3MustExist } from 'src/validators/dataBahanB3.validator';

export class CreateNotifikasiDto {
  @IsUUID()
  @IsCompanyExists()
  companyId: string;

  @IsString()
  @IsReferenceExists()
  referenceNumber:  string; // EU reference number for the chemical

  @IsString()
  @DataBahanB3MustExist()
  databahanb3Id: string;

  @IsEnum(StatusNotifikasi)
  status: StatusNotifikasi;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  tanggalDiterima?: Date;

  @IsOptional()
  @IsString()
  changeBy?: string;  // Flag to mark whether the draft surat has been generated or printed

  @IsOptional()
  @IsBoolean()
  exceedsThreshold?: boolean;
}
