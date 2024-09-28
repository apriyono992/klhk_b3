import { IsString, IsArray, IsOptional, IsNotEmpty, IsEnum, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional, ApiHideProperty } from '@nestjs/swagger';
import { Status } from '@prisma/client';
import { Type } from 'class-transformer';
import { CreateAttachmentDto } from './createAttachmentsDto';

export class CreateNewsDto {
  @ApiProperty({
    example: 'Breaking News',
    description: 'The title of the news article',
    maxLength: 64,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(64)
  title: string;

  @ApiProperty({
    example: 'This is the content of the news article...',
    description: 'The content of the news article',
  })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({
    example: ['categoryId1', 'categoryId2'],
    description: 'An array of category IDs associated with the news article',
    type: [String],
    required: true
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
    description: 'The ID of the user who created the news article',
  })
  @IsString()
  @IsNotEmpty()
  createdById: string; // ID of the user who created the news

  @ApiPropertyOptional({
    example: Status.DRAFT,
    description: 'The status of the news article',
    enum: Status,
  })
  @IsOptional()
  @IsEnum(Status)
  status?: Status;

  @ApiProperty({
    example: 'John Doe',
    description: 'The author of the news article',
    maxLength: 64,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(64)
  author: string;
}
