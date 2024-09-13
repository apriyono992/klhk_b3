import { IsOptional, IsString, IsEnum, IsDateString, IsArray, ArrayNotEmpty, ValidateNested } from 'class-validator';
import { PaginationDto } from './paginationDto';
import { CategoryType, Status } from '@prisma/client';
import { Transform, Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class SearchContentDto extends PaginationDto{
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  categoryId?: string;

  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value.split(',').map((name: string) => name.trim());
    }
    return value; // If it's already an array or something else, return it as is.
  }) 
  @IsArray()
  @IsString({ each: true })
  @ArrayNotEmpty()
  categoryName?: string[];

  @IsOptional()
  @IsEnum(Status)
  status?: Status = Status.PUBLISHED;

  @IsOptional()
  @IsEnum(CategoryType)
  type?: CategoryType;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;
}
