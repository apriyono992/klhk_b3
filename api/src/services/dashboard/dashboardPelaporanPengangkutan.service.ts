import { BadRequestException, HttpException, Injectable } from "@nestjs/common";
import {PrismaService} from "../prisma.services";
import {SearchPengakutanAsalMuat} from "../../models/searchPengakutanAsalMuat";
import {SearchPengakutanTujuanBongkar} from "../../models/searchPengakutanTujuanBongkar";
import {DashboardPelaporanPengangkutanDto} from "../../models/dashboard/dashboardPelaporanPengangkutan.dto";
import {PelaporanFilterSearchDto} from "../../models/dashboard/pelaporanFilterSearch.dto";
import {Prisma} from "@prisma/client";
import {parseDate} from "../../utils/helpers";

@Injectable()
export class DashboardPelaporanPengangkutanService {
    constructor(private prisma: PrismaService) { }

    public async findMapTransportationAsalMuat(searchPengakutanAsalMuat: SearchPengakutanAsalMuat) {

        const getAllData =  await this.prisma.dataPerusahaanAsalMuatOnPengakutanDetailFinal.findMany({});

        return getAllData;
    }

    public async findMapTransportationTujuanBongkar(searchPengakutanTujuanBongkar: SearchPengakutanTujuanBongkar) {
       return null;
    }

    public async findB3BerdasarkanPerusahaan() {
        const getAllData =  await this.prisma.laporanPengangkutanFinal.findMany({});

        return { data: getAllData };
    }

    async petaSebaranPerusahaanPengangkutan(){
        return this.prisma.company.findMany({
            where: {
                tipePerusahaan: {
                    equals: ['PERUSAHAAN_PENGANGKUTAN'],
                }
            }
        });

    }


    async pencarianBesaranB3Terbanyak(query : PelaporanFilterSearchDto) {

        const {year: startYear, month: startMonth} = parseDate(query.startDate);
        const {year: endYear, month: endMonth} = parseDate(query.endDate);

        const keywordFilter = query.keyword
            ? Prisma.sql`
                AND (
                    D."namaBahanKimia" ILIKE ${'%' + query.keyword + '%'}
                    OR D."namaDagang" ILIKE ${'%' + query.keyword + '%'}
                    OR D."tipeBahan" ILIKE ${'%' + query.keyword + '%'}
                )
            `
            : Prisma.empty;

        const [totalResult, data] = await Promise.all([
            this.prisma.$queryRaw`
                select count(D."namaBahanKimia") ::int as total from "LaporanPengangkutanFinalDetail" as lpfd
                         inner join "LaporanPengangkutanFinal" lpf on lpfd."laporanPengangkutanFinalId" = lpf.id
                         inner join public."B3Substance" Subtance on Subtance.id = lpfd."b3SubstanceId"
                         inner join public."DataBahanB3" D on D.id = Subtance."dataBahanB3Id"
                WHERE 1 = 1
                    ${startYear && endYear ? Prisma.sql`AND (tahun BETWEEN ${startYear} AND ${endYear})` : Prisma.empty} ${startMonth && endMonth ? Prisma.sql`AND (bulan BETWEEN ${startMonth} AND ${endMonth})` : Prisma.empty} ${keywordFilter}
                  `,

            this.prisma.$queryRaw`
                select D."namaBahanKimia", D."casNumber", D."namaDagang", D."tipeBahan", sum(lpfd."jumlahB3") from "LaporanPengangkutanFinalDetail" as lpfd
                           inner join "LaporanPengangkutanFinal" lpf on lpfd."laporanPengangkutanFinalId" = lpf.id
                           inner join public."B3Substance" Subtance on Subtance.id = lpfd."b3SubstanceId"
                           inner join public."DataBahanB3" D on D.id = Subtance."dataBahanB3Id"
                WHERE 1 = 1
                    ${startYear && endYear ? Prisma.sql`AND (tahun BETWEEN ${startYear} AND ${endYear})` : Prisma.empty} ${startMonth && endMonth ? Prisma.sql`AND (bulan BETWEEN ${startMonth} AND ${endMonth})` : Prisma.empty} ${keywordFilter}
                group by D."namaBahanKimia", D."casNumber", D."namaDagang", D."tipeBahan"
                order by sum (lpfd."jumlahB3") DESC
                    LIMIT ${query.limit}
                OFFSET ${query.page};
            `])

        const total = totalResult[0]?.total || 0;
        return {
            total,
            page: query.page,
            limit: query.limit,
            data,
        };
    }


