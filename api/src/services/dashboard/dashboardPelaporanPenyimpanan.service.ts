import { BadRequestException, HttpException, Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import {PrismaService} from "../prisma.services";

@Injectable()
export class DashboardPelaporanPenyimpananService {
    constructor(private prisma: PrismaService) { }

    public async findStorageByRegion(query: { level: string, province?: string, regency?: string, district?: string, village?: string }) {
        const { level, province, regency, district, village } = query

        const listOfProvince = province?.split(',');
        const listOfRegency = regency?.split(',');
        const listOfDistrict = district?.split(',');
        const listOfVillage = village?.split(',');

        const data = await this.prisma.$queryRaw`
        SELECT 
            provinces.id as province_id,
            provinces.name as provinces_name,
            ${level === 'regency' || level === 'district' || level === 'village' ? Prisma.sql`regencies.id as regencies_id, regencies.name as regencies_name,` : Prisma.empty}
            ${level === 'district' || level === 'village' ? Prisma.sql`districts.id as districts_id, districts.name as districts_name,` : Prisma.empty}
            ${level === 'village' ? Prisma.sql`villages.id as villages_id, villages.name as villages_name,` : Prisma.empty}
            CAST(COUNT(pb3.id) AS INT) AS storage_total
        FROM reg_provinces provinces
        JOIN reg_regencies regencies ON provinces.id = regencies."provinceId"
        JOIN reg_districts districts ON regencies.id = districts."regencyId"
        JOIN reg_village villages ON districts.id = villages."districtId"
        FULL JOIN "PenyimpananB3" pb3 ON villages.id = pb3."villageId"
        WHERE 
            1=1
            ${listOfProvince ? Prisma.sql`AND provinces.id IN (${Prisma.join(listOfProvince)})` : Prisma.empty}
            ${listOfRegency ? Prisma.sql`AND regencies.id IN (${Prisma.join(listOfRegency)})` : Prisma.empty}
            ${listOfDistrict ? Prisma.sql`AND districts.id IN (${Prisma.join(listOfDistrict)})` : Prisma.empty}
            ${listOfVillage ? Prisma.sql`AND villages.id IN (${Prisma.join(listOfVillage)})` : Prisma.empty}
        GROUP BY 
            provinces.id, provinces.name
            ${level === 'regency' || level === 'district' || level === 'village' ? Prisma.sql`, regencies.id, regencies.name` : Prisma.empty}
            ${level === 'district' || level === 'village' ? Prisma.sql`, districts.id, districts.name` : Prisma.empty}
            ${level === 'village' ? Prisma.sql`, villages.id, villages.name` : Prisma.empty};`;

        return data
    }

    public async findStorageByCompany(query: { province?: string, regency?: string, district?: string, village?: string }) {
        const { province, regency, district, village } = query

        const listOfProvince = province?.split(',');
        const listOfRegency = regency?.split(',');
        const listOfDistrict = district?.split(',');
        const listOfVillage = village?.split(',');

        const data = this.prisma.$queryRaw`
        SELECT c.id,
               c.name,
               CAST(COUNT(pb3."provinceId") AS int) AS province_total,
               CAST(COUNT(pb3."regencyId") AS int) AS regency_total,
               CAST(COUNT(pb3."districtId") AS int) AS district_total,
               CAST(COUNT(pb3."villageId") AS int) AS village_total
        FROM "PenyimpananB3" pb3
            JOIN "Company" c ON pb3."companyId" = c.id
        WHERE 1=1
            ${listOfProvince ? Prisma.sql`AND pb3."provinceId" IN (${Prisma.join(listOfProvince)})` : Prisma.empty}
            ${listOfRegency ? Prisma.sql`AND pb3."regencyId" IN (${Prisma.join(listOfRegency)})` : Prisma.empty}
            ${listOfDistrict ? Prisma.sql`AND pb3."districtId" IN (${Prisma.join(listOfDistrict)})` : Prisma.empty}
            ${listOfVillage ? Prisma.sql`AND pb3."villageId" IN (${Prisma.join(listOfVillage)})` : Prisma.empty}
        GROUP BY c.id, c.name;
      `;

        return data
    }
}