import {ApiResponse, ApiTags} from "@nestjs/swagger";
import {Controller, Get, Query} from "@nestjs/common";
import {SuccessRes} from "../utils/responseDto";
import {DashboardPelaporanDistribusiDto} from "../models/dashboard/dashboardPelaporanDistribusi.dto";
import {DashboardPelaporanDistribusiService} from "../services/dashboard/dashboardPelaporanDistribusi.service";

@ApiTags('dashboard-pelaporan-distribusi')
@Controller('dashboard/pelaporan/distribusi')
export class DashboardPelaporanDistribusiController{
    constructor(
        private readonly dashboardPelaporanDistribusiService: DashboardPelaporanDistribusiService
    ){}

    @Get("/grafik")
    @ApiResponse({
        status: 200,
        description: 'list data Distribusi',
    })
    async realisasiDanPerencanaan(@Query() query:DashboardPelaporanDistribusiDto){
        const res = await this.dashboardPelaporanDistribusiService.getPelaporanBahanB3(query)
        return new SuccessRes("list data Distribusi",res)
    }
}