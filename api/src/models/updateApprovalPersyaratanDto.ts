import {IsDate, IsNotEmpty, IsOptional, IsString} from 'class-validator';
import {Type} from "class-transformer";

export class UpdateApprovalPersyaratanDto {
  @IsString()
  @IsOptional()
  nomor_surat?: string;

  @IsString()
  @IsOptional()
  approval_status?: string;

  @IsString()
  @IsOptional()
  status?: string;

  @IsString()
  @IsOptional()
  approved_by?: string;

  @IsDate()
  @IsNotEmpty()
  @Type(() => Date)
  tanggal_surat: Date;
}
