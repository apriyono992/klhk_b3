import { Module } from "@nestjs/common";
import { PrismaModule } from "./prisma.module";
import { AuthModule } from "./auth.module";
import {DashboardPelaporanPenyimpananController} from "../controller/dashboardPelaporanPenyimpanan.controller";
import {DashboardPelaporanImportController} from "../controller/dashboardPelaporanImport.controller";
import {DashboardPelaporanDistribusiController} from "../controller/dashboardPelaporanDistribusi.controller";
import {DashboardPelaporanPenggunaanController} from "../controller/dashboardPelaporanPenggunaan.controller";
import {DashboardPermohonanController} from "../controller/dashboardPermohonan.controller";
import {DashboardRegistrasiController} from "../controller/dashboardRegistrasi.controller";
import {DashboardPelaporanDistribusiService} from "../services/dashboard/dashboardPelaporanDistribusi.service";
import {DashboardPelaporanRegistrasiService} from "../services/dashboard/dashboardPelaporanImport.services";
import {DashboardPelaporanPenggunaanService} from "../services/dashboard/dashboardPelaporanPenggunaan.service";
import {DashboardPelaporanPenyimpananService} from "../services/dashboard/dashboardPelaporanPenyimpanan.service";
import {DashboardPermohonanService} from "../services/dashboard/dashboardPermohonan.service";
import {DashboardRegistrasiService} from "../services/dashboard/dashboardRegistrasi.service";
import {PrismaService} from "../services/prisma.services";
import {MapsServices} from "../services/maps.services";
import {MapsControllers} from "../controller/maps.controller";
import {DashboardPelaporanProdusenController} from "../controller/dashboardPelaporanProdusen.controller";
import {DashboardPelaporanProdusenService} from "../services/dashboard/dashboardPelaporanProdusen.service";
import {DashboardPelaporanPengangkutanController} from "../controller/dashboardPelaporanPengangkutan.controller";
import {DashboardPelaporanPengangkutanService} from "../services/dashboard/dashboardPelaporanPengangkutan.service";


@Module({
    imports: [PrismaModule, AuthModule],
    providers: [
        DashboardPelaporanProdusenService,
        MapsServices,
        DashboardPelaporanDistribusiService,
        DashboardPelaporanRegistrasiService,
        DashboardPelaporanPenggunaanService,
        DashboardPelaporanPengangkutanService,
        DashboardPelaporanPenyimpananService,
        DashboardPermohonanService,
        DashboardRegistrasiService,
        PrismaService
    ],
    controllers: [
        DashboardPelaporanProdusenController,
        MapsControllers,
        DashboardPelaporanPenyimpananController,
        DashboardPelaporanImportController,
        DashboardPelaporanPengangkutanController,
        DashboardPelaporanDistribusiController,
        DashboardPelaporanPenggunaanController,
        DashboardPermohonanController,
        DashboardRegistrasiController
    ]
})
export class DashboardModule {}