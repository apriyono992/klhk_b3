import { Controller, Get, Query } from "@nestjs/common";
import {ApiResponse, ApiTags} from "@nestjs/swagger";
import { SuccessRes } from "src/utils/responseDto";
import {DashboardPelaporanPenggunaanService} from "../services/dashboard/dashboardPelaporanPenggunaan.service";

@ApiTags('dashboard-pelaporan-penggunaan')
@Controller('dashboard/penggunaan')
export class DashboardPelaporanPenggunaanController {
    constructor(private readonly dashboardPenggunaanService: DashboardPelaporanPenggunaanService) {}

    @Get('company')
    @ApiResponse({
        status: 200,
        description: 'Data chart penggunaan berdasarkan perusahaan',
    })
    public async getSumByCompany(@Query() query) {
        const data = this.dashboardPenggunaanService.getSumByCompany(query)
        
        return new SuccessRes('Success', data)
    }

    @Get('substance')
    @ApiResponse({
        status: 200,
        description: 'Data chart penggunaan berdasarkan bahan kimia',
    })
    public async getSumBySubstance(@Query() query) {
        const data = this.dashboardPenggunaanService.getSumBySubstance(query)

        return new SuccessRes('Success', data)
    }
}