    async pencarianPengangkutanTerbanyak(query : PelaporanFilterSearchDto){
        const keywordFilter = query.keyword
            ? Prisma.sql`
            AND (
                Company.id ILIKE ${'%' + query.keyword + '%'}
                OR Company.name ILIKE ${'%' + query.keyword + '%'}
                OR Company."penanggungJawab" ILIKE ${'%' + query.keyword + '%'}
                OR Company."alamatKantor" ILIKE ${'%' + query.keyword + '%'}
                OR Company."telpKantor" ILIKE ${'%' + query.keyword + '%'}
                OR Company."faxKantor" ILIKE ${'%' + query.keyword + '%'}
                OR Company."emailKantor" ILIKE ${'%' + query.keyword + '%'}
                OR Company.npwp ILIKE ${'%' + query.keyword + '%'}
                OR Company."nomorInduk" ILIKE ${'%' + query.keyword + '%'}
                OR Company."kodeDBKlh" ILIKE ${'%' + query.keyword + '%'}
                OR Company."alamatPool" ILIKE ${'%' + query.keyword + '%'}
                OR Company."bidangUsaha" ILIKE ${'%' + query.keyword + '%'}
                OR Company."tipePerusahaan" ILIKE ${'%' + query.keyword + '%'}
                OR CAST(Company.latitude AS TEXT) ILIKE ${'%' + query.keyword + '%'}
                OR CAST(Company.longitude AS TEXT) ILIKE ${'%' + query.keyword + '%'}
            )
        `
            : Prisma.empty;
        const { year: startYear, month: startMonth } = parseDate(query.startDate);
        const { year: endYear, month: endMonth } = parseDate(query.endDate);

        const [totalResult,data] = await Promise.all([
            this.prisma.$queryRaw`
            select count(*)::int as total from "LaporanPengangkutanFinalDetail" as lpfd
                   inner join "LaporanPengangkutanFinal" lpf on lpfd."laporanPengangkutanFinalId" = lpf.id
                   inner join "Company" company on lpf."companyId" = company.id
            WHERE 1=1
                ${startYear && endYear ? Prisma.sql`AND (tahun BETWEEN ${startYear} AND ${endYear})` : Prisma.empty}
                ${startMonth && endMonth ? Prisma.sql`AND (bulan BETWEEN ${startMonth} AND ${endMonth})` : Prisma.empty}
              ${keywordFilter}`
            ,

            this.prisma.$queryRaw`
            select Company.id, name, "penanggungJawab", "alamatKantor", "telpKantor", "faxKantor", "emailKantor", npwp, "nomorInduk", "kodeDBKlh", "alamatPool", "bidangUsaha", "tipePerusahaan", latitude, longitude, sum(lpfd."jumlahB3") as total from "LaporanPengangkutanFinalDetail" as lpfd
                    inner join "LaporanPengangkutanFinal" lpf on lpfd."laporanPengangkutanFinalId" = lpf.id
                    inner join "Company" company on lpf."companyId" = company.id
            WHERE 1=1
                ${startYear && endYear ? Prisma.sql`AND (tahun BETWEEN ${startYear} AND ${endYear})` : Prisma.empty}
                ${startMonth && endMonth ? Prisma.sql`AND (bulan BETWEEN ${startMonth} AND ${endMonth})` : Prisma.empty}
              ${keywordFilter}
            group by Company.id, name, "penanggungJawab", "alamatKantor", "telpKantor", "faxKantor", "emailKantor", npwp, "nomorInduk", "kodeDBKlh", "alamatPool", "bidangUsaha", "tipePerusahaan", latitude, longitude
            order by sum(lpfd."jumlahB3") DESC limit 10;`])

        const total = totalResult[0]?.total || 0;
        return {
            total,
            page: query.page ,
            limit: query.limit,
            data,
        };
    }
}