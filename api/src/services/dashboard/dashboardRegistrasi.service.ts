import {Injectable} from "@nestjs/common";
import {PrismaService} from "../prisma.services";
import {DashboardRegistrasiDto} from "../../models/dashboard/dashboardRegistrasi.dto";

@Injectable()
export class DashboardRegistrasiService {
    constructor(private readonly prisma:PrismaService) {}
    async getDashboardRegistrasi(params: DashboardRegistrasiDto){
        // Set the start date to the beginning of the day and the end date to the end of the day
        const startDate = params.startDate ? new Date(new Date(params.startDate).setHours(0, 0, 0, 0)) : new Date(new Date().setHours(0, 0, 0, 0));
        const endDate = params.endDate ? new Date(new Date(params.endDate).setHours(23, 59, 59, 999)) : new Date(new Date().setHours(23, 59, 59, 999));
        const typeRegistrasi = params.type;
        console.log(typeRegistrasi)

        const countAll = await this.prisma.$queryRaw<{
            total: number;
        }[]>`
      SELECT COUNT(*) AS total
      FROM "Registrasi"
      WHERE "createdAt" >= ${startDate} AND "createdAt" < ${endDate};
    `;

        const totalCount = countAll[0]?.total ? Number(countAll[0].total) : 0; // Convert BigInt to Number

        const avgProcessingDays = await this.prisma.$queryRaw<{
            avg_processing_days: number;
        }[]>`
  SELECT
    AVG(DATE_PART('day', "tanggal_terbit" - "tanggal_pengajuan")) AS avg_processing_days
  FROM
    "Registrasi"
  WHERE
    "tanggal_terbit" IS NOT NULL
    AND "createdAt" BETWEEN ${startDate} AND ${endDate};
`;
        const avgProcessingDaysValue = avgProcessingDays[0]?.avg_processing_days ? Number(avgProcessingDays[0].avg_processing_days) : 0; // Convert BigInt to Number

        const statusProses = await this.prisma.$queryRaw<{
            approval_status: string;
            count: number;
        }[]>`
      SELECT "approval_status", COUNT(*) AS count
      FROM "Registrasi"
      WHERE "createdAt" >= ${startDate} AND "createdAt" < ${endDate}
      GROUP BY "approval_status";
    `;

        const statusProsesRes = statusProses.reduce((acc, item) => {
            acc[item.approval_status] = Number(item.count); // Convert BigInt to Number
            return acc;
        }, {} as Record<string, number>);

        const typeRegistrasiData = await this.prisma.$queryRaw<{
            type_registrasi: string;
            count: number;
        }[]>`
      SELECT "type_registrasi", COUNT(*) AS count
      FROM "Registrasi"
      WHERE "createdAt" >= ${startDate} AND "createdAt" < ${endDate}
      GROUP BY "type_registrasi";
    `;
        const typeRegistrasiRes = typeRegistrasiData.reduce((acc, item) => {
            acc[item.type_registrasi] = Number(item.count); // Convert BigInt to Number
            return acc;
        }, {} as Record<string, number>);
        console.log(typeRegistrasiRes)
        const bahanB3 = await this.prisma.$queryRaw<{nama_bahan:string,count:number}[]>`
    select "nama_bahan",count(*) from "BahanB3Registrasi"
    INNER JOIN "Registrasi" R on R."id" = "BahanB3Registrasi"."registrasiId"
    WHERE R."createdAt" >= ${startDate} AND R."createdAt" < ${endDate} AND R."type_registrasi" = ${typeRegistrasi}
    group by "nama_bahan" order by count(*) desc limit 10
        `;

        const bahanB3Results = bahanB3.map( item => {
            return {
                nama_bahan:item.nama_bahan,
                count:Number(item.count)
            }
        }, {} as Record<string, number>);

        const company = await this.prisma.$queryRaw<{
            company:string,
            count:number
        }[]>`
      select C.name as "company", count(*) from "Registrasi"
                                                  inner join public."Company" C on C.id = "Registrasi"."companyId"
      WHERE "Registrasi"."createdAt" >= ${startDate} AND "Registrasi"."createdAt" < ${endDate}
      group by C.name`;

        const perusahaan = company.map( item => {
            return {
                company_name:item.company,
                count:Number(item.count)
            }
        }, {} as Record<string, number>);

        return {
            total: totalCount,
            processAvg : avgProcessingDaysValue,
            processStatus: {
                masuk:statusProsesRes.created ?? 0,
                proses:statusProsesRes.pending ?? 0,
                ditolak:statusProsesRes.rejected ?? 0,
                selesai:statusProsesRes.selesai ?? 0
            },
            typeRegistrasi: {
                import: typeRegistrasiRes.import ?? 0,
                produsen: typeRegistrasiRes.produsen ?? 0
            },
            bahanB3: bahanB3Results,
            company: perusahaan
        }
    }

