import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TipeDokumenPenyimpananB3 } from './enums/tipeDokumenPenyimpananB3';
import { IsCompanyExists } from 'src/validators/isCompanyExists.validator';

export class CreateDocumentPenyimpananDto {
  @ApiProperty({ enum: TipeDokumenPenyimpananB3, description: 'Type of the document being uploaded' })
  @IsEnum(TipeDokumenPenyimpananB3)
  documentType: TipeDokumenPenyimpananB3;

  @ApiProperty({ description: 'Company ID to associate the document' })
  @IsString()
  @IsNotEmpty()
  penyimpananId: string; // Foreign key for associating with the application
}
