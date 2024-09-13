import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsDateString, IsOptional, ValidateIf } from "class-validator";

export class DateFilterDto {
    
    @ApiPropertyOptional({
        description: 'Start date for filtering (ISO 8601)',
        example: '2024-09-01T00:00:00Z',
    })
    @IsOptional()
    @IsDateString({}, { message: 'Invalid start date format.' })
    startDate?: string;

    @ApiPropertyOptional({
        description: 'End date for filtering (ISO 8601)',
        example: '2024-09-02T00:00:00Z',
    })
    @IsOptional()
    @IsDateString({}, { message: 'Invalid end date format.' })
    endDate?: string;

    // Custom validation: startDate cannot be later than endDate
    @ValidateIf((o) => o.startDate && o.endDate)
    validateDates() {
        if (new Date(this.startDate) > new Date(this.endDate)) {
            throw new Error('Start date cannot be later than end date');
        }
    }
}
