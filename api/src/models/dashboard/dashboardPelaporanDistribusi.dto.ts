import {ApiProperty} from "@nestjs/swagger";
import {IsOptional} from "class-validator";
export class DashboardPelaporanDistribusiDto {
    @ApiProperty()
    @IsOptional()
    startDate: Date;

    @ApiProperty()
    @IsOptional()
    endDate:Date;

    @ApiProperty()
    @IsOptional()
    groupBy:string;
}