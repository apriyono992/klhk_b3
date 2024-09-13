import { IsString, IsArray, IsOptional, IsNotEmpty, IsEnum, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Status } from '@prisma/client';
import { CreateAttachmentDto } from './createAttachmentsDto';

export class CreateArticleDto {
  @ApiProperty({
    example: 'The Rise of AI',
    description: 'The title of the article',
    maxLength: 64,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(64)
  title: string;

  @ApiProperty({
    example: 'This article discusses the rapid growth of AI technology...',
    description: 'The content of the article',
  })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({
    example: 'John Doe',
    description: 'The author of the article',
    maxLength: 64,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(64)
  author: string;

  @ApiProperty({
    example: ['categoryId1', 'categoryId2'],
    description: 'An array of category IDs to which the article belongs',
    type: [String],
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
    required: true
  })
  @IsOptional()
  attachments?: CreateAttachmentDto[];


  @ApiProperty({
    example: 'userId12345',
    description: 'The ID of the user who created the article',
    maxLength: 64,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(64)
  createdById: string; // ID of the user who created the article

  @ApiPropertyOptional({
    example: Status.DRAFT,
    description: 'The status of the article',
    enum: Status,
  })
  @IsOptional()
  @IsEnum(Status)
  status?: Status;
}
