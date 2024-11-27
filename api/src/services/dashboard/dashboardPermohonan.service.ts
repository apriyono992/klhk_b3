import {Injectable} from "@nestjs/common";
import {PrismaService} from "../prisma.services";
import {DashboardPermohonanGetAppStatusDto} from "../../models/dashboard/dashboardPermohonanGetAppStatus.dto";

@Injectable()
export class DashboardPermohonanService {
    constructor(private readonly prisma:PrismaService) {}
    async getApplicationStatusCounts(params: DashboardPermohonanGetAppStatusDto) {
        // Set the start date to the beginning of the day and the end date to the end of the day
        const startDate = params.startDate ? new Date(new Date(params.startDate).setHours(0, 0, 0, 0)) : new Date(new Date().setHours(0, 0, 0, 0));
        const endDate = params.endDate ? new Date(new Date(params.endDate).setHours(23, 59, 59, 999)) : new Date(new Date().setHours(23, 59, 59, 999));

        const result = await this.prisma.$queryRaw<{
            statusCategory: string;
            count: bigint; // Explicitly using bigint for raw query result
        }[]>`
      SELECT
        CASE
          WHEN "status" IN ('DRAFT_PERMOHONAN', 'MENUNGGU_DI_PROSES') THEN 'MASUK'
          WHEN "status" IN ('PEMOHONAN_DI_PROSES', 'VALIDASI_PEMOHONAN', 'VALIDASI_PEMOHONAN_SELESAI', 'MENUNGGU_PROSES_DRAFT_SK', 'PEMBUATAN_DRAFT_SK', 'DRAFT_SK_TANDA_TANGAN_DIREKTUR', 'SK_REKOMENDASI_B3') THEN 'PROSES'
          WHEN "status" IN ('DITOLAK', 'VALIDASI_PEMOHONAN_DITOLAK', 'TELAAH_TEKIS_DITOLAK') THEN 'DITOLAK'
          WHEN "status" = 'SELESAI' THEN 'SELESAI'
          ELSE 'OTHER'
          END AS "statusCategory",
        COUNT(*) AS "count"
      FROM "Application"
      WHERE "createdAt" >= ${startDate} AND "createdAt" < ${endDate}
      GROUP BY "status";
    `;

        const defaultCategories = {
            MASUK: 0,
            PROSES: 0,
            DITOLAK: 0,
            SELESAI: 0,
            OTHER: 0,
        };

        result.forEach(item => {
            defaultCategories[item.statusCategory] = Number(item.count);
        });

        return defaultCategories

    }

    async getApplicationTipeSuratCounts(params: DashboardPermohonanGetAppStatusDto) {
        // Set the start date to the beginning of the day and the end date to the end of the day
        const startDate = params.startDate ? new Date(new Date(params.startDate).setHours(0, 0, 0, 0)) : new Date(new Date().setHours(0, 0, 0, 0));
        const endDate = params.endDate ? new Date(new Date(params.endDate).setHours(23, 59, 59, 999)) : new Date(new Date().setHours(23, 59, 59, 999));

        const result = await this.prisma.$queryRaw<{
            tipeSurat: string;
            count: number;
        }[]>`
      SELECT "tipeSurat", COUNT(*) AS count
      FROM "Application"
      WHERE "createdAt" >= ${startDate} AND "createdAt" < ${endDate}
      GROUP BY "tipeSurat";
    `;

        const jenisSurat = result.map(item => {
            return {
                tipe_surat:item.tipeSurat,
                count:Number(item.count)
            };
        });

        const countAll = await this.prisma.$queryRaw<{
            total: number;
        }[]>`
      SELECT COUNT(*) AS total
      FROM "Application"
      WHERE "createdAt" >= ${startDate} AND "createdAt" < ${endDate};
    `;

        const totalCount = countAll[0]?.total ? Number(countAll[0].total) : 0; // Convert BigInt to Number

// For avg_processing_days query
        const avgProcessingDays = await this.prisma.$queryRaw<{
            avg_processing_days: number;
        }[]>`
          SELECT
            AVG(DATE_PART('day', "tanggalBerakhir" - "tanggalPengajuan")) AS avg_processing_days
          FROM
            "Application"
          WHERE
            "tanggalBerakhir" IS NOT NULL
            AND "createdAt" BETWEEN ${startDate} AND ${endDate};
        `;

        const avgProcessingDaysValue = avgProcessingDays[0]?.avg_processing_days ? Number(avgProcessingDays[0].avg_processing_days) : 0; // Convert BigInt to Number

        const company = await this.prisma.$queryRaw<{
            company:string,
            count:number
        }[]>`
            select C.name as "company", count(*) from "Application"
        inner join public."Company" C on C.id = "Application"."companyId"
        WHERE "Application"."createdAt" >= ${startDate} AND "Application"."createdAt" < ${endDate}
        group by C.name`;

        const perusahaan = company.map( item => {
            return {
                company_name:item.company,
                count:Number(item.count),
            }
        }, {} as Record<string, number>);

        return {
            jenis_surat: jenisSurat,
            total_permohonan: totalCount,
            rata_rata_proses: Math.round(avgProcessingDaysValue),
            perusahaan
        };
    }

    async getCount10B3Dashboard(params: DashboardPermohonanGetAppStatusDto){
        const startDate = params.startDate ? new Date(new Date(params.startDate).setHours(0, 0, 0, 0)) : new Date(new Date().setHours(0, 0, 0, 0));
        const endDate = params.endDate ? new Date(new Date(params.endDate).setHours(23, 59, 59, 999)) : new Date(new Date().setHours(23, 59, 59, 999));

        const bahanB3 = await this.prisma.$queryRaw<{namaBahanKimia:string,count:number}[]>`
        select D."namaBahanKimia",count(*) from "B3Substance"
        inner join public."DataBahanB3" D on D.id = "B3Substance"."dataBahanB3Id"
        WHERE "B3Substance"."createdAt" >= ${startDate} AND "B3Substance"."createdAt" < ${endDate}
        group by D."namaBahanKimia" order by count(*) desc limit 10
            `;

        const results = bahanB3.map( item => {
            return {
                nama_bahan:item.namaBahanKimia,
                count:Number(item.count)
            }
        }, {} as Record<string, number>);

        return results
    }
}