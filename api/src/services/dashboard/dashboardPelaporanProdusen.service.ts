import {Injectable} from "@nestjs/common";
import {PrismaService} from "../prisma.services";
import * as dayjs from "dayjs";
import {Prisma} from "@prisma/client";
import {DashboardPermohonanGetAppStatusDto} from "../../models/dashboard/dashboardPermohonanGetAppStatus.dto";
import {PelaporanFilterDateDto} from "../../models/dashboard/pelaporanFilterDate.dto";
import {PelaporanFilterSearchDto} from "../../models/dashboard/pelaporanFilterSearch.dto";

@Injectable()
export class DashboardPelaporanProdusenService{
    constructor(private prisma: PrismaService){}
    async grafikBesaranB3Terbanyak(query : PelaporanFilterDateDto){

        const { year: startYear, month: startMonth } = this.parseDate(query.startDate);
        const { year: endYear, month: endMonth } = this.parseDate(query.endDate);
        const data = await this.prisma.$queryRaw`
            select D."namaBahanKimia",sum(pbdf."jumlahB3Dihasilkan") as total from "PelaporanB3DihasilkanFinal" as pbdf
            inner join public."DataBahanB3" D on D.id = pbdf."dataBahanB3Id"
            WHERE 1=1
                  ${startYear && endYear ? Prisma.sql`AND (tahun BETWEEN ${startYear} AND ${endYear})` : Prisma.empty}
                  ${startMonth && endMonth ? Prisma.sql`AND (bulan BETWEEN ${startMonth} AND ${endMonth})` : Prisma.empty}
            AND "tipeProduk" = 'B3'
            group by D."namaBahanKimia" order by sum(pbdf."jumlahB3Dihasilkan") DESC limit 10;
        `

        return data
    }
    async grafikBesaranPerusahaanTerbanyak(query : PelaporanFilterDateDto){

        const { year: startYear, month: startMonth } = this.parseDate(query.startDate);
        const { year: endYear, month: endMonth } = this.parseDate(query.endDate);
        const data = await this.prisma.$queryRaw`
            select C.name,sum(pbdf."jumlahB3Dihasilkan") as total from "PelaporanB3DihasilkanFinal" as pbdf
            inner join public."Company" C on C.id = pbdf."companyId"
            WHERE 1=1
                ${startYear && endYear ? Prisma.sql`AND (tahun BETWEEN ${startYear} AND ${endYear})` : Prisma.empty}
                ${startMonth && endMonth ? Prisma.sql`AND (bulan BETWEEN ${startMonth} AND ${endMonth})` : Prisma.empty}
              AND "tipeProduk" = 'B3'
            group by C.name order by sum(pbdf."jumlahB3Dihasilkan") DESC limit 10;
        `

        return data
    }

    async petaPerusahaanTerbanyakMelakukanPelaporan(query : PelaporanFilterDateDto){
        const { year: startYear, month: startMonth } = this.parseDate(query.startDate);
        const { year: endYear, month: endMonth } = this.parseDate(query.endDate);

        const data = await this.prisma.$queryRaw`
            select C.*,count(pbdf.id)::int as total from "PelaporanB3DihasilkanFinal" as pbdf
            inner join public."Company" C on C.id = pbdf."companyId"
            WHERE 1=1
                ${startYear && endYear ? Prisma.sql`AND (tahun BETWEEN ${startYear} AND ${endYear})` : Prisma.empty}
                ${startMonth && endMonth ? Prisma.sql`AND (bulan BETWEEN ${startMonth} AND ${endMonth})` : Prisma.empty}
              AND "tipeProduk" = 'B3'
            group by C.id, name, "penanggungJawab", "alamatKantor", "telpKantor", "faxKantor", "emailKantor", npwp, "nomorInduk", "kodeDBKlh", "alamatPool", "bidangUsaha", C."createdAt", C."updatedAt", "tipePerusahaan", "districtId", latitude, longitude, "provinceId", "regencyId", "skalaPerusahaan", "villageId", "kdPos", kota, provinsi 
            order by count(pbdf.id)::int DESC;
        `

        return data

    }

