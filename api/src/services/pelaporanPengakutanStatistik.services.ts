import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from './prisma.services';

@Injectable()
export class PengangkutanStatistikService {
  constructor(private readonly prisma: PrismaService) {}

  // Validasi tanggal
  private validateDate(date: Date, name: string) {
    if (!(date instanceof Date) || isNaN(date.getTime())) {
      throw new BadRequestException(`${name} harus berupa tanggal yang valid`);
    }
  }

  async getB3Substances(
    startDate: Date,
    endDate: Date,
    limit: number = 10,
    applicationId?: string,
    perusahaanId?: string
  ) {
    try {
      this.validateDate(startDate, 'Start date');
      this.validateDate(endDate, 'End date');

      if (limit <= 0) {
        throw new BadRequestException('Limit harus berupa angka positif');
      }

      const result = await this.prisma.laporanPengangkutanFinalDetail.groupBy({
        by: ['b3SubstanceId'],
        where: {
          laporanPengangkutanFinal: {
            finalizedAt: {
              gte: startDate,
              lte: endDate,
            },
            ...(applicationId ? { applicationId } : {}),
            ...(perusahaanId ? { perusahaanId } : {}),
          },
        } as any,
        _sum: {
          jumlahB3: true,
        },
        orderBy: {
          _sum: {
            jumlahB3: 'desc',
          },
        },
        take: limit,
      });

      const topB3Details = await Promise.all(
        result.map(async (item) => {
          const b3Substance = await this.prisma.b3Substance.findUnique({
            where: { id: item.b3SubstanceId },
            include: { dataBahanB3: true },
          });
          return {
            namaB3: b3Substance?.dataBahanB3?.namaBahanKimia || 'Tidak Diketahui',
            jumlahB3: item._sum.jumlahB3 || 0,
          };
        }),
      );

      return topB3Details;
    } catch (error) {
      throw new InternalServerErrorException('Terjadi kesalahan dalam mengambil data B3', error.message);
    }
  }

  async getTopCompaniesByRoutes(limit: number = 10) {
    if (limit <= 0) {
      throw new BadRequestException('Limit harus berupa angka positif');
    }

    try {
      const result = await this.prisma.perusahaanAsalMuat.groupBy({
        by: ['companyId'],
        _count: {
          pengangkutanDetailId: true,
        },
        orderBy: {
          _count: {
            pengangkutanDetailId: 'desc',
          },
        },
        take: limit,
      });

      const topCompaniesByRoutes = await Promise.all(
        result.map(async (item) => {
          const company = await this.prisma.company.findUnique({
            where: { id: item.companyId },
          });
          return {
            namaPerusahaan: company?.name || 'Tidak Diketahui',
            jumlahRute: item._count.pengangkutanDetailId || 0,
          };
        }),
      );

      return topCompaniesByRoutes;
    } catch (error) {
      throw new InternalServerErrorException('Terjadi kesalahan dalam mengambil data perusahaan berdasarkan rute', error.message);
    }
  }

  async getCompaniesByB3Substance(b3SubstanceId: string) {
    if (!b3SubstanceId) {
      throw new BadRequestException('ID B3 Substance tidak boleh kosong');
    }

    try {
      const reports = await this.prisma.pelaporanPengangkutan.findMany({
        where: {
          pengangkutanDetails: {
            some: {
              b3SubstanceId,
            },
          },
        },
        include: {
          application: {
            select: {
              company: {
                select: {
                  id: true,
                  name: true,
                  alamatKantor: true,
                },
              },
            },
          },
        },
      });

      const companies = reports
        .map((report) => report.application?.company)
        .filter((company) => company !== undefined);

      const uniqueCompanies = Array.from(
        new Map(companies.map((company) => [company.id, company])).values()
      );

      return uniqueCompanies;
    } catch (error) {
      throw new InternalServerErrorException('Terjadi kesalahan dalam mengambil perusahaan yang melaporkan B3 tertentu', error.message);
    }
  }

  async getTotalLaporan(startDate: Date, endDate: Date) {
    try {
      this.validateDate(startDate, 'Start date');
      this.validateDate(endDate, 'End date');

      const totalLaporan = await this.prisma.pelaporanPengangkutan.count({
        where: {
          createdAt: {
            gte: startDate,
            lte: endDate,
          },
        },
      });

      return { totalLaporan };
    } catch (error) {
      throw new InternalServerErrorException('Terjadi kesalahan dalam menghitung total laporan', error.message);
    }
  }

