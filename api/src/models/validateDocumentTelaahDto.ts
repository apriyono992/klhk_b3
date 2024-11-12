import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { TipeDokumenTelaah } from './enums/tipeDokumenTelaah';

export class ValidateTelaahDocumentDto {
  @ApiProperty({ description: 'Telaah ID to validate' })
  @IsUUID()
  @IsNotEmpty()
  documenttelaahId: string;

  @ApiProperty({ description: 'Mark the document as valid or invalid' })
  @IsBoolean()
  @IsNotEmpty()
  isValid: boolean;

  @ApiProperty({ description: 'Optional notes from the admin regarding validation' })
  @IsString()
  @IsOptional()
  validationNotes?: string;
}