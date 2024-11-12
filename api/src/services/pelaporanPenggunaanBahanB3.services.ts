import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from './prisma.services';
import { CreatePelaporanPenggunaanBahanB3Dto } from 'src/models/createPelaporanPenggunaanBahanB3Dto';
import { UpdatePelaporanPenggunaanBahanB3Dto } from 'src/models/updatePelaporanPenggunaanB3Dto';

@Injectable()
export class PelaporanPenggunaanBahanB3Service {
  constructor(private readonly prisma: PrismaService) {}
  
    // Method untuk membuat draft laporan penggunaan B3
    async createReport(data: CreatePelaporanPenggunaanBahanB3Dto) {
        const { companyId, dataBahanB3Id, bulan, tahun, periodId, tipePembelian, jumlahPembelianB3, jumlahB3Digunakan, dataSuppliers } = data;
      
        // Cek apakah periode valid
        const period = await this.prisma.period.findUnique({ where: { id: periodId } });
        if (!period) throw new NotFoundException('Period not found.');
      
        // Validasi apakah bulan dan tahun berada dalam rentang periode
        const startDate = new Date(period.startDate);
        const endDate = new Date(period.endDate);
        const inputDate = new Date(tahun, bulan - 1);
        if (inputDate < startDate || inputDate > endDate) {
          throw new BadRequestException('The specified month and year are outside the period range.');
        }
      
        // Cek apakah sudah ada laporan untuk bahan B3 yang sama pada bulan dan tahun yang sama
        const existingReport = await this.prisma.pelaporanPenggunaanBahanB3.findFirst({
          where: { companyId, dataBahanB3Id, bulan, tahun },
        });
      
        if (existingReport) {
          if (existingReport.isApproved) {
            throw new BadRequestException('Report is approved and cannot be modified.');
          }
          throw new BadRequestException('Draft report for the same B3 substance already exists for this month and year.');
        }
      
        // Membuat draft laporan
        const draftReport = await this.prisma.pelaporanPenggunaanBahanB3.create({
          data: {
            companyId,
            dataBahanB3Id,
            bulan,
            tahun,
            periodId,
            tipePembelian,
            jumlahPembelianB3,
            jumlahB3Digunakan,
            isDraft: true,
            DataSupplierOnPelaporanPenggunaanB3: {
              create: dataSuppliers.map((supplierId) => ({
                dataSupplierId: supplierId,
              })),
            },
          },
          include: { DataSupplierOnPelaporanPenggunaanB3: true },
        });
      
        return draftReport;
    }

    // Method untuk mengedit draft laporan penggunaan B3 menggunakan transaksi
    async updateDraftReport(id: string, data: UpdatePelaporanPenggunaanBahanB3Dto) {
        const { dataBahanB3Id, bulan, tahun, periodId, tipePembelian, jumlahPembelianB3, jumlahB3Digunakan, dataSuppliers } = data;

        // Memulai transaksi
        return await this.prisma.$transaction(async (prisma) => {
        // Cek apakah laporan draft ada
        const draftReport = await prisma.pelaporanPenggunaanBahanB3.findUnique({
            where: { id },
            include: { DataSupplierOnPelaporanPenggunaanB3: true },
        });

        if (!draftReport) throw new NotFoundException('Laporan draft tidak ditemukan.');
        if (!draftReport.isDraft) throw new BadRequestException('Laporan sudah difinalisasi dan tidak dapat diedit.');
        if (draftReport.isApproved) throw new BadRequestException('Laporan sudah disetujui dan tidak dapat diedit.');

        // Validasi apakah periode valid
        const period = await prisma.period.findUnique({ where: { id: periodId || draftReport.periodId } });
        if (!period) throw new NotFoundException('Periode tidak ditemukan.');

        // Validasi apakah bulan dan tahun berada dalam rentang periode
        const startDate = new Date(period.startDate);
        const endDate = new Date(period.endDate);
        const inputDate = new Date(tahun || draftReport.tahun, (bulan || draftReport.bulan) - 1);

        if (inputDate < startDate || inputDate > endDate) {
            throw new BadRequestException('Bulan dan tahun yang dipilih berada di luar rentang periode.');
        }

        // Cek apakah ada duplikasi bahan B3 setelah update
        if (dataBahanB3Id && (dataBahanB3Id !== draftReport.dataBahanB3Id || bulan !== draftReport.bulan || tahun !== draftReport.tahun)) {
            const existingReport = await prisma.pelaporanPenggunaanBahanB3.findFirst({
            where: {
                companyId: draftReport.companyId,
                dataBahanB3Id,
                bulan: bulan || draftReport.bulan,
                tahun: tahun || draftReport.tahun,
                id: { not: id },
            },
            });

            if (existingReport) {
            throw new BadRequestException('Laporan dengan bahan B3 yang sama sudah ada untuk bulan dan tahun ini.');
            }
        }

        // Update laporan draft
        const updatedReport = await prisma.pelaporanPenggunaanBahanB3.update({
            where: { id },
            data: {
            dataBahanB3Id: dataBahanB3Id || undefined,
            bulan: bulan || undefined,
            tahun: tahun || undefined,
            periodId: periodId || undefined,
            tipePembelian: tipePembelian || undefined,
            jumlahPembelianB3: jumlahPembelianB3 ?? undefined,
            jumlahB3Digunakan: jumlahB3Digunakan ?? undefined,
            },
        });

        // Update data supplier jika diberikan
        if (dataSuppliers) {
            // Hapus data supplier lama
            await prisma.dataSupplierOnPelaporanPenggunaanB3.deleteMany({
            where: { pelaporanPenggunaanB3Id: id },
            });

            // Tambahkan data supplier baru
            await prisma.dataSupplierOnPelaporanPenggunaanB3.createMany({
            data: dataSuppliers.map((supplierId) => ({
                pelaporanPenggunaanB3Id: id,
                dataSupplierId: supplierId,
            })),
            });
        }

        return updatedReport;
        });
    }

