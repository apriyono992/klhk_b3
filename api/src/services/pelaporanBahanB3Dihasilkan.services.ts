import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "./prisma.services";
import { CreatePelaporanBahanB3DihasilkanDto } from "src/models/createPelaporanBahanB3DihasilkanDto";
import { UpdatePelaporanB3DihasilkanDto } from "src/models/updatePelaporanBahanB3DihasilkanDto";
import { ReviewPelaporanBahanB3Dto } from "src/models/reviewPelaporanBahanB3Dto";

@Injectable()
export class PelaporanBahanB3DihasilkanService {
  constructor(private readonly prisma: PrismaService) {}

  async createReport(data: CreatePelaporanBahanB3DihasilkanDto) {
    const { companyId, tipeProduk, periodId, bulan, tahun, prosesProduksi, dataBahanB3Id, jumlahB3Dihasilkan } = data;
  
    const period = await this.prisma.period.findUnique({ where: { id: periodId } });
    if (!period) throw new NotFoundException('Periode tidak ditemukan.');
  
    const startDate = new Date(period.startDate);
    const endDate = new Date(period.endDate);
    const inputDate = new Date(tahun, bulan - 1);
    if (inputDate < startDate || inputDate > endDate) {
      throw new BadRequestException('Bulan dan tahun berada di luar rentang periode.');
    }
  
    const existingReport = await this.prisma.pelaporanB3Dihasilkan.findFirst({
      where: { companyId, dataBahanB3Id, bulan, tahun },
    });
  
    if (existingReport) {
      if (existingReport.isApproved) {
        throw new BadRequestException('Laporan sudah disetujui dan tidak dapat dimodifikasi.');
      }
      throw new BadRequestException('Draft laporan sudah ada untuk bahan B3 ini pada bulan dan tahun yang sama.');
    }
  
    const draftReport = await this.prisma.pelaporanB3Dihasilkan.create({
      data: {
        companyId,
        tipeProduk,
        periodId,
        bulan,
        tahun,
        prosesProduksi,
        dataBahanB3Id,
        jumlahB3Dihasilkan,
        isDraft: true,
      },
    });
  
    return draftReport;
  }
  
  async updateDraftReport(id: string, data: UpdatePelaporanB3DihasilkanDto) {
    return await this.prisma.$transaction(async (prisma) => {
      const draftReport = await prisma.pelaporanB3Dihasilkan.findUnique({ where: { id } });
  
      if (!draftReport) throw new NotFoundException('Laporan draft tidak ditemukan.');
      if (!draftReport.isDraft) throw new BadRequestException('Laporan sudah difinalisasi dan tidak dapat diedit.');
      if (draftReport.isApproved) throw new BadRequestException('Laporan sudah disetujui dan tidak dapat diedit.');
  
      const period = await prisma.period.findUnique({ where: { id: data.periodId || draftReport.periodId } });
      if (!period) throw new NotFoundException('Periode tidak ditemukan.');
  
      const startDate = new Date(period.startDate);
      const endDate = new Date(period.endDate);
      const inputDate = new Date(data.tahun || draftReport.tahun, (data.bulan || draftReport.bulan) - 1);
      if (inputDate < startDate || inputDate > endDate) {
        throw new BadRequestException('Bulan dan tahun berada di luar rentang periode.');
      }
  
      const updatedReport = await prisma.pelaporanB3Dihasilkan.update({
        where: { id },
        data: {
          tipeProduk: data.tipeProduk || undefined,
          periodId: data.periodId || undefined,
          bulan: data.bulan || undefined,
          tahun: data.tahun || undefined,
          prosesProduksi: data.prosesProduksi || undefined,
          dataBahanB3Id: data.dataBahanB3Id || undefined,
          jumlahB3Dihasilkan: data.jumlahB3Dihasilkan ?? undefined,
        },
      });
  
      return updatedReport;
    });
  } 

  async deleteDraftReport(id: string) {
    return await this.prisma.$transaction(async (prisma) => {
      const draftReport = await prisma.pelaporanB3Dihasilkan.findUnique({ where: { id } });
  
      if (!draftReport) throw new NotFoundException('Laporan draft tidak ditemukan.');
      if (!draftReport.isDraft) throw new BadRequestException('Laporan sudah difinalisasi dan tidak dapat dihapus.');
      if (draftReport.isApproved) throw new BadRequestException('Laporan sudah disetujui dan tidak dapat dihapus.');
  
      await prisma.pelaporanB3Dihasilkan.delete({ where: { id } });
  
      return { message: 'Laporan draft berhasil dihapus.' };
    });
  }

