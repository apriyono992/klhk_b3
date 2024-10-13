import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class ValidateDocumentDto {
  @ApiProperty({ description: 'Document ID to validate' })
  @IsUUID()
  @IsNotEmpty()
  documentId: string;

  @ApiProperty({ description: 'Mark the document as valid or invalid' })
  @IsBoolean()
  @IsNotEmpty()
  isValid: boolean;

  @ApiProperty({ description: 'Optional notes from the admin regarding validation' })
  @IsString()
  @IsOptional()
  validationNotes?: string;
}