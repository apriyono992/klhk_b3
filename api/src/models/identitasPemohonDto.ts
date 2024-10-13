import { IsString, IsEmail, IsNotEmpty, IsEnum, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TipeSurat } from './enums/tipeSurat';
import { IsCompanyExists } from 'src/validators/isCompanyExists.validator';

export class CreateIdentitasPemohonDto {
  @ApiProperty({ description: 'Name of the applicant' })
  @IsString()
  @IsNotEmpty()
  namaPemohon: string;

  @ApiProperty({ description: 'Position of the applicant' })
  @IsString()
  @IsNotEmpty()
  jabatan: string;

  @ApiProperty({ description: 'Address of the applicant' })
  @IsString()
  @IsNotEmpty()
  alamatDomisili: string;

  @ApiProperty({ description: 'Phone number and fax' })
  @IsString()
  @IsNotEmpty()
  teleponFax: string;

  @ApiProperty({ description: 'Email address of the applicant' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: 'NPWP of the applicant' })
  @IsString()
  @IsNotEmpty()
  npwp: string;

  @ApiProperty({ description: 'KTP of the applicant' })
  @IsString()
  @IsNotEmpty()
  ktp: string;

  @ApiProperty({ description: 'Type of the surat', enum: TipeSurat })
  @IsEnum(TipeSurat)
  @IsNotEmpty()
  tipeSurat: TipeSurat;

  @ApiProperty({ description: 'Company ID of the applicant' })
  @IsUUID()
  @IsNotEmpty()
  @IsCompanyExists()
  companyId: string;
}
