import {ApiProperty} from "@nestjs/swagger";
import {IsEnum, IsOptional} from "class-validator";
import {groupByPelaporanDistribusi} from "../enums/dashboardGet";
export class DashboardPelaporanDistribusiDto {
    @ApiProperty({ example: '01-11-2024' })
    @IsOptional()
    startDate: Date;

    @ApiProperty({ example: '12-30-2024' })
    @IsOptional()
    endDate: Date;

    @ApiProperty({
        enum: groupByPelaporanDistribusi,
        example: groupByPelaporanDistribusi.BAHAN_B3,
    })
    @IsEnum(groupByPelaporanDistribusi)
    @IsOptional()
    groupBy: groupByPelaporanDistribusi = groupByPelaporanDistribusi.BAHAN_B3;
}