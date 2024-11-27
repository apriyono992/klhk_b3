import {ApiResponse, ApiTags} from "@nestjs/swagger";
import {Controller, Get, Query} from "@nestjs/common";
import {SuccessRes} from "../utils/responseDto";
import {DashboardPermohonanService} from "../services/dashboard/dashboardPermohonan.service";
import {DashboardPermohonanGetAppStatusDto} from "../models/dashboard/dashboardPermohonanGetAppStatus.dto";

@ApiTags('dashboard-permohonan')
@Controller('dashboard/permohonan')
export class DashboardPermohonanController{
    constructor(
        private readonly dashboardPermohonanService: DashboardPermohonanService
    ) {
    }
    @Get("/status")
    @ApiResponse({
        status: 200,
        description: 'list data gudang penyimpanan',
    })
    async getApplicationStatusCounts(@Query() query:DashboardPermohonanGetAppStatusDto){
        const res = await this.dashboardPermohonanService.getApplicationStatusCounts(query)
        return new SuccessRes("list data status permohonan",res)
    }

    @Get("/jenis-surat")
    @ApiResponse({
        status: 200,
        description: 'list data gudang penyimpanan',
    })
    async getApplicationTipeSuratCounts(@Query() query:DashboardPermohonanGetAppStatusDto){
        const res = await this.dashboardPermohonanService.getApplicationTipeSuratCounts(query)
        return new SuccessRes("list data jenis surat permohonan",res)
    }

    @Get("/bahanb3")
    @ApiResponse({
        status: 200,
        description: 'list data gudang penyimpanan',
    })
    async getCount10B3Dashboard(@Query() query:DashboardPermohonanGetAppStatusDto){
        const res = await this.dashboardPermohonanService.getCount10B3Dashboard(query)
        return new SuccessRes("list data jenis surat permohonan",res)
    }

}