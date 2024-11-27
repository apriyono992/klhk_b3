import {ApiProperty} from "@nestjs/swagger";
import {IsOptional} from "class-validator";
export class DashboardPermohonanGetAppStatusDto {
    @ApiProperty({example:'01-11-2024'})
    @IsOptional()
    startDate: Date;
    @ApiProperty({example:'12-30-2024'})
    @IsOptional()
    endDate:Date;
}