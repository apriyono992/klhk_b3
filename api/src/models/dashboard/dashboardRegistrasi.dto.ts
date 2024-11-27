import {ApiProperty} from "@nestjs/swagger";
import {IsNotEmpty, IsOptional, IsString} from "class-validator";
export class DashboardRegistrasiDto {
    @ApiProperty()
    @IsOptional()
    startDate: Date;

    @ApiProperty()
    @IsOptional()
    endDate:Date;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    type:String;
}