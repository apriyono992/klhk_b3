import { IsString, IsArray, IsOptional, IsNotEmpty, ValidateNested, IsEnum, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional, ApiHideProperty } from '@nestjs/swagger';
import { Status } from '@prisma/client';
import { CreateAttachmentDto } from './createAttachmentsDto';

export class CreateCompanyDocumentDto {
  @ApiProperty({
    example: 'Company Policies',
    description: 'The title of the document',
    maxLength: 64,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(64)
  title: string;

  @ApiPropertyOptional({
    example: 'This document outlines the company policies for the year 2024.',
    description: 'A brief description of the document',
    required: true
  })
  @IsOptional()
  @IsString()
  description?: string;

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
  attachments?: CreateAttachmentDto[];

  @ApiProperty({
    example: 'userId12345',
    description: 'The ID of the user who created the document',
    maxLength: 64,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(64)
  createdById: string;

  @ApiProperty({
    example: ['categoryId1', 'categoryId2'],
    description: 'An array of category IDs associated with the document',
    type: [String],
    required: true
  })
  @IsOptional()
  categories?: string[]; // Array of Category IDs

  @ApiPropertyOptional({
    example: Status.DRAFT,
    description: 'The status of the document',
    enum: Status,
  })
  @IsOptional()
  @IsEnum(Status)
  status?: Status;

  @ApiProperty({
    example: 'admin',
    description: 'The author of the document',
    maxLength: 64,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(64)
  author: string;
}