  async getRekomendasiBelumDilaporkan(startDate: Date, endDate: Date) {
    try {
      this.validateDate(startDate, 'Start date');
      this.validateDate(endDate, 'End date');

      const rekomendasiDalamRentang = await this.prisma.application.findMany({
        where: {
          createdAt: {
            gte: startDate,
            lte: endDate,
          },
        },
        include: {
          PelaporanPengangkutan: true,
        },
      });

      const rekomendasiBelumDilaporkan = rekomendasiDalamRentang.filter(
        (application) => application.PelaporanPengangkutan.length === 0
      );

      return rekomendasiBelumDilaporkan.map((rekomendasi) => ({
        id: rekomendasi.id,
        namaPerusahaan: rekomendasi.companyId,
        tanggalPermohonan: rekomendasi.createdAt,
      }));
    } catch (error) {
      throw new InternalServerErrorException('Terjadi kesalahan dalam mengambil rekomendasi yang belum dilaporkan', error.message);
    }
  }

  async getB3TransportGraphData(startDate: Date, endDate: Date) {
    try {
      this.validateDate(startDate, 'Start date');
      this.validateDate(endDate, 'End date');

      const topB3 = await this.getB3Substances(startDate, endDate);

      return {
        labels: topB3.map((item) => item.namaB3),
        data: topB3.map((item) => item.jumlahB3),
      };
    } catch (error) {
      throw new InternalServerErrorException('Terjadi kesalahan dalam menyiapkan data grafik', error.message);
    }
  }

  async getStatisticsByB3Substance(startDate: Date, endDate: Date) {
    try {
      this.validateDate(startDate, 'Start date');
      this.validateDate(endDate, 'End date');

      const statistics = await this.prisma.pengangkutanDetail.groupBy({
        by: ['b3SubstanceId'],
        _sum: {
          jumlahB3: true,
        },
        where: {
          createdAt: {
            gte: startDate,
            lte: endDate,
          },
        },
        orderBy: {
          _sum: {
            jumlahB3: 'desc',
          },
        },
      });

      const detailedStatistics = await Promise.all(
        statistics.map(async (item) => {
          const b3Substance = await this.prisma.b3Substance.findUnique({
            where: { id: item.b3SubstanceId },
            include: { dataBahanB3: true },
          });
          return {
            namaB3: b3Substance?.dataBahanB3?.namaBahanKimia || 'Tidak Diketahui',
            totalJumlahB3: item._sum.jumlahB3 || 0,
          };
        })
      );

      return detailedStatistics;
    } catch (error) {
      throw new InternalServerErrorException('Terjadi kesalahan dalam mengambil statistik B3', error.message);
    }
  }

  async getRecentReportStatus() {
    try {
      const recentReports = await this.prisma.pelaporanPengangkutan.findMany({
        where: {
          updatedAt: {
            gte: new Date(new Date().setDate(new Date().getDate() - 7)), // 7 hari terakhir
          },
        },
        select: {
          id: true,
          isDraft: true,
          updatedAt: true,
          application: {
            select: {
              company: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      });

      return recentReports.map((report) => ({
        id: report.id,
        namaPerusahaan: report.application?.company?.name || 'Tidak Diketahui',
        status: report.isDraft ? 'Draft' : 'Final',
        lastUpdate: report.updatedAt,
      }));
    } catch (error) {
      throw new InternalServerErrorException('Terjadi kesalahan dalam mengambil status laporan terbaru', error.message);
    }
  }

  async getTotalShipmentsByLocation(startDate: Date, endDate: Date) {
    try {
      this.validateDate(startDate, 'Start date');
      this.validateDate(endDate, 'End date');

      const originCounts = await this.prisma.perusahaanAsalMuat.groupBy({
        by: ['alamat'],
        _count: {
          id: true,
        },
        where: {
          createdAt: {
            gte: startDate,
            lte: endDate,
          },
        },
      });

      const destinationCounts = await this.prisma.perusahaanTujuanBongkar.groupBy({
        by: ['alamat'],
        _count: {
          id: true,
        },
        where: {
          createdAt: {
            gte: startDate,
            lte: endDate,
          },
        },
      });

      return {
        asalMuat: originCounts.map((origin) => ({
          lokasi: origin.alamat,
          totalPengiriman: origin._count.id,
        })),
        tujuanBongkar: destinationCounts.map((destination) => ({
          lokasi: destination.alamat,
          totalPengiriman: destination._count.id,
        })),
      };
    } catch (error) {
      throw new InternalServerErrorException('Terjadi kesalahan dalam menghitung jumlah pengiriman berdasarkan lokasi', error.message);
    }
  }
}
