import { Controller, Get, Query } from "@nestjs/common";
import { ApiResponse, ApiTags } from "@nestjs/swagger";
import { SuccessRes } from "src/utils/responseDto";
import {DashboardPelaporanPenyimpananService} from "../services/dashboard/dashboardPelaporanPenyimpanan.service";
import {DashboardPelaporanPengangkutanService} from "../services/dashboard/dashboardPelaporanPengangkutan.service";
import {SearchRegistrasiDto} from "../models/searchRegistrasiDto";
import {SearchPengakutanAsalMuat} from "../models/searchPengakutanAsalMuat";
import {SearchPengakutanTujuanBongkar} from "../models/searchPengakutanTujuanBongkar";
import {DashboardPelaporanDistribusiDto} from "../models/dashboard/dashboardPelaporanDistribusi.dto";
import {PelaporanFilterSearchDto} from "../models/dashboard/pelaporanFilterSearch.dto";

@Controller("dashboard/pelaporan-pengangkutan")
@ApiTags('Dashboard Pelaporan')
export class DashboardPelaporanPengangkutanController {
    constructor(private readonly dashboardPengangkutan: DashboardPelaporanPengangkutanService) {}


    @Get('peta/asal-muat')
    @ApiResponse({
        status: 200,
        description: 'peta sebaran asal muat'
    })
    public async getMapTransportationAsalMuat(@Query() searchPengakutanAsalMuat: SearchPengakutanAsalMuat) {
        const data = await this.dashboardPengangkutan.findMapTransportationAsalMuat(searchPengakutanAsalMuat);
        return data;
    }

    @Get('peta/tujuan-bongkar')
    @ApiResponse({
        status: 200,
        description: 'peta sebaran tujuan bongkar'
    })
    public async getMapTransportationTujuanBongkar(@Query() searchPengakutanTujuanBongkar: SearchPengakutanTujuanBongkar) {
        const data = await this.dashboardPengangkutan.findMapTransportationTujuanBongkar(searchPengakutanTujuanBongkar);
        return data;
    }

    // @Get('grafik/pengangkutan-terbanyak')
    // @ApiResponse({
    //     status: 200,
    //     description: 'Besaran B3 Pengangkutan Terbanyak'
    // })
    // public async getBesaranB3PengangkutanTerbanyak(@Query() query: PelaporanFilterSearchDto) {
    //     const data = await this.dashboardPengangkutan.findB3PengangkutanTerbanyak(query);
    //     return data;
    // }

    @Get('grafik/b3-berdasarkan-perusahaan')
    @ApiResponse({
        status: 200,
        description: 'Besaran B3 Pengangkutan Terbanyak'
    })
    public async getBesaranB3BerdasarkanPerusahaan() {
        const data = await this.dashboardPengangkutan.findB3BerdasarkanPerusahaan();
        return data;
    }

    @Get('pencarian/bahanb3')
    @ApiResponse({
        status: 200,
        description: 'Besaran B3 Pengangkutan Terbanyak'
    })
    public async pencarianBesaranB3Terbanyak(@Query() query: PelaporanFilterSearchDto) {
        const data = await this.dashboardPengangkutan.pencarianBesaranB3Terbanyak(query);
        return data;
    }

    @Get('pencarian/perusahaan')
    @ApiResponse({
        status: 200,
        description: 'Besaran B3 Pengangkutan Terbanyak'
    })
    public async pencarianBesaranPerusahaanTerbanyak(@Query() query: PelaporanFilterSearchDto) {
        const data = await this.dashboardPengangkutan.pencarianPengangkutanTerbanyak(query);
        return data;
    }

}
