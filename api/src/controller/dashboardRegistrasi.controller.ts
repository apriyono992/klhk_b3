import {Controller, Get, Query} from "@nestjs/common";
import {ApiResponse, ApiTags} from "@nestjs/swagger";
import {SuccessRes} from "../utils/responseDto";
import {DashboardRegistrasiService} from "../services/dashboard/dashboardRegistrasi.service";
import {DashboardRegistrasiDto} from "../models/dashboard/dashboardRegistrasi.dto";

@ApiTags('dashboard-registrasi')
@Controller("dashboard/registrasi")
export class DashboardRegistrasiController {
    constructor(
        private readonly registrasiService: DashboardRegistrasiService
    ){}

    @Get("header")
    @ApiResponse({
        status: 200,
        description: 'list data gudang penyimpanan',
    })
    async getHeaderDashboard(@Query() query:DashboardRegistrasiDto){
        const res = await this.registrasiService.getDashboardRegistrasi(query)
        return new SuccessRes("list data jenis surat permohonan",res)
    }

    @Get("content-import")
    @ApiResponse({
        status: 200,
        description: 'list data content import',
    })
    async getContentDashboard(@Query() query:DashboardRegistrasiDto){
        const res = await this.registrasiService.getDashboardRegistrasiImportAdditionals(query)
        return new SuccessRes("list data jenis surat permohonan",res)
    }

}