    async getDashboardRegistrasiImportAdditionals(params: DashboardRegistrasiDto){
        const startDate = params.startDate ? new Date(new Date(params.startDate).setHours(0, 0, 0, 0)) : new Date(new Date().setHours(0, 0, 0, 0));
        const endDate = params.endDate ? new Date(new Date(params.endDate).setHours(23, 59, 59, 999)) : new Date(new Date().setHours(23, 59, 59, 999));
        const typeRegistrasi = params.type;

        const dataNegaraAsalTerbanyak = await this.prisma.$queryRaw<{
            asal_negara:string,
            total_registrasi: number,
            total_jumlah_impor: number
        }[]>`SELECT
        bb3r.asal_negara AS asal_negara,
        COUNT(bb3r.id) AS total_registrasi,
        SUM(bb3r.jumlah_impor) AS total_jumlah_impor
    FROM
        "BahanB3Registrasi" bb3r
            JOIN
        "Registrasi" r
        ON
            bb3r."registrasiId" = r.id
    WHERE r."createdAt" >= ${startDate} AND r."createdAt" < ${endDate} AND r.type_registrasi = ${typeRegistrasi}
    GROUP BY
        bb3r.asal_negara
    ORDER BY
        bb3r.asal_negara ASC;`;

        const dataNegaraAsalTerbanyakRes = dataNegaraAsalTerbanyak.map( item => {
            return {
                asal_negara:item.asal_negara,
                total_registrasi: Number(item.total_registrasi),
                total_jumlah_impor: Number(item.total_jumlah_impor)
            }
        });

        const pelabuhanAsal = await this.prisma.$queryRaw<{
            pelabuhan_asal:string,
            total_registrasi: number,
            total_jumlah_impor: number
        }[]>`SELECT
            unnest(bb3r.pelabuhan_asal) AS pelabuhan_asal,
            COUNT(bb3r.id) AS total_registrasi,
            SUM(bb3r.jumlah_impor) AS total_jumlah_impor
         FROM
            "BahanB3Registrasi" bb3r
              JOIN
            "Registrasi" r
            ON
              bb3r."registrasiId" = r.id
         WHERE r."createdAt" >= ${startDate} AND r."createdAt" < ${endDate} AND r.type_registrasi = ${typeRegistrasi}
         GROUP BY
           pelabuhan_asal, r.type_registrasi
         ORDER BY
                                                                total_registrasi DESC;`;

        const pelabuhanAsalTerbanyakRes = pelabuhanAsal.map( item => {
            return {
                pelabuhan_asal:item.pelabuhan_asal,
                total_registrasi: Number(item.total_registrasi),
                total_jumlah_impor: Number(item.total_jumlah_impor)
            }
        });

        const pelabuhanMuat = await this.prisma.$queryRaw<{
            pelabuhan_muat:string,
            total_registrasi: number,
            total_jumlah_impor: number
        }[]>`SELECT
            unnest(bb3r.pelabuhan_muat) AS pelabuhan_muat,
            COUNT(bb3r.id) AS total_registrasi,
            SUM(bb3r.jumlah_impor) AS total_jumlah_impor
         FROM
            "BahanB3Registrasi" bb3r
              JOIN
            "Registrasi" r
            ON
              bb3r."registrasiId" = r.id
         WHERE r."createdAt" >= ${startDate} AND r."createdAt" < ${endDate} AND r.type_registrasi = ${typeRegistrasi}
         GROUP BY
           pelabuhan_muat, r.type_registrasi
         ORDER BY
                                                                total_registrasi DESC;`;

        const pelabuhanMuatTerbanyakRes = pelabuhanMuat.map( item => {
            return {
                pelabuhan_muat:item.pelabuhan_muat,
                total_registrasi: Number(item.total_registrasi),
                total_jumlah_impor: Number(item.total_jumlah_impor)
            }
        });

        const pelabuhanBongkar = await this.prisma.$queryRaw<{
            pelabuhan_bongkar:string,
            total_registrasi: number,
            total_jumlah_impor: number
        }[]>`SELECT
            unnest(bb3r.pelabuhan_bongkar) AS pelabuhan_bongkar,
            COUNT(bb3r.id) AS total_registrasi,
            SUM(bb3r.jumlah_impor) AS total_jumlah_impor
         FROM
            "BahanB3Registrasi" bb3r
              JOIN
            "Registrasi" r
            ON
              bb3r."registrasiId" = r.id
         WHERE
              r."createdAt" >= ${startDate} AND r."createdAt" < ${endDate} AND r.type_registrasi = ${typeRegistrasi}
         GROUP BY
           pelabuhan_bongkar, r.type_registrasi
         ORDER BY
                                                                total_registrasi DESC;`;

        const pelabuhanBongkarTerbanyakRes = pelabuhanBongkar.map( item => {
            return {
                pelabuhan_bongkar:item.pelabuhan_bongkar,
                total_registrasi: Number(item.total_registrasi),
                total_jumlah_impor: Number(item.total_jumlah_impor)
            }
        });

        return {
            negaraAsal:dataNegaraAsalTerbanyakRes,
            pelabuhan_asal:pelabuhanAsalTerbanyakRes,
            pelabuhan_muat:pelabuhanMuatTerbanyakRes,
            pelabuhan_bongkar:pelabuhanBongkarTerbanyakRes,
        }
    }
}