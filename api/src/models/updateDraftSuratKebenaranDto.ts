import { IsString, IsOptional, IsUUID, IsDateString, isEmail, IsEmail, IsEnum, IsDate } from 'class-validator';
import { IsDataBahanB3Exist } from 'src/validators/dataBahanB3.validator';
import { IsPejabatNipExist } from 'src/validators/dataPejabat.validator';
import { IsTembusanExist } from 'src/validators/dataTembusan.validator';
import { IsDraftNotifikasiExists, IsNotifikasiExists } from 'src/validators/notifikasi.validator';
import { TipeSuratNotifikasi } from './enums/tipeSuratNotifikasi';
import { Type } from 'class-transformer';

export class UpdateDraftSuratKebenaranImportDto  {
  
  @IsString()
  @IsDraftNotifikasiExists()
  draftNotifikasiId?: string;  // Optional Notifikasi ID
  
  @IsOptional()
  @IsString()
  nomorSurat?: string;  // Nomor Surat (to be filled by the user later)

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  tanggalSurat?: Date;  // Tanggal Surat (optional for now)

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  tanggalMaksimalSurat?: string;  // Tanggal Surat (optional for now)

  @IsOptional()
  @IsEnum(TipeSuratNotifikasi)
  tipeSurat: TipeSuratNotifikasi;  // Kebenaran Import

  @IsOptional()
  @IsString()
  kodeDBKlh?: string;  // Kode DB KLH

  @IsOptional()
  @IsString()
  sifatSurat?: string;  // Optional: Sifat Surat

  @IsOptional()
  @IsString()
  referenceNumber?: string;  // Optional: Sifat Surat

  @IsOptional()
  @IsString()
  negaraAsal?: string;  // Optional: Sifat Surat
  
  @IsOptional()
  @IsString()
  namaPengirimNotifikasi?: string;  // Optional: Sifat Surat

  @IsOptional()
  @IsString()
  perusaahaanAsal?: string;  // Optional: Sifat Surat

  @IsOptional()
  @IsString()
  @IsEmail()
  emailPenerima?: string;  // Email Penerima

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  tanggalPengiriman?: string;  // Tanggal Pengiriman (can be set later)

  @IsOptional()
  @IsUUID()
  @IsDataBahanB3Exist()
  dataBahanB3Id?: string;  // Optional: Foreign key for DataBahanB3

  @IsOptional()
  @IsTembusanExist({ each: true })
  @IsUUID('4', { each: true })
  tembusanIds?: string[];  // Array of Tembusan IDs (can be set later)

  @IsOptional()
  @IsUUID()
  @IsPejabatNipExist()
  pejabatId?: string;  // Optional Pejabat ID

  @IsOptional()
  @IsUUID()
  @IsNotifikasiExists()
  notifikasiId?: string;  // Optional Notifikasi ID

  @IsOptional()
  @IsString()
  customPoint1?: string;  // Custom Point 1 for Surat content

  @IsOptional()
  @IsString()
  customPoint2?: string;  // Custom Point 2 for Surat content

  @IsOptional()
  @IsString()
  customPoint3?: string;  // Custom Point 3 for Surat content
}
