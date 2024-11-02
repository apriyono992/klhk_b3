import { IsOptional, IsBoolean, IsString, IsArray, IsUUID } from 'class-validator';

export class TelaahTeknisUpsertDto {
  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  kronologi_permohonan?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  lain_lain?: string[];

  @IsOptional()
  @IsString()
  tindak_lanjut?: string;

  @IsOptional()
  @IsBoolean()
  printed?: boolean;

  @IsOptional()
  @IsUUID('4', { each: true })
  pejabat?: { id: string }[];  // Array of objects with pejabat IDs

  @IsOptional()
  @IsUUID()
  companyId?: string;  // Required only for creation, to associate with a company
}
