import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TipeDokumen } from './enums/TipeDokumen';
import { IsApplicationExists } from 'src/validators/isApplicationIdExists.validatior';

export class CreateDocumentDto {
  @ApiProperty({ enum: TipeDokumen, description: 'Type of the document being uploaded' })
  @IsEnum(TipeDokumen)
  documentType: TipeDokumen;

  @ApiProperty({ description: 'Application ID to associate the document' })
  @IsString()
  @IsNotEmpty()
  @IsApplicationExists()
  applicationId: string; // Foreign key for associating with the application
}
