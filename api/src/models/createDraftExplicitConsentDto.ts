import { IsOptional, IsString, IsDate, IsEnum, IsUUID } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { TipeSuratNotifikasi } from './enums/tipeSuratNotifikasi';
import { IsNotifikasiExists } from 'src/validators/notifikasi.validator';

export class CreateDraftSuratExplicitConsentDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'Nomor Surat' })
  nomorSurat?: string;

  @IsOptional()
  @IsDate()
  @ApiPropertyOptional({ description: 'Tanggal Surat' })
  tanggalSurat?: Date;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'Kode DBKLH' })
  kodeDBKlh?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'Sifat Surat' })
  sifatSurat?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'Email Penerima' })
  emailPenerima?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'Reference Number' })
  referenceNumber?: string; // New

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'Negara Asal' })
  negaraAsal?: string; // New

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'Nama Exporter' })
  namaExporter?: string; // New

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'Tujuan Import' })
  tujuanImport?: string; // New

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'Custom Point 1' })
  customPoint1?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'Custom Point 2' })
  customPoint2?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'Custom Point 3' })
  customPoint3?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'Custom Point 4' })
  customPoint4?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'Header Information' })
  additionalInfo?: string; // New customizable for 

  @IsOptional()
  @IsDate()
  @ApiPropertyOptional({ description: 'Validitas Surat' })
  validitasSurat?: Date;

  @ApiPropertyOptional({
    example: TipeSuratNotifikasi.EXPLICIT_CONSENT_AND_PERSETUJUAN_ECHA,
    description: 'Jenis Explicit Consent',
    enum: TipeSuratNotifikasi,
  })
  @IsEnum(TipeSuratNotifikasi)
  tipeSuratNotifikasi?: TipeSuratNotifikasi;

  @IsOptional()
  @IsUUID()
  @IsNotifikasiExists()
  notifikasiId?: string;  // Optional Notifikasi ID
}
