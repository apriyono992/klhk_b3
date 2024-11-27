import {Injectable} from "@nestjs/common";
import {PrismaService} from "./prisma.services";

@Injectable()
export class MapsServices{
    constructor(private prisma:PrismaService){}
    async listDataGudangPenyimpanan4Maps() {
        const penyimpananData = await this.prisma.penyimpananB3.findMany({
            where: { isApproved: true },
            select: {
                alamatGudang: true,
                longitude: true,
                latitude: true,
                company: {
                    select: {
                        name: true,
                    },
                },
            },
        });

        const geoJsonData = penyimpananData.map((item) => ({
            company_name: item.company.name,
            address: item.alamatGudang,
            latitude:item.latitude,
            longitude:item.longitude
        }));

        return geoJsonData;
    }

    async getDataPelabuhan() {
        const dataPelabuhan = await this.prisma.dataPelabuhan.findMany({
            where: {
                NOT: [
                    { latitude: "Unknown" },
                    { longitude: "Unknown" },
                ],
            },
        });
        const geoJsonData = [];

        for (let i = 0; i < dataPelabuhan.length; i++) {
            const item = dataPelabuhan[i];

            geoJsonData.push({
                properties: {
                    id_lokasi: item.id_lokasi,
                    nama_lokasi: item.nm_lokasi,
                    kode_kantor: item.kd_kantor,
                    nama_kantor_pendek: item.nm_kantor_pendek,
                },
                geometry: {
                    type: 'Point',
                    coordinates: [item.longitude, item.latitude, 0.0],
                },
            });
        }
        return geoJsonData
    }
}