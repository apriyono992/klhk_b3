import { Transform, Type } from 'class-transformer';
import { IsOptional, IsEnum, IsNumber, Min, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { SortOrder } from './enums/sort';

export class PaginationDto {
  @ApiPropertyOptional({
    description: 'Page number for pagination',
    example: 1,
    default: 1,
  })
  @IsOptional()
  @Type(() => Number)  // Ensures the type is transformed to number
  @IsNumber()
  @Min(1, { message: 'Page number must be greater than 0' })
  page?: number = 1; // Default to page 1

  @ApiPropertyOptional({
    description: 'Number of items per page',
    example: 10,
    default: 10,
  })
  @IsOptional()
  @Type(() => Number)  // Ensures the type is transformed to number
  @IsNumber()
  @Min(1, { message: 'Limit must be greater than 0' })
  limit?: number = 10; // Default to 10 items per page

  @ApiPropertyOptional({
    description: 'Sort order (asc or desc)',
    example: SortOrder.DESC,
    default: SortOrder.DESC,
    enum: SortOrder,
  })
  @IsOptional()
  @IsEnum(SortOrder, { message: 'sortOrder must be asc or desc' })
  sortOrder?: SortOrder = SortOrder.DESC; // Default to descending order

  @ApiPropertyOptional({
    description: 'Field to sort by',
    example: 'createdAt',
    default: 'createdAt',
  })
  @IsOptional()
  @IsString()
  sortBy?: string = 'createdAt'; // Default to sorting by 'createdAt'
}
