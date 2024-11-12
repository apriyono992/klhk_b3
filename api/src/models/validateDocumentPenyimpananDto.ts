import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class ValidateDocumentPenyimpananDto {
  @ApiProperty({
    description: 'Penyimpanan B3 Persyaratan ID to validate',
    example: 'doc123',
  })
  @IsUUID()
  @IsNotEmpty()
  penyimpananB3PersyaratanId: string;

  @ApiProperty({
    description: 'Mark the document as valid or invalid',
    example: true,
  })
  @IsBoolean()
  @IsNotEmpty()
  isValid: boolean;

  @ApiProperty({
    description: 'Optional notes from the admin regarding validation',
    example: 'Document looks good',
  })
  @IsString()
  @IsOptional()
  validationNotes?: string;

  @ApiProperty({
    description: 'Optional user ID of the admin validating the document',
    example: 'admin123',
  })
  @IsOptional()
  @IsString()
  userId?: string;
}