    async petaPerusahaanTerbanyakProduksi(query : PelaporanFilterDateDto){
        const { year: startYear, month: startMonth } = this.parseDate(query.startDate);
        const { year: endYear, month: endMonth } = this.parseDate(query.endDate);

        const data = await this.prisma.$queryRaw`
            select C.*,sum(pbdf."jumlahB3Dihasilkan") as total from "PelaporanB3DihasilkanFinal" as pbdf
            inner join public."Company" C on C.id = pbdf."companyId"
            WHERE 1=1
                ${startYear && endYear ? Prisma.sql`AND (tahun BETWEEN ${startYear} AND ${endYear})` : Prisma.empty}
                ${startMonth && endMonth ? Prisma.sql`AND (bulan BETWEEN ${startMonth} AND ${endMonth})` : Prisma.empty}
              AND "tipeProduk" = 'B3'
            group by C.id, name, "penanggungJawab", "alamatKantor", "telpKantor", "faxKantor", "emailKantor", npwp, "nomorInduk", "kodeDBKlh", "alamatPool", "bidangUsaha", C."createdAt", C."updatedAt", "tipePerusahaan", "districtId", latitude, longitude, "provinceId", "regencyId", "skalaPerusahaan", "villageId", "kdPos", kota, provinsi 
            order by sum(pbdf."jumlahB3Dihasilkan") DESC;
        `

        return data

    }

    async petaBahanB3TerbanyakDiProduksi(query : PelaporanFilterDateDto){
        const { year: startYear, month: startMonth } = this.parseDate(query.startDate);
        const { year: endYear, month: endMonth } = this.parseDate(query.endDate);

        const data = await this.prisma.$queryRaw`
            select D."namaBahanKimia",D."casNumber",C.latitude,C.longitude,sum(pbdf."jumlahB3Dihasilkan")from "PelaporanB3DihasilkanFinal" as pbdf
            left join public."Company" C on C.id = pbdf."companyId"
            inner join public."DataBahanB3" D on D.id = pbdf."dataBahanB3Id"
            WHERE 1=1
                ${startYear && endYear ? Prisma.sql`AND (tahun BETWEEN ${startYear} AND ${endYear})` : Prisma.empty}
                ${startMonth && endMonth ? Prisma.sql`AND (bulan BETWEEN ${startMonth} AND ${endMonth})` : Prisma.empty}
            AND "tipeProduk" = 'B3'                                                                                             
            group by C.longitude, D."namaBahanKimia", D."casNumber", C.latitude
            order by count(pbdf."jumlahB3Dihasilkan") DESC;
        `

        return data

    }


    async pencarianBesaranB3Terbanyak(query : PelaporanFilterSearchDto){

        const { year: startYear, month: startMonth } = this.parseDate(query.startDate);
        const { year: endYear, month: endMonth } = this.parseDate(query.endDate);

        const keywordFilter = query.keyword
            ? Prisma.sql`
                AND (
                    D."namaBahanKimia" ILIKE ${'%' + query.keyword + '%'}
                    OR D."namaDagang" ILIKE ${'%' + query.keyword + '%'}
                    OR D."tipeBahan" ILIKE ${'%' + query.keyword + '%'}
                )
            `
            : Prisma.empty;

        const [totalResult ,data] = await Promise.all([
            this.prisma.$queryRaw`
            select count(D."namaBahanKimia")::int as total from "PelaporanB3DihasilkanFinal" as pbdf
            inner join public."DataBahanB3" D on D.id = pbdf."dataBahanB3Id"
            WHERE 1=1
                ${startYear && endYear ? Prisma.sql`AND (tahun BETWEEN ${startYear} AND ${endYear})` : Prisma.empty}
                ${startMonth && endMonth ? Prisma.sql`AND (bulan BETWEEN ${startMonth} AND ${endMonth})` : Prisma.empty}
                ${keywordFilter}
                AND "tipeProduk" = 'B3'`,
            this.prisma.$queryRaw`
            select D."namaBahanKimia",D."casNumber",D."namaDagang",D."tipeBahan",sum(pbdf."jumlahB3Dihasilkan")from "PelaporanB3DihasilkanFinal" as pbdf
            inner join public."DataBahanB3" D on D.id = pbdf."dataBahanB3Id"
            WHERE 1=1
                ${startYear && endYear ? Prisma.sql`AND (tahun BETWEEN ${startYear} AND ${endYear})` : Prisma.empty}
                  ${startMonth && endMonth ? Prisma.sql`AND (bulan BETWEEN ${startMonth} AND ${endMonth})` : Prisma.empty}
                ${keywordFilter}
                AND
                "tipeProduk" = 'B3'
            group by D."namaBahanKimia", D."casNumber", D."namaDagang", D."tipeBahan" order by sum(pbdf."jumlahB3Dihasilkan") DESC 
            LIMIT ${query.limit} OFFSET ${query.page};
        `])
        const total = totalResult[0]?.total || 0;
        return {
            total,
            page: query.page ,
            limit: query.limit,
            data,
        };
    }

