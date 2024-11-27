import { Controller, Get, Query } from "@nestjs/common";
import { ApiResponse, ApiTags } from "@nestjs/swagger";
import { SuccessRes } from "src/utils/responseDto";
import {DashboardPelaporanPenyimpananService} from "../services/dashboard/dashboardPelaporanPenyimpanan.service";

@Controller("dashboard/pelaporan/penyimpanan")
@ApiTags('Dashboard Pelaporan')
export class DashboardPelaporanPenyimpananController {
    constructor(private readonly dashboardPenyimpanan: DashboardPelaporanPenyimpananService) {}

    @Get('region')
    @ApiResponse({
        status: 200,
        description: 'daftar data gudang berdasarkan region',
    })
    public async getStorageBasedOnRegion(@Query() query: any) {
        const data = await this.dashboardPenyimpanan.findStorageByRegion(query);
        return new SuccessRes('', data)
    }

    @Get('company')
    @ApiResponse({
        status: 200,
        description: 'daftar data gudang berdasarkan perusahaan',
    })
    public async getStorageBasedOnCompany(@Query() query: any) {
        const data = await this.dashboardPenyimpanan.findStorageByCompany(query);
        return new SuccessRes('', data)
    }
}
