import {
  IsUUID,
  IsNotEmpty,
  IsDate,
  IsString,
  IsInt,
  IsArray,
  ArrayNotEmpty,
  IsOptional,
  IsBoolean,
} from 'class-validator';
import { Type } from 'class-transformer';
import { BahanB3RegistrasiDto } from './createUpdateBahanB3regDTO';

export class CreateSubmitDraftSKDto {
  @IsOptional()
  bulan: string; // Foreign key company ID

  @IsOptional()
  tahun: number; // Nomor field

  @IsOptional()
  @IsString()
  status_izin: string;

  @IsString()
  @IsOptional()
  keterangan_sk: string; // Tahun field

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  tanggal_terbit: Date; // Tanggal terbit

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  berlaku_dari: Date; // Berlaku dari wajib

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  berlaku_sampai: Date; // Berlaku sampai

  @IsString()
  @IsOptional()
  nomor_notifikasi_impor: string; // Nomor notifikasi impor

  @IsOptional()
  @IsString()
  pejabat_id: string;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  tanggal_surat: Date; // Berlaku sampai

  @IsString()
  @IsOptional()
  nomor_surat: string; // Berlaku sampai

  @IsOptional()
  @IsArray()
  @ArrayNotEmpty() // Ensure array is not empty
  @IsUUID('all', { each: true }) // Validate that each item is a valid UUID
  tembusanIds: string[]; // Array of Tembusan IDs
}
