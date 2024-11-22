import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TipeDokumenPenyimpananB3 } from './enums/tipeDokumenPenyimpananB3';
import { IsCompanyExists } from 'src/validators/isCompanyExists.validator';
import { CreateAttachmentDto } from './createAttachmentsDto';

export class CreateDocumentPenyimpananDto {
  @ApiProperty({ enum: TipeDokumenPenyimpananB3, description: 'Type of the document being uploaded' })
  @IsEnum(TipeDokumenPenyimpananB3)
  documentType: TipeDokumenPenyimpananB3;

  @ApiProperty({ description: 'Company ID to associate the document' })
  @IsString()
  @IsNotEmpty()
  penyimpananId: string; // Foreign key for associating with the application

  @ApiProperty({
    description: 'An array of files to be uploaded as attachments',
    type: 'array',
    items: {
      type: 'string',
      format: 'binary',
    },
    required: true
  })
  @IsOptional()
  photos?: CreateAttachmentDto[];
}
