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

export class CreateRegistrasiDto {
  @IsOptional()
  id: string;

  @IsNotEmpty()
  companyId: string; // Foreign key company ID

  @IsString()
  @IsNotEmpty()
  nomor: string; // Nomor field

  @IsString()
  bulan: string;

  @IsInt()
  @IsNotEmpty()
  tahun: number; // Tahun field

  @IsString()
  @IsNotEmpty()
  status_izin: string; // Status izin

  @IsString()
  @IsNotEmpty()
  keterangan_sk: string; // Keterangan SK

  @IsDate()
  @IsNotEmpty()
  @Type(() => Date)
  tanggal_terbit: Date; // Tanggal terbit

  @IsDate()
  @IsNotEmpty()
  @Type(() => Date)
  berlaku_dari: Date; // Berlaku dari

  @IsDate()
  @IsNotEmpty()
  @Type(() => Date)
  berlaku_sampai: Date; // Berlaku sampai

  @IsString()
  @IsNotEmpty()
  nomor_notifikasi_impor: string; // Nomor notifikasi impor

  @IsString()
  @IsNotEmpty()
  kode_db_klh_perusahaan: string; // Kode DB KLH perusahaan

  @IsString()
  @IsNotEmpty()
  nama_perusahaan: string; // Nama perusahaan

  @IsString()
  @IsNotEmpty()
  alamat_perusahaan: string; // Alamat perusahaan

  @IsString()
  @IsNotEmpty()
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

  @IsNotEmpty()
  BahanB3Reg: BahanB3RegistrasiDto;

  @IsArray()
  @ArrayNotEmpty()
  @IsUUID('all', { each: true })
  registrasiPersyaratanIds: string[];
}
