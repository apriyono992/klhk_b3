import { IsOptional, IsString, IsDateString, ValidateNested, ArrayNotEmpty, IsArray } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { PaginationDto } from './paginationDto';
import { ValidateStartDateBeforeEndDate } from '../validators/startDateEndDate.validator';

export class SearchEventDto extends PaginationDto {
  @ApiPropertyOptional({
    description: 'The title of the event',
    example: 'Annual Meeting',
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({
    description: 'The categories of the event, comma-separated',
    example: 'Conference,Workshop',
  })
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

  @ApiPropertyOptional({
    description: 'The start date of the event. Should be earlier than the end date.',
    example: '2024-09-01T00:00:00Z',
  })
  @IsOptional()
  @IsDateString()
  @ValidateStartDateBeforeEndDate('endDate', {
    message: 'Start date must be earlier than or equal to the end date',
  })
  startDate?: string;

  @ApiPropertyOptional({
    description: 'The end date of the event',
    example: '2024-09-02T00:00:00Z',
  })
  @IsOptional()
  @IsDateString()
  endDate?: string;
}
