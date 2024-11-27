import {Injectable} from "@nestjs/common";
import {PrismaService} from "../prisma.services";
import {DashboardPelaporanDistribusiDto} from "../../models/dashboard/dashboardPelaporanDistribusi.dto";
import {PelaporanFilterDateDto} from "../../models/dashboard/pelaporanFilterDate.dto";
import {Prisma} from "@prisma/client";
import {PelaporanFilterSearchDto} from "../../models/dashboard/pelaporanFilterSearch.dto";
import {parseDate} from "../../utils/helpers";

@Injectable()
export class DashboardPelaporanDistribusiService
{
    constructor(private prisma: PrismaService){}
    async getPelaporanBahanB3(params:DashboardPelaporanDistribusiDto){
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
                    select D."namaBahanKimia", sum("jumlahB3Distribusi") as count
                    from "PelaporanBahanB3DistribusiFinal" as pbbdf
                        inner join public."DataBahanB3" D
                    on D.id = pbbdf."dataBahanB3Id"
                    WHERE tahun >= ${startYear}
                      AND tahun <= ${endYear}
                      AND bulan >= ${startMonth}
                      AND bulan <= ${endMonth}
                    group by D."namaBahanKimia" ORDER BY sum("jumlahB3Distribusi") DESC limit 10;`;

                results = bahanB3.map(item => {
                    return {
                        name: item.namaBahanKimia,
                        count: Number(item.count)
                    }
                }, {} as Record<string, number>);
                break;
            case "perusahaan":
                const perusahaanRaw = await this.prisma.$queryRaw<{name:string,count:number}[]>`
                select C.name,sum("jumlahB3Distribusi") as count from "PelaporanBahanB3DistribusiFinal" as pbbdf
                inner join public."Company" C on C.id = pbbdf."companyId"
                WHERE tahun >= ${startYear}
                  AND tahun <= ${endYear}
                  AND bulan >= ${startMonth}
                  AND bulan <= ${endMonth}
                group by C.name ORDER BY sum("jumlahB3Distribusi") DESC limit 10;`;

                results = perusahaanRaw.map(item => {
                    return {
                        name: item.name,
                        count: Number(item.count)
                    }
                }, {} as Record<string, number>);

        }
        return results
    }


    async petaSebaranPerusahaanDistribusi(){
        return this.prisma.company.findMany({
            where: {
                tipePerusahaan: {
                    equals: ['PERUSAHAAN_DISTRIBUTOR'],
                }
            }
        });

    }

    async petaPerusahaanTerbanyakMelakukanPelaporan(query : PelaporanFilterDateDto){
        const { year: startYear, month: startMonth } = parseDate(query.startDate);
        const { year: endYear, month: endMonth } = parseDate(query.endDate);

        const data = await this.prisma.$queryRaw`
            select C.*,count(pbbdf.id)::int as total from "PelaporanBahanB3DistribusiFinal" as pbbdf
            inner join public."Company" C on C.id = pbbdf."companyId"
            WHERE 1=1
                ${startYear && endYear ? Prisma.sql`AND (tahun BETWEEN ${startYear} AND ${endYear})` : Prisma.empty}
                ${startMonth && endMonth ? Prisma.sql`AND (bulan BETWEEN ${startMonth} AND ${endMonth})` : Prisma.empty}
        
            group by C.id, name, "penanggungJawab", "alamatKantor", "telpKantor", "faxKantor", "emailKantor", npwp, "nomorInduk", "kodeDBKlh", "alamatPool", "bidangUsaha", C."createdAt", C."updatedAt", "tipePerusahaan", "districtId", latitude, longitude, "provinceId", "regencyId", "skalaPerusahaan", "villageId", "kdPos", kota, provinsi 
            order by count(pbbdf.id)::int DESC;
        `

        return data

    }

    async petaPerusahaanTerbanyakDistribusi(query : PelaporanFilterDateDto){
        const { year: startYear, month: startMonth } = parseDate(query.startDate);
        const { year: endYear, month: endMonth } = parseDate(query.endDate);

        const data = await this.prisma.$queryRaw`
            select C.*,sum(pbdf."jumlahB3Distribusi") as total from "PelaporanBahanB3DistribusiFinal" as pbdf
            inner join public."Company" C on C.id = pbdf."companyId"
            WHERE 1=1
                ${startYear && endYear ? Prisma.sql`AND (tahun BETWEEN ${startYear} AND ${endYear})` : Prisma.empty}
                ${startMonth && endMonth ? Prisma.sql`AND (bulan BETWEEN ${startMonth} AND ${endMonth})` : Prisma.empty}
            
            group by C.id, name, "penanggungJawab", "alamatKantor", "telpKantor", "faxKantor", "emailKantor", npwp, "nomorInduk", "kodeDBKlh", "alamatPool", "bidangUsaha", C."createdAt", C."updatedAt", "tipePerusahaan", "districtId", latitude, longitude, "provinceId", "regencyId", "skalaPerusahaan", "villageId", "kdPos", kota, provinsi 
            order by sum(pbdf."jumlahB3Distribusi") DESC;
        `

        return data

    }

    async petaBahanB3TerbanyakDiDistribusi(query : PelaporanFilterDateDto){
        const { year: startYear, month: startMonth } = parseDate(query.startDate);
        const { year: endYear, month: endMonth } = parseDate(query.endDate);

        const data = await this.prisma.$queryRaw`
            select D."namaBahanKimia",D."casNumber",C.latitude,C.longitude,sum(pbdf."jumlahB3Distribusi")from "PelaporanBahanB3DistribusiFinal" as pbdf
            left join public."Company" C on C.id = pbdf."companyId"
            inner join public."DataBahanB3" D on D.id = pbdf."dataBahanB3Id"
            WHERE 1=1
                ${startYear && endYear ? Prisma.sql`AND (tahun BETWEEN ${startYear} AND ${endYear})` : Prisma.empty}
                ${startMonth && endMonth ? Prisma.sql`AND (bulan BETWEEN ${startMonth} AND ${endMonth})` : Prisma.empty}
                                                                                                         
            group by C.longitude, D."namaBahanKimia", D."casNumber", C.latitude
            order by count(pbdf."jumlahB3Distribusi") DESC;
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
                select count(D."namaBahanKimia") ::int as total
                from "PelaporanBahanB3DistribusiFinal" as pbdf
                         inner join public."DataBahanB3" D on D.id = pbdf."dataBahanB3Id"
                WHERE 1 = 1
                    ${startYear && endYear ? Prisma.sql`AND (tahun BETWEEN ${startYear} AND ${endYear})` : Prisma.empty} ${startMonth && endMonth ? Prisma.sql`AND (bulan BETWEEN ${startMonth} AND ${endMonth})` : Prisma.empty} ${keywordFilter}
                  `,
            this.prisma.$queryRaw`
                select D."namaBahanKimia", D."casNumber", D."namaDagang", D."tipeBahan", sum(pbdf."jumlahB3Distribusi")
                from "PelaporanBahanB3DistribusiFinal" as pbdf
                         inner join public."DataBahanB3" D on D.id = pbdf."dataBahanB3Id"
                WHERE 1 = 1
                    ${startYear && endYear ? Prisma.sql`AND (tahun BETWEEN ${startYear} AND ${endYear})` : Prisma.empty} ${startMonth && endMonth ? Prisma.sql`AND (bulan BETWEEN ${startMonth} AND ${endMonth})` : Prisma.empty} ${keywordFilter}
                group by D."namaBahanKimia", D."casNumber", D."namaDagang", D."tipeBahan"
                order by sum (pbdf."jumlahB3Distribusi") DESC
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
            const { year: startYear, month: startMonth } = parseDate(query.startDate);
            const { year: endYear, month: endMonth } = parseDate(query.endDate);
            const [totalResult,data] = await Promise.all([
                this.prisma.$queryRaw`
                select count(*)::int as total from "PelaporanBahanB3DistribusiFinal" as pbdf                                                                                                                                                                                                                                           inner join public."Company" C on C.id = pbdf."companyId"
                WHERE 1=1
                    ${startYear && endYear ? Prisma.sql`AND (tahun BETWEEN ${startYear} AND ${endYear})` : Prisma.empty}
                    ${startMonth && endMonth ? Prisma.sql`AND (bulan BETWEEN ${startMonth} AND ${endMonth})` : Prisma.empty}
                  ${keywordFilter}`
                ,this.prisma.$queryRaw`
            select C.id, name, "penanggungJawab", "alamatKantor", "telpKantor", "faxKantor", "emailKantor", npwp, "nomorInduk", "kodeDBKlh", "alamatPool", "bidangUsaha", "tipePerusahaan", latitude, longitude,sum(pbdf."jumlahB3Distribusi") as total from "PelaporanBahanB3DistribusiFinal" as pbdf
            inner join public."Company" C on C.id = pbdf."companyId"
            WHERE 1=1
                ${startYear && endYear ? Prisma.sql`AND (tahun BETWEEN ${startYear} AND ${endYear})` : Prisma.empty}
                ${startMonth && endMonth ? Prisma.sql`AND (bulan BETWEEN ${startMonth} AND ${endMonth})` : Prisma.empty}
              ${keywordFilter}
            group by C.id, name, "penanggungJawab", "alamatKantor", "telpKantor", "faxKantor", "emailKantor", npwp, "nomorInduk", "kodeDBKlh", "alamatPool", "bidangUsaha", "tipePerusahaan", latitude, longitude
            order by sum(pbdf."jumlahB3Distribusi") DESC limit 10;`])

            const total = totalResult[0]?.total || 0;
            return {
                total,
                page: query.page ,
                limit: query.limit,
                data,
            };
        }
}