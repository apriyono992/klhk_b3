import { Controller, Get, Query } from "@nestjs/common";
import {ApiResponse, ApiTags} from "@nestjs/swagger";
import { SuccessRes } from "src/utils/responseDto";
import {DashboardPelaporanPenggunaanService} from "../services/dashboard/dashboardPelaporanPenggunaan.service";
import { query } from "express";

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
        const data = await this.dashboardPenggunaanService.getSumByCompany(query);

        return new SuccessRes('Success', data);
    }

    @Get('substance')
    @ApiResponse({
        status: 200,
        description: 'Data chart penggunaan berdasarkan bahan kimia',
    })
    public async getSumBySubstance(@Query() query) {
        const data = await this.dashboardPenggunaanService.getSumBySubstance(query);

        return new SuccessRes('Success', data);
    }

    @Get('company/map')
    public async getTopSpendingCompany(@Query() query) {
        const data = await this.dashboardPenggunaanService.getTopSpendingCompany(query);

        return new SuccessRes('Success', data);
    }

    @Get('company/map/usage')
    public async getCompanyMapUsage(@Query() query) {
        const data = await this.dashboardPenggunaanService.getCompanyUsage(query);

        return new SuccessRes('Success', data);
    }
    @Get('company/map/report')
    public async getCompanyMapReport(@Query() query) {
        const data = await this.dashboardPenggunaanService.getMapCompanyReport(query);

        return new SuccessRes('Success', data);
    }

    @Get('company/map/local-buy')
    public async getCompanyMapLocalBuy(@Query() query) {
        const data = await this.dashboardPenggunaanService.getCompanyMapLocalBuy(query);

        return new SuccessRes('Success', data);
    }

    @Get('substance/map/usage')
    public async getSubstanceUsageMap(@Query() query) {
        const data = await this.dashboardPenggunaanService.getSubstanceUsage(query);

        return new SuccessRes('Success', data);
    }
}