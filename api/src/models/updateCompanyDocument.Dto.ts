import {
  IsString,
  IsOptional,
  IsNotEmpty,
  IsEnum,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Status } from '@prisma/client';
import { CreateAttachmentDto } from './createAttachmentsDto';

export class UpdateCompanyDocumentDto {
  @ApiProperty({
    example: 'Document 1',
    description: 'The title of the document',
    maxLength: 64,
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(64)
  title?: string;

  @ApiProperty({
    example: 'This is the description of the document...',
    description: 'The description of the document',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  description?: string;

  @ApiProperty({
    example: ['categoryId1', 'categoryId2'],
    description: 'An array of category IDs associated with the document',
    type: [String],
    required: true,
  })
  @IsOptional()
  categories?: string[]; // Array of Category IDs

  @ApiProperty({
    description: 'An array of files to be uploaded as attachments',
    type: 'array',
    items: {
      type: 'string',
      format: 'binary',
    },
    required: true,
  })
  @IsOptional()
  attachments?: CreateAttachmentDto[];

  @ApiProperty({
    example: 'userId12345',
    description: 'The ID of the user who created the document',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  createdById?: string; // ID of the user who created the news

  @ApiPropertyOptional({
    example: Status.DRAFT,
    description: 'The status of the document',
    enum: Status,
  })
  @IsOptional()
  @IsEnum(Status)
  status?: Status;

  @ApiProperty({
    example: 'John Doe',
    description: 'The author of the document',
    maxLength: 64,
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(64)
  author?: string;
}
