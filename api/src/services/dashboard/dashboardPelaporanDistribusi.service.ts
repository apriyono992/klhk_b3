import {Injectable} from "@nestjs/common";
import {PrismaService} from "../prisma.services";
import {DashboardPelaporanDistribusiDto} from "../../models/dashboard/dashboardPelaporanDistribusi.dto";

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
}