    // Method untuk menghapus draft laporan penggunaan B3
    async deleteDraftReport(id: string) {
        // Memulai transaksi
        return await this.prisma.$transaction(async (prisma) => {
        // Cek apakah laporan draft ada
        const draftReport = await prisma.pelaporanPenggunaanBahanB3.findUnique({
            where: { id },
            include: { DataSupplierOnPelaporanPenggunaanB3: true },
        });

        if (!draftReport) throw new NotFoundException('Laporan draft tidak ditemukan.');
        if (!draftReport.isDraft) throw new BadRequestException('Laporan sudah difinalisasi dan tidak dapat dihapus.');
        if (draftReport.isApproved) throw new BadRequestException('Laporan sudah disetujui dan tidak dapat dihapus.');
    

        // Hapus semua data supplier terkait
        await prisma.dataSupplierOnPelaporanPenggunaanB3.deleteMany({
            where: { pelaporanPenggunaanB3Id: id },
        });

        // Hapus laporan draft
        await prisma.pelaporanPenggunaanBahanB3.delete({
            where: { id },
        });

        return { message: 'Laporan draft dan data supplier terkait berhasil dihapus.' };
        });
    }

    // Method untuk memfinalisasi laporan dalam satu periode dengan validasi bulan yang belum dilaporkan
    async finalizeReportsForPeriod(companyId:string, periodId: string) {
        return await this.prisma.$transaction(async (prisma) => {
        // Cek apakah periode valid
        const period = await prisma.period.findUnique({ where: { id: periodId } });
        if (!period) throw new NotFoundException('Periode tidak ditemukan.');
    
        // Ambil rentang tanggal periode
        const startDate = new Date(period.startDate);
        const endDate = new Date(period.endDate);
    
        // Dapatkan semua bulan dan tahun dalam rentang periode
        const monthsInPeriod = this.getMonthsBetweenDates(startDate, endDate);
    
        // Ambil semua laporan dalam status draft yang sudah siap untuk difinalisasi
        const draftReports = await prisma.pelaporanPenggunaanBahanB3.findMany({
            where: {
            periodId,
            companyId,
            isDraft: true,
            isApproved: false
            },
        });
    
        if (draftReports.length === 0) {
            throw new BadRequestException('Tidak ada laporan yang valid untuk difinalisasi dalam periode ini.');
        }
    
        // Ambil semua kombinasi bulan dan tahun dari laporan yang sudah disetujui
        const reportedMonths = draftReports.map((report) => `${report.bulan}-${report.tahun}`);
        const missingMonths = monthsInPeriod.filter(
            (month) => !reportedMonths.includes(`${month.bulan}-${month.tahun}`)
        );
    
        // Jika ada bulan yang belum dilaporkan, kembalikan error
        if (missingMonths.length > 0) {
            const missingMonthString = missingMonths
            .map((m) => `Bulan ${m.bulan} Tahun ${m.tahun}`)
            .join(', ');
            throw new BadRequestException(`Laporan belum lengkap. Bulan yang belum dilaporkan: ${missingMonthString}.`);
        }
    
        // Ubah status laporan menjadi 'menunggu persetujuan admin'
        for (const report of draftReports) {
            await prisma.pelaporanPenggunaanBahanB3.update({
            where: { id: report.id },
            data: {
                isDraft: false,
            },
            });
        }
    
        return { message: 'Semua laporan dalam periode berhasil difinalisasi dan menunggu persetujuan admin.' };
        });
    }

