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

export class SaveRegistrasiDto {
  @IsOptional()
  id: string;

  @IsNotEmpty()
  companyId: string; // Foreign key company ID

  @IsString()
  @IsOptional()
  nomor: string; // Nomor field

  @IsInt()
  @IsOptional()
  tahun: number; // Tahun field

  @IsString()
  @IsOptional()
  status_izin: string; // Status izin

  @IsString()
  @IsOptional()
  keterangan_sk: string; // Keterangan SK

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  tanggal_terbit: Date; // Tanggal terbit

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  berlaku_dari: Date; // Berlaku dari

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  berlaku_sampai: Date; // Berlaku sampai

  @IsString()
  @IsOptional()
  nomor_notifikasi_impor: string; // Nomor notifikasi impor

  @IsString()
  @IsOptional()
  kode_db_klh_perusahaan: string; // Kode DB KLH perusahaan

  @IsString()
  @IsOptional()
  nama_perusahaan: string; // Nama perusahaan

  @IsString()
  @IsOptional()
  alamat_perusahaan: string; // Alamat perusahaan

  @IsString()
  @IsOptional()
  status: string; // Status field

  @IsBoolean()
  @IsOptional()
  is_draft: boolean; // is_draft field

  @IsBoolean()
  @IsOptional()
  no_reg_bahanb3: string;

  @IsArray()
  @ArrayNotEmpty() // Ensure array is not empty
  @IsUUID('all', { each: true }) // Validate that each item is a valid UUID
  tembusanIds: string[]; // Array of Tembusan IDs

  @IsArray()
  @ArrayNotEmpty() // Ensure array is not empty
  BahanB3RegIds: string[]; // Array of Bahan B3 IDs

  @IsArray()
  @ArrayNotEmpty()
  @IsUUID('all', { each: true })
  registrasiPersyaratanIds: string[];
}
