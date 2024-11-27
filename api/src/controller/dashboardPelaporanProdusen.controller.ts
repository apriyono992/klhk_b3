import {Controller, Get, Query} from "@nestjs/common";
import {ApiTags} from "@nestjs/swagger";
import {DashboardPelaporanProdusenService} from "../services/dashboard/dashboardPelaporanProdusen.service";
import {SuccessRes} from "../utils/responseDto";
import {DashboardPermohonanGetAppStatusDto} from "../models/dashboard/dashboardPermohonanGetAppStatus.dto";
import {PelaporanFilterDateDto} from "../models/dashboard/pelaporanFilterDate.dto";
import {PelaporanFilterSearchDto} from "../models/dashboard/pelaporanFilterSearch.dto";

@Controller("dashboard/pelaporan/Produsen")
@ApiTags('Dashboard Pelaporan Produsen')
export class DashboardPelaporanProdusenController{
    constructor(private readonly dashboardPelaporanProdusenService:DashboardPelaporanProdusenService){}

    @Get("/grafik/bahanb3")
    async grafikBesaranB3Terbanyak(
        @Query()query:PelaporanFilterDateDto
    ){
        const data = await this.dashboardPelaporanProdusenService.grafikBesaranB3Terbanyak(query)
        return new SuccessRes('Success', data)
    }

    @Get("/grafik/perusahaan")
    async grafikBesaranPerusahaanTerbanyak(
        @Query()query:PelaporanFilterDateDto
    ){
        const data = await this.dashboardPelaporanProdusenService.grafikBesaranPerusahaanTerbanyak(query)
        return new SuccessRes('Success', data)
    }

    @Get("/peta/perusahaan-pelaporan")
    async petaPerusahaanTerbanyakMelakukanPelaporan(
        @Query()query:PelaporanFilterDateDto
    ){
        const data = await this.dashboardPelaporanProdusenService.petaPerusahaanTerbanyakMelakukanPelaporan(query)
        return new SuccessRes('Success', data)
    }

    @Get("/peta/perusahaan-produksi")
    async petaPerusahaanTerbanyakMelakukanProduksi(
        @Query()query:PelaporanFilterDateDto
    ){
        const data = await this.dashboardPelaporanProdusenService.petaPerusahaanTerbanyakProduksi(query)
        return new SuccessRes('Success', data)
    }

    @Get("/peta/bahanb3-produksi")
    async petaBahanB3TerbanyakDiProduksi(
        @Query()query:PelaporanFilterDateDto
    ){
        const data = await this.dashboardPelaporanProdusenService.petaBahanB3TerbanyakDiProduksi(query)
        return new SuccessRes('Success', data)
    }

    @Get("/pencarian/bahanb3")
    async pencarianBesaranB3Terbanyak(
        @Query()query:PelaporanFilterSearchDto
    ){
        const data = await this.dashboardPelaporanProdusenService.pencarianBesaranB3Terbanyak(query)
        return new SuccessRes('Success', data)
    }

    @Get("/pencarian/perusahaan")
    async pencarianBesaranB3PerusahaanTerbanyakProduksi(
        @Query()query:PelaporanFilterSearchDto
    ){
        const data = await this.dashboardPelaporanProdusenService.pencarianBesaranPerusahaanTerbanyak(query)
        return new SuccessRes('Success', data)
    }

}