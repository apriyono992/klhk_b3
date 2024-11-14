import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsDate,
  IsOptional,
  IsNumber,
  IsArray,
  IsUUID,
} from 'class-validator';
import { Type } from 'class-transformer';

export class BahanB3RegistrasiDto {
  @ApiProperty({ description: 'Primary key ID' })
  @IsUUID()
  @IsOptional()
  id: string;

  @ApiProperty({
    description: 'Creation timestamp',
    example: '2024-11-05T10:30:00.000Z',
  })
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  createdAt?: Date;

  @ApiProperty({
    description: 'Last updated timestamp',
    example: '2024-11-05T10:30:00.000Z',
  })
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  updatedAt?: Date;

  @ApiProperty({
    description: 'Deleted timestamp',
    example: '2024-11-05T10:30:00.000Z',
    required: false,
  })
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  deletedAt?: Date;

  @ApiProperty({ description: 'Nomor registrasi bahan', example: 'REG-001' })
  @IsString()
  no_reg_bahan: string;

  @ApiProperty({ description: 'Nama bahan', example: 'Bahan Kimia A' })
  @IsString()
  nama_bahan: string;

  @ApiProperty({ description: 'Nama dagang', example: 'Dagangan Bahan A' })
  @IsString()
  nama_dagang: string;

  @ApiProperty({ description: 'CAS number', example: '123-45-6' })
  @IsString()
  cas_number: string;

  @ApiProperty({ description: 'HS code', example: '1234.56.78' })
  @IsString()
  hs_code: string;

  @ApiProperty({ description: 'Klasifikasi B3', example: 'B3 Kelas 1' })
  @IsString()
  klasifikasi_b3: string;

  @ApiProperty({ description: 'Karakteristik B3', example: 'Flammable' })
  @IsString()
  karakteristik_b3: string;

  @ApiProperty({ description: 'Negara Muat', example: 'Australia'})
  @IsString()
  negara_muat: string;

  @ApiProperty({ description: 'Penghasil Bahan Kimia', example: 'HANWHA SOLUTIONS CO., LTD'})
  @IsString()
  penghasil_bahan_kimia: string;

  @ApiProperty({ description: 'Penggunaan', example: 'MJKP'})
  @IsString()
  penggunaan: string;

  @ApiProperty({ description: 'Kategori B3', example: 'Flammable' })
  @IsString()
  kategori_b3: string;


  @ApiProperty({ description: 'Tujuan penggunaan', example: 'Industri' })
  @IsString()
  tujuan_penggunaan: string;

  @ApiProperty({ description: 'Jumlah impor', example: 100.5 })
  @IsNumber()
  jumlah_impor: number;

  @ApiProperty({ description: 'Jumlah impor per tahun', example: 500.75 })
  @IsNumber()
  jumlah_impor_per_tahun: number;

  @ApiProperty({ description: 'Pelaksanaan rencana impor', example: 10 })
  @IsNumber()
  pelaksanaan_rencana_impor: number;

  @ApiProperty({ description: 'Asal negara', example: 'Indonesia' })
  @IsString()
  asal_negara: string;

  @ApiProperty({
    description: 'Alamat penghasil B3',
    example: 'Jl. Industri No.1',
  })
  @IsString()
  alamat_penghasil_b3: string;

  @ApiProperty({
    description: 'ID registrasi terkait',
    example: 'reg-uuid-1234',
    required: false,
  })
  @IsUUID()
  @IsOptional()
  registrasiId?: string;

  @ApiProperty({
    description: 'Array pelabuhan asal',
    example: ['Pelabuhan Tanjung Priok', 'Pelabuhan Tanjung Perak'],
  })
  @IsArray()
  @IsString({ each: true })
  pelabuhan_asal: string[];

  @ApiProperty({
    description: 'Array pelabuhan muat',
    example: ['Pelabuhan Tanjung Emas', 'Pelabuhan Panjang'],
  })
  @IsArray()
  @IsString({ each: true })
  pelabuhan_muat: string[];

  @ApiProperty({
    description: 'Array pelabuhan bongkar',
    example: ['Pelabuhan Makassar', 'Pelabuhan Bitung'],
  })
  @IsArray()
  @IsString({ each: true })
  pelabuhan_bongkar: string[];

  @ApiProperty({
    description: 'Array provinsi pelabuhan bongkar',
    example: ['Sulawesi Selatan', 'Sulawesi Utara'],
  })
  @IsArray()
  @IsString({ each: true })
  provinsi_pelabuhan_bongkar: string[];

  @ApiProperty()
  @IsOptional()
  sektor_penggunaan_b3: SektorPenggunaanB3Dto[];
}

export class SektorPenggunaanB3Dto {
  @ApiProperty({ description: 'Nama sektor penggunaan', example: 'Pertanian' })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Keterangan sektor penggunaan',
    example: 'Penggunaan untuk pupuk',
  })
  @IsString()
  keterangan: string;
}
