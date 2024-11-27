import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.services";
import { Prisma } from "@prisma/client";
import * as dayjs from "dayjs";

@Injectable()
export class DashboardPelaporanPenggunaanService {
    constructor(private prisma: PrismaService) { }

    public async getSumByCompany(query) {
        const { start_date: startDate, end_date: endDate } = query

        const { year: startYear, month: startMonth } = this.parseDate(startDate);
        const { year: endYear, month: endMonth } = this.parseDate(endDate);

        const data = this.prisma.$queryRaw`
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

        const data = this.prisma.$queryRaw`
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

    private parseDate(date?: string) {
        if (!date) return { year: null, month: null };
        const parsedDate = dayjs(date);
        return {
          year: parseInt(parsedDate.format('YYYY')),
          month: parseInt(parsedDate.format('MM')),
        };
      };
      
}