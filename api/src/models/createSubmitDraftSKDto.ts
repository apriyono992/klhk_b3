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
  @IsNotEmpty()
  bulan: string; // Foreign key company ID

  @IsInt()
  @IsNotEmpty()
  tahun: number; // Nomor field

  @IsString()
  status_izin: string;

  @IsString()
  @IsNotEmpty()
  keterangan_sk: string; // Tahun field

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

  @IsArray()
  @ArrayNotEmpty() // Ensure array is not empty
  @IsUUID('all', { each: true }) // Validate that each item is a valid UUID
  tembusanIds: string[]; // Array of Tembusan IDs
}
