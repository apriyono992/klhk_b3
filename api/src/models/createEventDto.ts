import {
  IsString,
  IsArray,
  IsOptional,
  IsNotEmpty,
  IsEnum,
  IsLatitude,
  IsLongitude,
  ValidateNested,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Status } from '@prisma/client';
import { CreateAttachmentDto } from './createAttachmentsDto';
import { Type } from 'class-transformer';

export class CreateEventDto {
  @ApiProperty({
    example: 'Annual Company Meeting',
    description: 'The title of the event',
    maxLength: 64,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(64)
  title: string;

  @ApiProperty({
    example: 'This is the annual meeting of the company to discuss...',
    description: 'The description of the event',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    example: '2024-09-01T09:00:00Z',
    description: 'The start date and time of the event',
  })
  @IsString()
  @IsNotEmpty()
  startDate: string;

  @ApiProperty({
    example: '2024-09-01T17:00:00Z',
    description: 'The end date and time of the event',
  })
  @IsString()
  @IsNotEmpty()
  endDate: string;

  @ApiProperty({
    example: 40.73061,
    description: 'The latitude of the event location',
    required: true,
  })
  @IsLatitude()
  latitude: number;

  @ApiProperty({
    example: -73.935242,
    description: 'The longitude of the event location',
    required: true,
  })
  @IsLongitude()
  longitude: number;

  @ApiProperty({
    example: ['categoryId1', 'categoryId2'],
    description: 'An array of category IDs associated with the event',
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
  documents?: CreateAttachmentDto[];

  @ApiProperty({
    description: 'An array of photos to be uploaded as attachments',
    type: 'array',
    items: {
      type: 'string',
      format: 'binary',
    },
    required: true,
  })
  @IsOptional()
  photos?: CreateAttachmentDto[];

  @ApiProperty({
    example: 'userId12345',
    description: 'The ID of the user who created the event',
    maxLength: 64,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(64)
  createdById: string;

  @ApiPropertyOptional({
    example: Status.DRAFT,
    description: 'The status of the event',
    enum: Status,
  })
  @IsOptional()
  @IsEnum(Status)
  status?: Status;

  @ApiProperty({
    example: 'John Doe',
    description: 'The author of the event',
    maxLength: 64,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(64)
  author: string;

  @ApiProperty({
    example: 'Kota',
    description: 'The city of the event',
    maxLength: 64,
  })
  @IsString()
  @IsOptional()
  @MaxLength(64)
  city?: string;

  @ApiProperty({
    example: 'Provinsi',
    description: 'The province of the event',
    maxLength: 64,
  })
  @IsString()
  @IsOptional()
  @MaxLength(64)
  province?: string;
}
