import { IsOptional, IsString, IsDate, IsEnum, IsBoolean, IsUUID } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { JenisExplicitConsent } from './enums/jenisExplicitConsent';
import { IsNotifikasiExists } from 'src/validators/notifikasi.validator';

export class UpdateDraftSuratExplicitConsentDto {
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
  @ApiPropertyOptional({ description: 'Nama Exporter' })
  namaExporter?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'Tujuan Import' })
  tujuanImport?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'Reference Number Import' })
  referenceNumber?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'Negara Asal' })
  negaraAsal?: string;

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
  additionalInfo?: string;

  @IsOptional()
  @IsDate()
  @ApiPropertyOptional({ description: 'Validitas Surat' })
  validitasSurat?: Date;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'PDF Header ID' })
  pdfHeaderId?: string;

  @ApiPropertyOptional({
    example: JenisExplicitConsent.NON_ECHA,
    description: 'Jenis Explicit Consent',
    enum: JenisExplicitConsent,
  })
  @IsEnum(JenisExplicitConsent)
  jenisExplicitConsent?: JenisExplicitConsent;

  // ECHA specific fields
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'Name of Chemical (Substance)' })
  nameOfChemicalSubstance?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'CAS Number (Substance)' })
  casNumberSubstance?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'Name of Preparation' })
  nameOfPreparation?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'Name of Chemical in Preparation' })
  nameOfChemicalInPreparation?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'Concentration in Preparation' })
  concentrationInPreparation?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'CAS Number (Preparation)' })
  casNumberPreparation?: string;

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({ description: 'Consent to Import (Yes/No)' })
  consentToImport?: boolean;

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({ description: 'Pesticide Use (Yes/No)' })
  useCategoryPesticide?: boolean;

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({ description: 'Industrial Use (Yes/No)' })
  useCategoryIndustrial?: boolean;

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({ description: 'Consent for Other Preparations (Yes/No)' })
  consentForOtherPreparations?: boolean;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'Allowed Concentrations' })
  allowedConcentrations?: string;

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({ description: 'Consent for Pure Substance (Yes/No)' })
  consentForPureSubstance?: boolean;

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({ description: 'Restrictions or Conditions (Yes/No)' })
  hasRestrictions?: boolean;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'Restriction Details' })
  restrictionDetails?: string;

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({ description: 'Is Consent Time-Limited (Yes/No)' })
  isTimeLimited?: boolean;

  @IsOptional()
  @IsDate()
  @ApiPropertyOptional({ description: 'Time Limit Details' })
  timeLimitDetails?: Date;

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({ description: 'Same Treatment for Domestic and Imported Chemicals (Yes/No)' })
  sameTreatment?: boolean;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'Different Treatment Details' })
  differentTreatmentDetails?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'Other Relevant Information' })
  otherRelevantInformation?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'DNA Institution Name' })
  dnaInstitutionName?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'DNA Institution Address' })
  dnaInstitutionAddress?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'DNA Contact Name' })
  dnaContactName?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'DNA Telephone' })
  dnaTelephone?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'DNA Telefax' })
  dnaTelefax?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'DNA Email' })
  dnaEmail?: string;

  @IsOptional()
  @IsDate()
  @ApiPropertyOptional({ description: 'DNA Date' })
  dnaDate?: Date;

  @IsOptional()
  @IsUUID()
  @IsNotifikasiExists()
  notifikasiId?: string;  // Optional Notifikasi ID
}
