import {ApiResponse, ApiTags} from "@nestjs/swagger";
import {Controller, Get, Query} from "@nestjs/common";
import {SuccessRes} from "../utils/responseDto";
import {DashboardPelaporanDistribusiDto} from "../models/dashboard/dashboardPelaporanDistribusi.dto";
import {DashboardPelaporanDistribusiService} from "../services/dashboard/dashboardPelaporanDistribusi.service";
import {PelaporanFilterDateDto} from "../models/dashboard/pelaporanFilterDate.dto";
import {PelaporanFilterSearchDto} from "../models/dashboard/pelaporanFilterSearch.dto";

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

    @Get("/peta/perusahaan")
    @ApiResponse({
        status: 200,
        description: 'list data Distribusi',
    })
    async petaSebaranPerusahaanDistribusi(){
        const res = await this.dashboardPelaporanDistribusiService.petaSebaranPerusahaanDistribusi()
        return new SuccessRes("list data Distribusi",res)
    }

    @Get("/peta/perusahaan-pelaporan")
    @ApiResponse({
        status: 200,
        description: 'list data Distribusi',
    })
    async petaPerusahaanTerbanyakMelakukanPelaporan(@Query()query:PelaporanFilterDateDto){
        const res = await this.dashboardPelaporanDistribusiService.petaPerusahaanTerbanyakMelakukanPelaporan(query)
        return new SuccessRes("list data Distribusi",res)
    }

    @Get("/peta/perusahaan-terbanyak")
    @ApiResponse({
        status: 200,
        description: 'list data Distribusi',
    })
    async petaPerusahaanTerbanyakDistribusi(@Query()query:PelaporanFilterDateDto){
        const res = await this.dashboardPelaporanDistribusiService.petaPerusahaanTerbanyakDistribusi(query)
        return new SuccessRes("list data Distribusi",res)
    }

    @Get("/peta/bahanb3-terbanyak")
    @ApiResponse({
        status: 200,
        description: 'list data Distribusi',
    })
    async petaBahanB3TerbanyakDiDistribusi(@Query()query:PelaporanFilterDateDto){
        const res = await this.dashboardPelaporanDistribusiService.petaBahanB3TerbanyakDiDistribusi(query)
        return new SuccessRes("list data Distribusi",res)
    }

    @Get("/pencarian/bahanb3")
    @ApiResponse({
        status: 200,
        description: 'list data Distribusi',
    })
    async pencarianBesaranB3Terbanyak(@Query()query:PelaporanFilterSearchDto){
        const res = await this.dashboardPelaporanDistribusiService.pencarianBesaranB3Terbanyak(query)
        return new SuccessRes("list data Distribusi",res)
    }

    @Get("/pencarian/perusahaan")
    @ApiResponse({
        status: 200,
        description: 'list data Distribusi',
    })
    async pencarianBesaranPerusahaanTerbanyak(@Query()query:PelaporanFilterSearchDto){
        const res = await this.dashboardPelaporanDistribusiService.pencarianBesaranPerusahaanTerbanyak(query)
        return new SuccessRes("list data Distribusi",res)
    }

}