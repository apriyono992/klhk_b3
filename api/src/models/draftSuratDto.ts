import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsDate, IsArray, IsUUID } from 'class-validator';
import { IsDraftExists } from 'src/validators/isDraftSuratExists.validator';

export class DraftSuratDto {
  @IsUUID()
  @IsDraftExists()
  @ApiProperty({ description: 'UUID of the draft', required: true })
  draftId?: string;
  
  @IsOptional()
  @IsUUID()
  @ApiProperty({ description: 'UUID of the pejabat', required: false })
  pejabatId?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'Kode DBKLH of the draft', required: false })
  kodeDBKlh?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'Nomor surat', required: false })
  nomorSurat?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'Tipe surat', required: true })
  tipeSurat?: string;

  @IsOptional()
  @IsDate()
  @ApiProperty({ description: 'Tanggal surat', required: false, type: 'string', format: 'date-time' })
  tanggalSurat?: Date;

  @IsOptional()
  @IsArray()
  @IsUUID(undefined, { each: true })
  @ApiProperty({ description: 'Array of tembusan UUIDs', required: false, type: [String] })
  tembusanIds?: string[];
}
