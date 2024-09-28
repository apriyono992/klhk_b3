import { IsOptional, IsString, IsEnum, IsDateString, IsArray, ArrayNotEmpty, ValidateNested } from 'class-validator';
import { PaginationDto } from './paginationDto';
import { CategoryType, Status } from '@prisma/client';
import { Transform, Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { ValidateEndDate, ValidateStartDate } from 'src/validators/startDateEndDate.validator';

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

  @ApiPropertyOptional({
    description: 'The start date of the event. Should be earlier than the end date.',
    example: '2024-09-01T00:00:00Z',
  })
  @IsOptional()
  @IsDateString()
  @ValidateStartDate('endDate')
  startDate?: string;

  @ApiPropertyOptional({
    description: 'The end date of the event',
    example: '2024-09-02T00:00:00Z',
  })
  @IsOptional()
  @IsDateString() 
  @ValidateEndDate('startDate')
  endDate?: string;
}
