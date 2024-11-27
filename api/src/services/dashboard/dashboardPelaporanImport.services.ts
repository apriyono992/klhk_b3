import {PrismaService} from "../prisma.services";
import {Injectable} from "@nestjs/common";
import {DashboardPermohonanGetAppStatusDto} from "../../models/dashboard/dashboardPermohonanGetAppStatus.dto";

@Injectable()
export class DashboardPelaporanRegistrasiService
{
    constructor(private prisma: PrismaService){}

    async jenisBahanB3TerbanyakImport(params: DashboardPermohonanGetAppStatusDto){
        const startDate = params.startDate ? new Date(new Date(params.startDate).setHours(0, 0, 0, 0)) : new Date(new Date().setHours(0, 0, 0, 0));
        const endDate = params.endDate ? new Date(new Date(params.endDate).setHours(23, 59, 59, 999)) : new Date(new Date().setHours(23, 59, 59, 999));

        const bahanB3 = await this.prisma.$queryRaw<{nama_bahan:string,count:number}[]>`
            select "nama_bahan",count(*) from "BahanB3Registrasi"
            INNER JOIN "Registrasi" R on R."id" = "BahanB3Registrasi"."registrasiId"
            WHERE R."createdAt" >= ${startDate} AND R."createdAt" < ${endDate} AND R."type_registrasi" = 'import'
            group by "nama_bahan" order by count(*) desc limit 10
                `;

        const bahanB3Results = bahanB3.map( item => {
            return {
                nama_bahan:item.nama_bahan,
                count:Number(item.count)
            }
        }, {} as Record<string, number>);

        return bahanB3Results
    }

    async realisasiDanPerencanaan(params: DashboardPermohonanGetAppStatusDto){
        const startDate = params.startDate ? new Date(new Date(params.startDate).setHours(0, 0, 0, 0)) : new Date(new Date().setHours(0, 0, 0, 0));
        const endDate = params.endDate ? new Date(new Date(params.endDate).setHours(23, 59, 59, 999)) : new Date(new Date().setHours(23, 59, 59, 999));

        const startYear = startDate.getFullYear();
        const startMonth = startDate.getMonth() + 1; // getMonth() mulai dari 0, jadi ditambah 1

        const endYear = endDate.getFullYear();
        const endMonth = endDate.getMonth() + 1;

        console.log(startYear,endYear,startMonth,endMonth)
        // Query untuk Perencanaan
        const perencanaan = await this.prisma.$queryRaw<PerencanaanData[]>`
          SELECT 
            EXTRACT(YEAR FROM r."createdAt") AS tahun,
            EXTRACT(MONTH FROM r."createdAt") AS bulan,
            SUM(BB3R.jumlah_impor) AS perencanaan
          FROM "Registrasi" AS r
          INNER JOIN public."BahanB3Registrasi" BB3R 
            ON r.id = BB3R."registrasiId"
          WHERE r."createdAt" >= ${startDate} AND r."createdAt" < ${endDate}
          GROUP BY EXTRACT(YEAR FROM r."createdAt"), EXTRACT(MONTH FROM r."createdAt")
        `;

        // Query untuk Realisasi
        const realisasi = await this.prisma.$queryRaw<RealisasiData[]>`
            SELECT
                tahun,
                bulan,
                SUM("jumlahPembelianB3") AS realisasi
            FROM
                "PelaporanPenggunaanBahanB3Final" AS ppbf
            WHERE
                ("tipePembelian" = 'import' OR "tipePembelian" = 'lokal')
              AND tahun >= ${startYear}
              AND tahun <= ${endYear}
              AND bulan >= ${startMonth}
              AND bulan <= ${endMonth}
            GROUP BY
                tahun, bulan;
        `;
        console.log(realisasi)

        // Gabungkan data
        return this.mergeData(perencanaan, realisasi);
    }

    private mergeData(perencanaan: any[], realisasi: any[]) {
        const result = [];

        // Kumpulkan semua kombinasi tahun-bulan yang unik dari kedua dataset
        const allKeys = new Set<string>();
        perencanaan.forEach((item) => allKeys.add(`${item.tahun}-${item.bulan}`));
        realisasi.forEach((item) => allKeys.add(`${item.tahun}-${item.bulan}`));

        // Buat map untuk penggabungan data
        const dataMap = new Map();

        // Masukkan data perencanaan
        perencanaan.forEach((item) => {
            const key = `${item.tahun}-${item.bulan}`;
            if (!dataMap.has(key)) {
                dataMap.set(key, { tahun: item.tahun, bulan: item.bulan, perencanaan: 0, realisasi: 0 });
            }
            dataMap.get(key).perencanaan = item.perencanaan;
        });

        // Masukkan data realisasi
        realisasi.forEach((item) => {
            const key = `${item.tahun}-${item.bulan}`;
            if (!dataMap.has(key)) {
                dataMap.set(key, { tahun: item.tahun, bulan: item.bulan, perencanaan: 0, realisasi: 0 });
            }
            dataMap.get(key).realisasi = item.realisasi;
        });

        // Pastikan semua bulan-tahun dari allKeys masuk ke hasil akhir
        allKeys.forEach((key) => {
            const [tahun, bulan] = key.split('-').map(Number);
            if (!dataMap.has(key)) {
                dataMap.set(key, { tahun, bulan, perencanaan: 0, realisasi: 0 });
            }
            result.push(dataMap.get(key));
        });
        console.log(result)

        // Kembalikan hasil
        return result;
    }

    // async pelabuhanBongkarTerbanyak(){
    //
    // }
    //
    // async perusahaanJenisBahanB3Terbanyak(){
    //
    // }
}