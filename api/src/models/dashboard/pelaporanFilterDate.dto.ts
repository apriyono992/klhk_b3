import {ApiProperty, ApiPropertyOptional} from "@nestjs/swagger";
import {IsOptional} from "class-validator";
export class PelaporanFilterDateDto {
    @ApiPropertyOptional({example:'01-11-2024'})
    @IsOptional()
    startDate: string;
    @ApiPropertyOptional({example:'12-30-2024'})
    @IsOptional()
    endDate:string;
}