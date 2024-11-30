import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "./prisma.services";
import { CreatePelaporanBahanB3DihasilkanDto } from "src/models/createPelaporanBahanB3DihasilkanDto";
import { UpdatePelaporanB3DihasilkanDto } from "src/models/updatePelaporanBahanB3DihasilkanDto";
import { ReviewPelaporanBahanB3Dto } from "src/models/reviewPelaporanBahanB3Dto";
import { SearchPelaporanB3DihasilkanDto } from "src/models/searchPelaporanBahanB3DihasilkanDto";
import { StatusPengajuan } from "src/models/enums/statusPengajuanPelaporan";
import { JenisPelaporan } from "src/models/enums/jenisPelaporan";

@Injectable()
export class PelaporanBahanB3DihasilkanService {
  constructor(private readonly prisma: PrismaService) {}

  async createReport(data: CreatePelaporanBahanB3DihasilkanDto) {
    const { companyId, tipeProduk, periodId, bulan, tahun, prosesProduksi, dataBahanB3Id, jumlahB3Dihasilkan } = data;
  
    const period = await this.prisma.period.findUnique({ where: { id: periodId } });
    if (!period) throw new NotFoundException('Periode tidak ditemukan.');

    // Ensure the report is created within the allowed period
    const currentDate = new Date();
    if (currentDate < period.startReportingDate || currentDate > period.endReportingDate) {
      throw new BadRequestException('Current date is outside the reporting period.');
    }
  
    const startDate = new Date(period.startPeriodDate);
    const endDate = new Date(period.endPeriodDate);
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
  
      const startDate = new Date(period.startPeriodDate);
      const endDate = new Date(period.endPeriodDate);
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
      const report = await prisma.pelaporanB3Dihasilkan.findUnique({ where: { id }, include: {period:true} });
  
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

        const bahanB3Company = await prisma.dataBahanB3Company.upsert({
          where: {
            companyId_dataBahanB3Id: {
              companyId: report.companyId,
              dataBahanB3Id: report.dataBahanB3Id,
            },
          },
          update: {
            stokB3: {
              increment: report.jumlahB3Dihasilkan,
            },
          },
          create: {
            companyId: report.companyId,
            dataBahanB3Id: report.dataBahanB3Id,
            stokB3: report.jumlahB3Dihasilkan,
          },
        });

        const newStokCompany = bahanB3Company.stokB3;
        if (newStokCompany < 0) {
          throw new BadRequestException('Stok perusahaan tidak mencukupi. Persetujuan laporan ditolak.');
        }
        
        // Simpan riwayat perubahan stok di `StokB3History`
        await prisma.stokB3History.create({
          data: {
            dataBahanB3CompanyId: bahanB3Company.id,
            previousStokB3: bahanB3Company.stokB3 - report.jumlahB3Dihasilkan,
            newStokB3: bahanB3Company.stokB3,
            changeDate: new Date(),
          },
        });

        // Menggunakan upsert untuk `StokB3Periode`
        const stokPeriode = await prisma.stokB3Periode.upsert({
          where: {
            companyId_dataBahanB3Id_bulan_tahun: {
              companyId: report.companyId,
              dataBahanB3Id: report.dataBahanB3Id,
              bulan: report.bulan,
              tahun: report.tahun,
            },
          },
          update: {
            stokB3: {
              increment: report.jumlahB3Dihasilkan,
            },
          },
          create: {
            companyId: report.companyId,
            dataBahanB3Id: report.dataBahanB3Id,
            bulan: report.bulan,
            tahun: report.tahun,
            stokB3: report.jumlahB3Dihasilkan,
          },
        });

        const newStokPeriode = stokPeriode.stokB3;
        if (newStokPeriode < 0) {
          throw new BadRequestException('Stok periode tidak mencukupi. Persetujuan laporan ditolak.');
        }
  
        await prisma.stokB3PeriodeHistory.create({
          data: {
            stokB3PeriodeId: stokPeriode.id,
            previousStokB3: stokPeriode.stokB3 - report.jumlahB3Dihasilkan,
            newStokB3: stokPeriode.stokB3,
            changeDate: new Date(),
          },
        });
        await prisma.pelaporanB3Dihasilkan.update({ where: { id }, data: { isApproved: true, status: status} });
      } else {
        await prisma.pelaporanB3Dihasilkan.update({ where: { id }, data: { isDraft: true, isFinalized: false , status: status} });
      }

      const kewajiban = await prisma.kewajibanPelaporanPerusahaan.findFirst({
        where: {
            bulan: report.bulan,
            tahun: report.tahun,
            companyId: report.companyId,
            jenisLaporan: JenisPelaporan.PRODUKSI_B3,
        },
    });
    