    // Method untuk persetujuan laporan oleh admin dan memindahkan ke tabel final
    async reviewReport(reportId: string, status: StatusPengajuan, adminNote: string) {
        if (![StatusPengajuan.DISETUJUI, StatusPengajuan.DITOLAK, StatusPengajuan.MENUNGGU_PERSETUJUAN].includes(status)) {
          throw new BadRequestException('Status pengajuan tidak valid.');
        }
      
        return await this.prisma.$transaction(async (prisma) => {
          // Cek apakah laporan valid dan sudah difinalisasi
          const report = await prisma.pelaporanPenggunaanBahanB3.findUnique({
            where: { id: reportId }, include: {
              DataSupplierOnPelaporanPenggunaanB3: { include: {dataSupplier: true}}
            }
          });
          if (!report || !report.isDraft) {
            throw new BadRequestException('Laporan tidak valid atau belum difinalisasi.');
          }
      
          // Jika disetujui, pindahkan laporan ke tabel final
          if (status === StatusPengajuan.DISETUJUI) {
            const final = await prisma.pelaporanPenggunaanBahanB3Final.create({
              data: {
                companyId: report.companyId,
                bulan: report.bulan,
                tahun: report.tahun,
                dataBahanB3Id: report.dataBahanB3Id,
                periodId: report.periodId,
                tipePembelian: report.tipePembelian,
                jumlahPembelianB3: report.jumlahPembelianB3,
                jumlahB3Digunakan: report.jumlahB3Digunakan,
                approvedAt: new Date(),
              },
            });

            // Salin data transporter ke DataTransporterFinal
            for (const supplier of report.DataSupplierOnPelaporanPenggunaanB3) {
                await prisma.dataSupplierOnPelaporanPenggunaanB3Final.create({
                data: {
                    pelaporanPenggunaanB3FinalId: final.id,
                    namaSupplier: supplier.dataSupplier.namaSupplier,
                    alamat: supplier.dataSupplier.alamat,
                    email: supplier.dataSupplier.email,
                    telepon: supplier.dataSupplier.telepon,
                    fax: supplier.dataSupplier.fax,
                    longitude: supplier.dataSupplier.longitude,
                    latitude: supplier.dataSupplier.latitude,
                    companyId: supplier.dataSupplier.companyId,
                    provinceId: supplier.dataSupplier.provinceId,
                    regencyId: supplier.dataSupplier.regencyId,
                    districtId: supplier.dataSupplier.districtId,
                    villageId: supplier.dataSupplier.villageId,
                },
                });
            }
      
            // Tandai laporan sebagai disetujui
            await prisma.pelaporanPenggunaanBahanB3.update({
              where: { id: reportId },
              data: { isApproved: true },
            });
          } else {
            // Jika ditolak, kembalikan laporan ke status draft
            await prisma.pelaporanPenggunaanBahanB3.update({
              where: { id: reportId },
              data: { isDraft: true },
            });
          }
      
          // Update atau buat riwayat pengajuan dengan status yang diberikan
          await prisma.pelaporanPenggunaanBahanB3History.create({
            data: {
              pelaporanPenggunaanBahanB3Id: reportId,
              statusPengajuan: status,
              tanggalPengajuan: report.updatedAt, // Mengambil tanggal pengajuan terakhir
              tanggalPenyelesaian: new Date(),
              catatanAdmin: adminNote,
            },
          });
      
          return { message: `Laporan berhasil ${status === StatusPengajuan.DISETUJUI ? 'disetujui' : 'ditolak'} dan diperbarui.` };
        });
    }

    
    async getCompaniesWithoutReports(periodId: string) {
      // Cek apakah periode valid
      const period = await this.prisma.period.findUnique({ where: { id: periodId } });
      if (!period) throw new NotFoundException('Periode tidak ditemukan.');
    
      // Ambil rentang tanggal periode
      const startDate = new Date(period.startDate);
      const endDate = new Date(period.endDate);
    
      // Dapatkan semua bulan dan tahun dalam rentang periode
      const monthsInPeriod = this.getMonthsBetweenDates(startDate, endDate);
    
      // Ambil semua perusahaan yang terdaftar
      const allCompanies = await this.prisma.company.findMany({
        select: { id: true, name: true },
      });
    
      // Ambil laporan yang sudah diajukan dalam periode ini
      const submittedReports = await this.prisma.pelaporanPenggunaanBahanB3.findMany({
        where: {
          periodId,
        },
        select: {
          companyId: true,
          bulan: true,
          tahun: true,
        },
      });
    
      // Buat set untuk menyimpan kombinasi (companyId, bulan, tahun) yang sudah dilaporkan
      const reportedSet = new Set(
        submittedReports.map((report) => `${report.companyId}-${report.bulan}-${report.tahun}`)
      );
    
      // Filter perusahaan yang belum melaporkan untuk setiap bulan dalam periode
      const companiesWithoutReports = allCompanies.filter((company) => {
        // Cek apakah perusahaan ini sudah melaporkan semua bulan dalam periode
        for (const { bulan, tahun } of monthsInPeriod) {
          if (!reportedSet.has(`${company.id}-${bulan}-${tahun}`)) {
            return true;
          }
        }
        return false;
      });
    
      return {
        message: 'Daftar perusahaan yang belum melakukan pelaporan.',
        companies: companiesWithoutReports,
      };
    }

      

    // Helper untuk mendapatkan semua bulan antara dua tanggal
    private getMonthsBetweenDates(startDate: Date, endDate: Date): { bulan: number; tahun: number }[] {
        const months = [];
        let currentDate = new Date(startDate);

        while (currentDate <= endDate) {
        months.push({
            bulan: currentDate.getMonth() + 1, // Bulan di JavaScript dimulai dari 0
            tahun: currentDate.getFullYear(),
        });
        currentDate.setMonth(currentDate.getMonth() + 1);
        }

        return months;
    }
}
