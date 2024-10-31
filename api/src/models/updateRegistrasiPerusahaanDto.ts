import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class UpdateRegistrasiPerusahaanDto {
  @ApiProperty()
  @IsOptional()
  nama_perusahaan: string;

  @ApiProperty()
  @IsOptional()
  alamat_perusahaan: string;
}
