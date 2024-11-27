import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from './prisma.services';
import { BahanB3RegistrasiDto } from '../models/createUpdateBahanB3regDTO';

@Injectable()
export class BahanB3RegistrasiService {
  constructor(private prisma: PrismaService) {}

  async createBahanB3Reg(data: BahanB3RegistrasiDto) {
    // Transform the input data as needed for Prisma compatibility
    const { sektor_penggunaan_b3,registrasiId, ...bahanData } = data;

    const createdBahan = await this.prisma.bahanB3Registrasi.create({
      data: {
        alamat_penghasil_b3: bahanData.alamat_penghasil_b3,
        cas_number: bahanData.cas_number,
        hs_code: bahanData.hs_code,
        jumlah_impor: bahanData.jumlah_impor,
        jumlah_impor_per_tahun: bahanData.jumlah_impor_per_tahun,
        karakteristik_b3: bahanData.karakteristik_b3,
        kategori_b3: bahanData.kategori_b3,
        klasifikasi_b3: bahanData.klasifikasi_b3,
        nama_bahan: bahanData.nama_bahan,
        nama_dagang: bahanData.nama_dagang,
        negara_muat: bahanData.negara_muat,
        no_reg_bahan: bahanData.no_reg_bahan,
        pelaksanaan_rencana_impor: bahanData.pelaksanaan_rencana_impor,
        penggunaan: bahanData.penggunaan,
        penghasil_bahan_kimia: bahanData.penghasil_bahan_kimia,
        registrasiId:registrasiId,
        tujuan_penggunaan: bahanData.tujuan_penggunaan,
        asal_negara: bahanData.asal_negara,
        pelabuhan_asal: bahanData.pelabuhan_asal,
        pelabuhan_bongkar: bahanData.pelabuhan_bongkar,
        pelabuhan_muat: bahanData.pelabuhan_muat,
        provinsi_pelabuhan_bongkar: bahanData.provinsi_pelabuhan_bongkar,
        SektorPenggunaanB3: {
          create: sektor_penggunaan_b3?.map((sektor) => ({
            name: sektor.name,
            keterangan: sektor.keterangan,
          })),
        },
      },
      include: {
        SektorPenggunaanB3: true,
      },
    });

    return createdBahan;
  }

  async updateBahanB3Reg(id: string, data: Partial<BahanB3RegistrasiDto>) {
    const { sektor_penggunaan_b3, ...updateData } = data;

    const existingBahan = await this.prisma.bahanB3Registrasi.findUnique({
      where: { id },
    });

    if (!existingBahan) throw new NotFoundException('Data not found');

    const updatedBahan = await this.prisma.bahanB3Registrasi.update({
      where: { id },
      data: {
        ...updateData,
        SektorPenggunaanB3: sektor_penggunaan_b3
          ? {
              deleteMany: {}, // Delete existing sectors
              create: sektor_penggunaan_b3.map((sektor) => ({
                name: sektor.name,
                keterangan: sektor.keterangan,
              })),
            }
          : undefined,
      },
      include: {
        SektorPenggunaanB3: true,
      },
    });

    return updatedBahan;
  }

  async listBahanB3Reg() {
    return await this.prisma.bahanB3Registrasi.findMany({
      where: { deletedAt: null },
      include: {
        SektorPenggunaanB3: true,
      },
    });
  }

  async detailBahanB3Reg(id: string) {
    const bahan = await this.prisma.bahanB3Registrasi.findUnique({
      where: { id, deletedAt: null },
      include: {
        SektorPenggunaanB3: true,
      },
    });

    if (!bahan) throw new NotFoundException('Data not found');

    return bahan;
  }

  async deleteBahanB3Reg(id: string) {
    const existingBahan = await this.detailBahanB3Reg(id);

    if (!existingBahan) throw new NotFoundException('Data not found');

    await this.prisma.bahanB3Registrasi.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });

    return { message: 'Data deleted successfully' };
  }
}