    async pencarianBesaranPerusahaanTerbanyak(query : PelaporanFilterSearchDto){
        const keywordFilter = query.keyword
            ? Prisma.sql`
                AND (
                    C.id ILIKE ${'%' + query.keyword + '%'}
                    OR C.name ILIKE ${'%' + query.keyword + '%'}
                    OR C."penanggungJawab" ILIKE ${'%' + query.keyword + '%'}
                    OR C."alamatKantor" ILIKE ${'%' + query.keyword + '%'}
                    OR C."telpKantor" ILIKE ${'%' + query.keyword + '%'}
                    OR C."faxKantor" ILIKE ${'%' + query.keyword + '%'}
                    OR C."emailKantor" ILIKE ${'%' + query.keyword + '%'}
                    OR C.npwp ILIKE ${'%' + query.keyword + '%'}
                    OR C."nomorInduk" ILIKE ${'%' + query.keyword + '%'}
                    OR C."kodeDBKlh" ILIKE ${'%' + query.keyword + '%'}
                    OR C."alamatPool" ILIKE ${'%' + query.keyword + '%'}
                    OR C."bidangUsaha" ILIKE ${'%' + query.keyword + '%'}
                    OR C."tipePerusahaan" ILIKE ${'%' + query.keyword + '%'}
                    OR CAST(C.latitude AS TEXT) ILIKE ${'%' + query.keyword + '%'}
                    OR CAST(C.longitude AS TEXT) ILIKE ${'%' + query.keyword + '%'}
                )
            `
            : Prisma.empty;
        const { year: startYear, month: startMonth } = this.parseDate(query.startDate);
        const { year: endYear, month: endMonth } = this.parseDate(query.endDate);
        const [totalResult,data] = await Promise.all([
            this.prisma.$queryRaw`
                select count(*)::int as total from "PelaporanB3DihasilkanFinal" as pbdf                                                                                                                                                                                                                                           inner join public."Company" C on C.id = pbdf."companyId"
                WHERE 1=1
                    ${startYear && endYear ? Prisma.sql`AND (tahun BETWEEN ${startYear} AND ${endYear})` : Prisma.empty}
                    ${startMonth && endMonth ? Prisma.sql`AND (bulan BETWEEN ${startMonth} AND ${endMonth})` : Prisma.empty}
                  AND "tipeProduk" = 'B3' ${keywordFilter}`
            ,this.prisma.$queryRaw`
            select C.id, name, "penanggungJawab", "alamatKantor", "telpKantor", "faxKantor", "emailKantor", npwp, "nomorInduk", "kodeDBKlh", "alamatPool", "bidangUsaha", "tipePerusahaan", latitude, longitude,sum(pbdf."jumlahB3Dihasilkan") as total from "PelaporanB3DihasilkanFinal" as pbdf
            inner join public."Company" C on C.id = pbdf."companyId"
            WHERE 1=1
                ${startYear && endYear ? Prisma.sql`AND (tahun BETWEEN ${startYear} AND ${endYear})` : Prisma.empty}
                ${startMonth && endMonth ? Prisma.sql`AND (bulan BETWEEN ${startMonth} AND ${endMonth})` : Prisma.empty}
              AND "tipeProduk" = 'B3' ${keywordFilter}
            group by C.id, name, "penanggungJawab", "alamatKantor", "telpKantor", "faxKantor", "emailKantor", npwp, "nomorInduk", "kodeDBKlh", "alamatPool", "bidangUsaha", "tipePerusahaan", latitude, longitude
            order by sum(pbdf."jumlahB3Dihasilkan") DESC limit 10;`])

        const total = totalResult[0]?.total || 0;
        return {
            total,
            page: query.page ,
            limit: query.limit,
            data,
        };
    }

    private parseDate(date?: string) {
        if (!date) return { year: null, month: null };
        const parsedDate = dayjs(date);
        return {
            year: parseInt(parsedDate.format('YYYY')),
            month: parseInt(parsedDate.format('MM')),
        };
    };
}