  async reviewReport(id: string, data: ReviewPelaporanBahanB3Dto) {
    const { status, adminNote } = data;
  
    if (![StatusPengajuan.DISETUJUI, StatusPengajuan.DITOLAK].includes(status)) {
      throw new BadRequestException('Status pengajuan tidak valid.');
    }
  
    return await this.prisma.$transaction(async (prisma) => {
      const report = await prisma.pelaporanB3Dihasilkan.findUnique({ where: { id } });
  
      if (!report || !report.isFinalized) {
        throw new BadRequestException('Laporan tidak valid atau belum difinalisasi.');
      }
  
      if (status === StatusPengajuan.DISETUJUI) {
        await prisma.pelaporanB3DihasilkanFinal.create({
          data: {
            companyId: report.companyId,
            tipeProduk: report.tipeProduk,
            periodId: report.periodId,
            bulan: report.bulan,
            tahun: report.tahun,
            prosesProduksi: report.prosesProduksi,
            dataBahanB3Id: report.dataBahanB3Id,
            jumlahB3Dihasilkan: report.jumlahB3Dihasilkan,
            approvedAt: new Date(),
          },
        });
  
        await prisma.pelaporanB3Dihasilkan.update({ where: { id }, data: { isApproved: true } });
      } else {
        await prisma.pelaporanB3Dihasilkan.update({ where: { id }, data: { isDraft: true, isFinalized: false } });
      }
  
      await prisma.pelaporanB3DihasilkanHistory.create({
        data: {
          pelaporanB3DihasilkanId: id,
          statusPengajuan: status,
          tanggalPengajuan: report.updatedAt,
          tanggalPenyelesaian: new Date(),
          catatanAdmin: adminNote,
        },
      });
  
      return { message: `Laporan berhasil ${status === StatusPengajuan.DISETUJUI ? 'disetujui' : 'ditolak'}.` };
    });
  }
  
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
  
      // Ambil semua laporan draft dalam periode ini
      const draftReports = await prisma.pelaporanB3Dihasilkan.findMany({
        where: {
          periodId,
          companyId,
          isDraft: true,
          isFinalized: false,
        },
      });
  
      if (draftReports.length === 0) {
        throw new BadRequestException('Tidak ada laporan draft yang siap difinalisasi dalam periode ini.');
      }
  
      // Ambil kombinasi bulan dan tahun dari laporan draft
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
  
      // Finalisasi laporan dalam periode ini
      for (const report of draftReports) {
        // Update status laporan menjadi finalized
        await prisma.pelaporanB3Dihasilkan.update({
          where: { id: report.id },
          data: {
            isDraft: false,
            isFinalized: true,
          },
        });
  
        // Tambahkan riwayat pengajuan
        await prisma.pelaporanB3DihasilkanHistory.create({
          data: {
            pelaporanB3DihasilkanId: report.id,
            statusPengajuan: StatusPengajuan.MENUNGGU_PERSETUJUAN,
            tanggalPengajuan: new Date(),
          },
        });
      }
  
      return { message: 'Semua laporan dalam periode berhasil difinalisasi dan menunggu persetujuan admin.' };
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
    const submittedReports = await this.prisma.pelaporanB3Dihasilkan.findMany({
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

  async getCompaniesWithoutFinalizedReports(periodId: string) {
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
  
    // Ambil laporan yang sudah difinalisasi dalam periode ini
    const finalizedReports = await this.prisma.pelaporanB3Dihasilkan.findMany({
      where: {
        periodId,
        isFinalized: true,
      },
      select: {
        companyId: true,
        bulan: true,
        tahun: true,
      },
    });
  
    // Buat set untuk menyimpan kombinasi (companyId, bulan, tahun) yang sudah difinalisasi
    const finalizedSet = new Set(
      finalizedReports.map((report) => `${report.companyId}-${report.bulan}-${report.tahun}`)
    );
  
    // Filter perusahaan yang belum melakukan finalisasi laporan untuk setiap bulan dalam periode
    const companiesWithoutFinalizedReports = allCompanies.filter((company) => {
      for (const { bulan, tahun } of monthsInPeriod) {
        if (!finalizedSet.has(`${company.id}-${bulan}-${tahun}`)) {
          return true;
        }
      }
      return false;
    });
  
    return {
      message: 'Daftar perusahaan yang belum melakukan finalisasi laporan.',
      companies: companiesWithoutFinalizedReports,
    };
  }
  
  
  
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