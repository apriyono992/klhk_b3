import {ApiResponse, ApiTags} from "@nestjs/swagger";
import {Controller, Get, Query} from "@nestjs/common";
import {DashboardPelaporanRegistrasiService} from "../services/dashboard/dashboardPelaporanImport.services";
import {DashboardPermohonanGetAppStatusDto} from "../models/dashboard/dashboardPermohonanGetAppStatus.dto";
import {SuccessRes} from "../utils/responseDto";

@ApiTags('dashboard-pelaporan-import')
@Controller('dashboard/pelaporan/import')
export class DashboardPelaporanImportController {
    constructor(
       private readonly dashboardPelaporanRegistrasiService: DashboardPelaporanRegistrasiService
    ){}

    @Get("/perbandingan")
    @ApiResponse({
        status: 200,
        description: 'list data gudang penyimpanan',
    })
    async realisasiDanPerencanaan(@Query() query:DashboardPermohonanGetAppStatusDto){
        const res = await this.dashboardPelaporanRegistrasiService.realisasiDanPerencanaan(query)
        return new SuccessRes("list data status permohonan",res)
    }

    @Get("/jenis-bahanb3")
    @ApiResponse({
        status: 200,
        description: 'list data gudang penyimpanan',
    })
    async jenisBahanB3TerbanyakImport(@Query() query:DashboardPermohonanGetAppStatusDto){
        const res = await this.dashboardPelaporanRegistrasiService.jenisBahanB3TerbanyakImport(query)
        return new SuccessRes("list data status permohonan",res)
    }
}