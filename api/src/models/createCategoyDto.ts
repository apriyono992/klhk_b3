import { IsString, IsNotEmpty, IsEnum, IsOptional, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CategoryType, Status } from '@prisma/client';

export class CreateCategoryDto {
  @ApiProperty({
    example: 'Technology',
    description: 'The name of the category',
    maxLength: 64,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(64)
  name: string;

  @ApiProperty({
    example: CategoryType.ARTICLE,
    description: 'The type of the category',
    enum: CategoryType,
    required: true
  })
  @IsString()
  @IsNotEmpty()
  @IsEnum(CategoryType)
  type: CategoryType;

  @ApiPropertyOptional({
    example: 'technology',
    description: 'The slug of the category. If not provided, it will be generated.',
    required: true
  })
  @IsString()
  @IsOptional()
  slug?: string;

  @ApiPropertyOptional({
    example: Status.PUBLISHED,
    description: 'The status of the category',
    enum: Status,
  })
  @IsOptional()
  @IsEnum(Status)
  status?: Status;

  @ApiProperty({
    example: 'admin',
    description: 'The author of the category',
    maxLength: 64,
    required: true
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(64)
  author: string;
}