    if (kewajiban) {
        // Jika data ditemukan, perbarui
        await prisma.kewajibanPelaporanPerusahaan.update({
            where: { id: kewajiban.id },
            data: {
                sudahDilaporkan: true,
            },
        });
    } else {
        // Jika data tidak ditemukan, buat data baru
        await prisma.kewajibanPelaporanPerusahaan.create({
            data: {
                bulan: report.bulan,
                tahun: report.tahun,
                companyId: report.companyId,
                jenisLaporan: JenisPelaporan.PRODUKSI_B3,
                sudahDilaporkan: true,
                periodId: report.periodId,
                tanggalBatas: report.period.endReportingDate,
            },
        });
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
      const startDate = new Date(period.startPeriodDate);
      const endDate = new Date(period.endPeriodDate);
  
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
            status: StatusPengajuan.MENUNGGU_PERSETUJUAN,
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
    const startDate = new Date(period.startPeriodDate);
    const endDate = new Date(period.endPeriodDate);
  
    // Dapatkan semua bulan dan tahun dalam rentang periode
    const monthsInPeriod = this.getMonthsBetweenDates(startDate, endDate);
  
    // Ambil semua perusahaan yang terdaftar
    const allCompanies = await this.prisma.company.findMany({
    });
  
    // Ambil laporan yang sudah diajukan dalam periode ini
    const submittedReports = await this.prisma.pelaporanB3Dihasilkan.findMany({
      where: {
        periodId,
      },
      select: {
        company: true,
        bulan: true,
        tahun: true,
      },
    });
  
    // Buat set untuk menyimpan kombinasi (companyId, bulan, tahun) yang sudah dilaporkan
    const reportedSet = new Set(
      submittedReports.map((report) => `${report.company.id}-${report.bulan}-${report.tahun}`)
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
    const startDate = new Date(period.startPeriodDate);
    const endDate = new Date(period.endPeriodDate);
  
    // Dapatkan semua bulan dan tahun dalam rentang periode
    const monthsInPeriod = this.getMonthsBetweenDates(startDate, endDate);
  
    // Ambil semua perusahaan yang terdaftar
    const allCompanies = await this.prisma.company.findMany({
    });
  
    // Ambil laporan yang sudah difinalisasi dalam periode ini
    const finalizedReports = await this.prisma.pelaporanB3Dihasilkan.findMany({
      where: {
        periodId,
        isFinalized: true,
      },
      select: {
        company: true,
        bulan: true,
        tahun: true,
      },
    });
  
    // Buat set untuk menyimpan kombinasi (companyId, bulan, tahun) yang sudah difinalisasi
    const finalizedSet = new Set(
      finalizedReports.map((report) => `${report.company.id}-${report.bulan}-${report.tahun}`)
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

  async searchReports(dto: SearchPelaporanB3DihasilkanDto) {
    const {
        companyId,
        periodId,
        dataBahanB3Id,
        tipeProduk,
        startDate,
        endDate,
        page = 1,
        limit = 10,
        sortBy = 'createdAt',
        sortOrder = 'DESC',
        returnAll = false,
        isFinalize
    } = dto;

    // Query conditions
    const whereConditions: any = {};

    // Filter by companyId
    if (companyId && companyId.length > 0) {
        whereConditions.companyId = { in: companyId };
    }

    // Filter by periodId
    if (periodId && periodId.length > 0) {
        whereConditions.periodId = { in: periodId };
    }

    // Filter by dataBahanB3Id
    if (dataBahanB3Id) {
        whereConditions.dataBahanB3Id = dataBahanB3Id;
    }

    // Filter by tipeProduk
    if (tipeProduk) {
        whereConditions.tipeProduk = tipeProduk;
    }

    // Filter by startDate and endDate (bulan dan tahun)
    if (startDate || endDate) {
        const startMonth = startDate ? startDate.getMonth() + 1 : undefined;
        const startYear = startDate ? startDate.getFullYear() : undefined;
        const endMonth = endDate ? endDate.getMonth() + 1 : undefined;
        const endYear = endDate ? endDate.getFullYear() : undefined;

        if (startMonth || endMonth) {
            whereConditions.bulan = {
                ...(startMonth && { gte: startMonth }),
                ...(endMonth && { lte: endMonth }),
            };
        }

        if (startYear || endYear) {
            whereConditions.tahun = {
                ...(startYear && { gte: startYear }),
                ...(endYear && { lte: endYear }),
            };
        }
    }
    if(isFinalize !== undefined){
      whereConditions.isFinalized = isFinalize;
    }

    // Handle sorting dynamically
    const orderBy = {};
    if (sortBy) {
        orderBy[sortBy] = sortOrder.toLowerCase();
    }

    // If `returnAll` is true, fetch all data without pagination
    const reports = await this.prisma.pelaporanB3Dihasilkan.findMany({
        where: whereConditions,
        orderBy,
        ...(returnAll ? {} : { skip: (Math.max(page - 1, 0)) * Math.max(limit, 1), take: Math.max(limit, 1) }),
        include: {
            company: true,
            period: true,
            dataBahanB3: true,
            PelaporanB3DihasilkanHistory: true,
        },
    });

    // Count total records only if `returnAll` is false
    const totalRecords = returnAll
        ? reports.length
        : await this.prisma.pelaporanB3Dihasilkan.count({ where: whereConditions });

    // Return response
    return {
        message: 'Data laporan berhasil ditemukan.',
        data: reports,
        pagination: returnAll
            ? null
            : {
                  totalRecords,
                  currentPage: page,
                  totalPages: Math.ceil(totalRecords / limit),
              },
    };
  }

  async getReportById(id: string) {
    const report = await this.prisma.pelaporanB3Dihasilkan.findUnique({
      where: { id },
      include: {
        company: true,
        period: true,
        dataBahanB3: true,
        PelaporanB3DihasilkanHistory:true
      },
    });
  
    if (!report) {
      throw new NotFoundException('Laporan tidak ditemukan.');
    }
  
    return report;
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