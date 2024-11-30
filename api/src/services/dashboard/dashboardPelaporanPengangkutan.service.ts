import { BadRequestException, HttpException, Injectable } from "@nestjs/common";
import {PrismaService} from "../prisma.services";
import {SearchPengakutanAsalMuat} from "../../models/searchPengakutanAsalMuat";
import {SearchPengakutanTujuanBongkar} from "../../models/searchPengakutanTujuanBongkar";
import {DashboardPelaporanPengangkutanDto} from "../../models/dashboard/dashboardPelaporanPengangkutan.dto";
import {PelaporanFilterSearchDto} from "../../models/dashboard/pelaporanFilterSearch.dto";
import {Prisma} from "@prisma/client";
import {parseDate} from "../../utils/helpers";
import {PelaporanFilterDateDto} from "../../models/dashboard/pelaporanFilterDate.dto";

@Injectable()
export class DashboardPelaporanPengangkutanService {
    constructor(private prisma: PrismaService) { }

    public async getPelaporanPengangkutanBahanB3(params: DashboardPelaporanPengangkutanDto) {
        const startDate = params.startDate ? new Date(new Date(params.startDate).setHours(0, 0, 0, 0)) : new Date(new Date().setHours(0, 0, 0, 0));
        const endDate = params.endDate ? new Date(new Date(params.endDate).setHours(23, 59, 59, 999)) : new Date(new Date().setHours(23, 59, 59, 999));

        const startYear = startDate.getFullYear();
        const startMonth = startDate.getMonth() + 1; // getMonth() mulai dari 0, jadi ditambah 1

        const endYear = endDate.getFullYear();
        const endMonth = endDate.getMonth() + 1;

        let results:any;

        switch (params.groupBy) {
            case "bahanb3":
                const bahanB3 = await this.prisma.$queryRaw<{ namaBahanKimia: string, count: number }[]>`
                    select D."namaBahanKimia", sum("jumlahB3") as count from "LaporanPengangkutanFinalDetail" as lpfd
                        inner join public."B3Substance" Subtance on Subtance.id = lpfd."b3SubstanceId"
                        inner join public."DataBahanB3" D on D.id = Subtance."dataBahanB3Id"
                    WHERE tahun >= ${startYear}
                      AND tahun <= ${endYear}
                      AND bulan >= ${startMonth}
                      AND bulan <= ${endMonth}
                    group by D."namaBahanKimia" ORDER BY sum("jumlahB3") DESC limit 10;`;

                results = bahanB3.map(item => {
                    return {
                        name: item.namaBahanKimia,
                        count: Number(item.count)
                    }
                }, {} as Record<string, number>);
                break;
            case "perusahaan":
                const perusahaanRaw = await this.prisma.$queryRaw<{name:string,count:number}[]>`
                select C.name,sum("jumlahB3") as count from "LaporanPengangkutanFinalDetail" as lpfd
                    INNER JOIN public."LaporanPengangkutanFinal" lpf on lpfd."laporanPengangkutanFinalId" = lpf.id
                    inner join public."Company" C on lpf."companyId" = C.id
                WHERE tahun >= ${startYear}
                  AND tahun <= ${endYear}
                  AND bulan >= ${startMonth}
                  AND bulan <= ${endMonth}
                group by C.name ORDER BY sum("jumlahB3") DESC limit 10;`;

                results = perusahaanRaw.map(item => {
                    return {
                        name: item.name,
                        count: Number(item.count)
                    }
                }, {} as Record<string, number>);

        }

        return results
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

    async petaPerusahaanTerbanyakMelakukanPelaporan(query: PelaporanFilterDateDto) {
        const { year: startYear, month: startMonth } = parseDate(query.startDate);
        const { year: endYear, month: endMonth } = parseDate(query.endDate);

        const data = await this.prisma.$queryRaw`
            select C.*,count(lpf.id)::int as total from "LaporanPengangkutanFinal" as lpf
            inner join public."Company" C on C.id = lpf."companyId"
            WHERE 1=1
                ${startYear && endYear ? Prisma.sql`AND (tahun BETWEEN ${startYear} AND ${endYear})` : Prisma.empty}
                ${startMonth && endMonth ? Prisma.sql`AND (bulan BETWEEN ${startMonth} AND ${endMonth})` : Prisma.empty}
        
            group by C.id, name, "penanggungJawab", "alamatKantor", "telpKantor", "faxKantor", "emailKantor", npwp, "nomorInduk", "kodeDBKlh", "alamatPool", "bidangUsaha", C."createdAt", C."updatedAt", "tipePerusahaan", "districtId", latitude, longitude, "provinceId", "regencyId", "skalaPerusahaan", "villageId", "kdPos", kota, provinsi 
            order by count(lpf.id)::int DESC;
        `
        return data
    }

    async petaPerusahaanTerbanyakPengangkutan(query : PelaporanFilterDateDto){
        const { year: startYear, month: startMonth } = parseDate(query.startDate);
        const { year: endYear, month: endMonth } = parseDate(query.endDate);

        const data = await this.prisma.$queryRaw`
            select C.*,sum(lpfd."jumlahB3") as total from "LaporanPengangkutanFinalDetail" as lpfd
            INNER JOIN public."LaporanPengangkutanFinal" lpf on lpfd."laporanPengangkutanFinalId" = lpf.id
            inner join public."Company" C on lpf."companyId" = C.id
                                                                  
            WHERE 1=1
                ${startYear && endYear ? Prisma.sql`AND (tahun BETWEEN ${startYear} AND ${endYear})` : Prisma.empty}
                ${startMonth && endMonth ? Prisma.sql`AND (bulan BETWEEN ${startMonth} AND ${endMonth})` : Prisma.empty}
            
            group by C.id, name, "penanggungJawab", "alamatKantor", "telpKantor", "faxKantor", "emailKantor", npwp, "nomorInduk", "kodeDBKlh", "alamatPool", "bidangUsaha", C."createdAt", C."updatedAt", "tipePerusahaan", "districtId", latitude, longitude, "provinceId", "regencyId", "skalaPerusahaan", "villageId", "kdPos", kota, provinsi 
            order by sum(lpfd."jumlahB3") DESC;
        `

        return data

    }

    public async petaBahanB3TerbanyakPengangkutan(query : PelaporanFilterDateDto) {
        const { year: startYear, month: startMonth } = parseDate(query.startDate);
        const { year: endYear, month: endMonth } = parseDate(query.endDate);

        const data = await this.prisma.$queryRaw`
            select D."namaBahanKimia", D."casNumber", C.latitude, C.longitude, sum(lpfd."jumlahB3")from "LaporanPengangkutanFinalDetail" as lpfd
            left join public."LaporanPengangkutanFinal" lpf on lpfd."laporanPengangkutanFinalId" = lpf.id
            inner join public."Company" C on lpf."companyId" = C.id
            inner join public."B3Substance" Subtance on Subtance.id = lpfd."b3SubstanceId"
            inner join public."DataBahanB3" D on D.id = Subtance."dataBahanB3Id"
                                                                                                             
            WHERE 1=1
                ${startYear && endYear ? Prisma.sql`AND (tahun BETWEEN ${startYear} AND ${endYear})` : Prisma.empty}
                ${startMonth && endMonth ? Prisma.sql`AND (bulan BETWEEN ${startMonth} AND ${endMonth})` : Prisma.empty}
                                                                                                         
            group by C.longitude, D."namaBahanKimia", D."casNumber", C.latitude
            order by count(lpfd."jumlahB3") DESC;
        `
        return data
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