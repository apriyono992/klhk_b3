import { IsString, IsArray, IsOptional, IsNotEmpty, IsEnum, ValidateNested, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Status } from '@prisma/client';
import { CreateAttachmentDto } from './createAttachmentsDto';
import { Type } from 'class-transformer';

export class CreateInfoDto {
  @ApiProperty({
    example: 'Important Update',
    description: 'The title of the info post',
    maxLength: 64,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(64)
  title: string;

  @ApiProperty({
    example: 'This is an important update regarding...',
    description: 'The description of the info post',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    example: ['categoryId1', 'categoryId2'],
    description: 'An array of category IDs associated with the info post',
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
  @ValidateNested({ each: true })
  @Type(() => CreateAttachmentDto)
  attachments?: CreateAttachmentDto[];

  @ApiProperty({
    example: 'userId12345',
    description: 'The ID of the user who created the info post',
    maxLength: 64,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(64)
  createdById: string; // ID of the user who created the info

  @ApiPropertyOptional({
    example: Status.DRAFT,
    description: 'The status of the info post',
    enum: Status,
  })
  @IsOptional()
  @IsEnum(Status)
  status?: Status;

  @ApiProperty({
    example: 'John Doe',
    description: 'The author of the info post',
    maxLength: 64,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(64)
  author: string;
}
