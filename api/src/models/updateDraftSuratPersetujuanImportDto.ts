import { IsOptional, IsString, IsDate, IsUUID, IsArray } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { TipeSuratNotifikasi } from './enums/tipeSuratNotifikasi';  // Import the enum
import { IsDataBahanB3Exist } from 'src/validators/dataBahanB3.validator';
import { IsPejabatIdExists } from 'src/validators/dataPejabat.validator';
import { IsNotifikasiExists } from 'src/validators/notifikasi.validator';
import { IsTembusanExist } from 'src/validators/dataTembusan.validator';
import { Type } from 'class-transformer';

export class UpdateDraftSuratPersetujuanImportDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'Nomor Surat' })
  nomorSurat?: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  @ApiPropertyOptional({ description: 'Tanggal Surat' })
  tanggalSurat?: Date;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: 'Tipe Surat',
    enum: TipeSuratNotifikasi,
    example: 'Explicit Consent and Persetujuan ECHA',
  })
  tipeSurat?: TipeSuratNotifikasi;

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
  @Type(() => Date)
  @IsDate()
  @ApiPropertyOptional({ description: 'Tanggal Pengiriman' })
  tanggalPengiriman?: Date;

  @IsOptional()
  @IsUUID()
  @IsDataBahanB3Exist()
  @ApiPropertyOptional({ description: 'Foreign key for Data Bahan B3' })
  dataBahanB3Id?: string;

  @IsOptional()
  @IsUUID()
  @IsPejabatIdExists()
  @ApiPropertyOptional({ description: 'Foreign key for Pejabat' })
  pejabatId?: string;

  @IsOptional()
  @IsUUID()
  @IsNotifikasiExists()
  @ApiPropertyOptional({ description: 'Foreign key for Notifikasi' })
  notifikasiId?: string;

  @IsOptional()
  @IsArray()
  @IsTembusanExist({ each: true })
  @ApiPropertyOptional({ description: 'Tembusan Ids (Many-to-Many relation)', type: [String] })
  tembusanIds?: string[];

  // Custom points specific to Persetujuan Import
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
  @ApiPropertyOptional({ description: 'ECHA Specific Data' })
  echaSpecificData?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'Reference Number' })
  referenceNumber?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'Negara Asal' })
  negaraAsal?: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  @ApiPropertyOptional({ description: 'Validitas Surat' })
  validitasSurat?: Date;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'Regulation for Import' })
  regulation?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'nomorSuratKebenaranImport for Import' })
  nomorSuratKebenaranImport?: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  @ApiPropertyOptional({ description: 'tanggalSuratKebenaranImport for Import' })
  tanggalSuratKebenaranImport?: Date;
  
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'nomorSuratPerusahaanPengimpor for Import' })
  nomorSuratPerusahaanPengimpor?: string;
    
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  @ApiPropertyOptional({ description: 'tanggalDiterimaKebenaranImport for Import' })
  tanggalDiterimaKebenaranImport?: Date;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'nomorSuratExplicitConsent for Import' })
  nomorSuratExplicitConsent?: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  @ApiPropertyOptional({ description: 'tanggalSuratExplicitConsent for Import' })
  tanggalSuratExplicitConsent?: Date;
}
