import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.services";
import { Prisma } from "@prisma/client";
import * as dayjs from "dayjs";
import { TipePerusahaan } from "src/models/enums/tipePerusahaan";

@Injectable()
export class DashboardPelaporanPenggunaanService {
    constructor(private prisma: PrismaService) { }

    public async getSumByCompany(query) {
        const { start_date: startDate, end_date: endDate } = query

        const { year: startYear, month: startMonth } = this.parseDate(startDate);
        const { year: endYear, month: endMonth } = this.parseDate(endDate);

        const data = await this.prisma.$queryRaw`
        SELECT
            c.id as company_id,
            c.name as company_name,
            SUM(PPBB3F."jumlahB3Digunakan") as jumlah_penggunaan,
            SUM(PPBB3F."jumlahPembelianB3") as jumlah_pembelian
        FROM "PelaporanPenggunaanBahanB3Final" PPBB3F
            JOIN "Company" C on PPBB3F."companyId" = C.id
        WHERE 1=1
            ${startYear && endYear ? Prisma.sql`AND (tahun BETWEEN ${startYear} AND ${endYear})` : Prisma.empty}
            ${startMonth && endMonth ? Prisma.sql`AND (bulan BETWEEN ${startMonth} AND ${endMonth})` : Prisma.empty}
        GROUP BY c.name, c.id
        ORDER BY jumlah_penggunaan DESC, jumlah_pembelian DESC;`

        return data;
    }

    public async getSumBySubstance(query) {
        const { start_date: startDate, end_date: endDate, type } = query

        const { year: startYear, month: startMonth } = this.parseDate(startDate);
        const { year: endYear, month: endMonth } = this.parseDate(endDate);

        const data = await this.prisma.$queryRaw`
        SELECT D.id as substance_id, 
            D."namaBahanKimia" as name,
            SUM(PPBB3F."jumlahB3Digunakan") as jumlah_penggunaan,
            SUM(PPBB3F."jumlahPembelianB3") as jumlah_pembelian
        FROM "PelaporanPenggunaanBahanB3Final" PPBB3F
            JOIN "DataBahanB3" D on PPBB3F."dataBahanB3Id" = D.id
        WHERE 1=1
            ${type ? Prisma.sql`AND PPBB3F."tipePembelian" = ${type}` : Prisma.empty}
            ${startYear && endYear ? Prisma.sql`AND (tahun BETWEEN ${startYear} AND ${endYear})` : Prisma.empty}
            ${startMonth && endMonth ? Prisma.sql`AND (bulan BETWEEN ${startMonth} AND ${endMonth})` : Prisma.empty}
        GROUP BY D."namaBahanKimia", D.id
        ORDER BY jumlah_penggunaan DESC, jumlah_pembelian DESC;`

        return data;
    }

    public async getTopSpendingCompany(query) {
        const { start_date: startDate, end_date: endDate } = query

        const { year: startYear, month: startMonth } = this.parseDate(startDate);
        const { year: endYear, month: endMonth } = this.parseDate(endDate);

        const data = await this.prisma.$queryRaw`
        SELECT
            c.id as company_id,
            c.name as company_name,
            c.latitude, c.longitude,
            SUM(PPBB3F."jumlahB3Digunakan") as jumlah_penggunaan,
            SUM(PPBB3F."jumlahPembelianB3") as jumlah_pembelian
        FROM "PelaporanPenggunaanBahanB3Final" PPBB3F
            JOIN "Company" C on PPBB3F."companyId" = C.id
        WHERE 1=1
            ${startYear && endYear ? Prisma.sql`AND (tahun BETWEEN ${startYear} AND ${endYear})` : Prisma.empty}
            ${startMonth && endMonth ? Prisma.sql`AND (bulan BETWEEN ${startMonth} AND ${endMonth})` : Prisma.empty}
        GROUP BY c.name, c.id, c.latitude, c.longitude`

        return data;
    }

    public async getMapCompanyReport(query) {
        const data = await this.prisma.company.findMany({
            select: {
                id: true,
                name: true,
                latitude: true,
                longitude: true,
                _count: {
                    select: {
                        PelaporanPenggunaanBahanB3Final: true,
                    }
                }
            }
        });

        return data;
    }

    public async getCompanyMapLocalBuy(query) {
        const data = await this.prisma.$queryRaw`
        SELECT c.id as company_id,
            c.name as company_name,
            c.latitude, c.longitude,
            SUM(PPBB3F."jumlahPembelianB3") as purchase_total,
            COUNT(PPBB3F.id) as purchase_amount
        FROM "Company" c
            JOIN "PelaporanPenggunaanBahanB3Final" PPBB3F ON c.id = PPBB3F."companyId"
        WHERE PPBB3F."tipePembelian" = 'Local'
        GROUP BY c.id, c.name, c.latitude, c.longitude;`

        return data;
    }

    public async getCompanyUsage(query) {
        const data = await this.prisma.company.findMany({
            where: {
                tipePerusahaan: {
                    hasEvery: [TipePerusahaan.PERUSAHAAN_PRODUSEN, TipePerusahaan.PERUSAHAAN_IMPOR, TipePerusahaan.PERUSAHAAN_PENGGUNA]
                }
            },
            select: {
                id: true,
                name: true,
                latitude: true,
                longitude: true,
                _count: {
                    select: {
                        PelaporanPenggunaanBahanB3Final: true
                    }
                }
            }
        })

        return data;
    }

    public async getSubstanceUsage(query) {
        const data = await this.prisma.dataBahanB3.findMany({
            select: {
                id: true,
                namaBahanKimia: true,
                PelaporanPenggunaanBahanB3Final: {
                    select: {
                        company: {
                            select: {
                                latitude: true,
                                longitude: true
                            }
                        }
                    }
                },
                _count: {
                    select:{
                        PelaporanPenggunaanBahanB3Final: true
                    }
                }
            },
        })

        return data;
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