import {ApiPropertyOptional} from "@nestjs/swagger";
import {IsOptional} from "class-validator";
import {PaginationDto} from "../paginationDto";

export class PelaporanFilterSearchDto extends PaginationDto{
    @ApiPropertyOptional({example:'01-11-2024'})
    @IsOptional()
    startDate: string;
    @ApiPropertyOptional({example:'12-30-2024'})
    @IsOptional()
    endDate:string;
    @ApiPropertyOptional()
    @IsOptional()
    keyword:string;

}