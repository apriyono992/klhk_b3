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
import {PelaporanFilterDateDto} from "../models/dashboard/pelaporanFilterDate.dto";
import {DashboardPelaporanPengangkutanDto} from "../models/dashboard/dashboardPelaporanPengangkutan.dto";

@Controller("dashboard/pelaporan-pengangkutan")
@ApiTags('Dashboard Pelaporan')
export class DashboardPelaporanPengangkutanController {
    constructor(private readonly dashboardPengangkutan: DashboardPelaporanPengangkutanService) {}

    @Get('grafik')
    @ApiResponse({
        status: 200,
        description: 'List Grafik Data Pengangkutan'
    })
    public async realisasiDanPerencanaan(@Query() query: DashboardPelaporanPengangkutanDto) {
        const data = await this.dashboardPengangkutan.getPelaporanPengangkutanBahanB3(query);
        return data;
    }

    @Get("peta/perusahaan")
    @ApiResponse({
        status: 200,
        description: 'List Data Pengangkutan',
    })
    async petaSebaranPerusahaanPengangkutan() {
        const data = await this.dashboardPengangkutan.petaSebaranPerusahaanPengangkutan();
        return new SuccessRes("List Data Pengangkutan", data);
    }

    @Get("peta/perusahaan-pelaporan")
    @ApiResponse({
        status: 200,
        description: 'List Data Pengangkutan'
    })
    async petaPerusahaanTerbanyakMelakukanPengangkutan(@Query() query:PelaporanFilterDateDto) {
        const data = await this.dashboardPengangkutan.petaPerusahaanTerbanyakMelakukanPelaporan(query);
        return new SuccessRes("List Data Distribusi", data);
    }

    @Get("/peta/perusahaan-terbanyak")
    @ApiResponse({
        status: 200,
        description: 'list data Distribusi',
    })
    async petaPerusahaanTerbanyakPengangkutan(@Query()query:PelaporanFilterDateDto){
        const res = await this.dashboardPengangkutan.petaPerusahaanTerbanyakPengangkutan(query)
        return new SuccessRes("list data Distribusi",res)
    }

    @Get("peta/bahanb3-terbanyak")
    @ApiResponse({
        status: 200,
        description: 'List Data Pengangkutan'
    })
    async petaBahanB3TerbanyakPengangkutan(@Query() query:PelaporanFilterDateDto) {
        const data = await this.dashboardPengangkutan.petaBahanB3TerbanyakPengangkutan(query);
        return new SuccessRes("List Data Distribusi", data);
    }


    // @Get('peta/asal-muat')
    // @ApiResponse({
    //     status: 200,
    //     description: 'peta sebaran asal muat'
    // })
    // public async getMapTransportationAsalMuat(@Query() searchPengakutanAsalMuat: SearchPengakutanAsalMuat) {
    //     const data = await this.dashboardPengangkutan.findMapTransportationAsalMuat(searchPengakutanAsalMuat);
    //     return data;
    // }
    //
    // @Get('peta/tujuan-bongkar')
    // @ApiResponse({
    //     status: 200,
    //     description: 'peta sebaran tujuan bongkar'
    // })
    // public async getMapTransportationTujuanBongkar(@Query() searchPengakutanTujuanBongkar: SearchPengakutanTujuanBongkar) {
    //     const data = await this.dashboardPengangkutan.findMapTransportationTujuanBongkar(searchPengakutanTujuanBongkar);
    //     return data;
    // }


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
