import { IsString, IsOptional, IsEmail } from 'class-validator';

export class CreateDataPICDto {
  @IsOptional()
  @IsString()
  namaPIC?: string;

  @IsOptional()
  @IsString()
  jabatan?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  telepon?: string;

  @IsOptional()
  @IsString()
  fax?: string;
}
