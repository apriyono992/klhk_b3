import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsOptional, IsString, IsDateString, ValidateIf, ValidateNested, IsNotEmpty } from 'class-validator';
import { DateFilterDto } from './dateFilterDto';
import { Type } from 'class-transformer';

export class TrendReportDto {

    @ApiPropertyOptional({ description: 'Grouping period: day, week, month, year' })
    @IsOptional()
    @IsString()
    @IsIn(['day', 'week', 'month'], {
        message: 'Invalid period. Supported values are day, week, or month.',
    })
    period?: 'day' | 'week' | 'month' | 'year' = 'day'; // Default to 'day'
    
    @ApiProperty({ description: 'Start date for filtering (ISO 8601)', example: '2024-09-01T00:00:00Z' })
    @IsDateString({}, { message: 'Invalid start date format.' })
    startDate: string;
  
    @ApiProperty({ description: 'End date for filtering (ISO 8601)', example: '2024-09-02T00:00:00Z' })
    @IsDateString({}, { message: 'Invalid end date format.' })
    endDate: string;
  
}