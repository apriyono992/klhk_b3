import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "./prisma.services";
import { CreatePelaporanBahanB3DistribusiDto } from "src/models/createPelaporanBahanB3DistribusiDto";
import { UpdatePelaporanBahanB3DistribusiDto } from "src/models/updatePelaporanBahanB3DistribusiDto";
import { ReviewPelaporanBahanB3Dto } from "src/models/reviewPelaporanBahanB3Dto";
import { SearchPelaporanBahanB3DistribusiDto } from "src/models/searchPelaporanBahanB3DistribusiDto";
import { StatusPengajuan } from "src/models/enums/statusPengajuanPelaporan";
import { JenisPelaporan } from "src/models/enums/jenisPelaporan";

@Injectable()
export class PelaporanDistribusiBahanB3Service {
  constructor(private readonly prisma: PrismaService) {}

  async createReport(data: CreatePelaporanBahanB3DistribusiDto) {
    const { companyId, periodId, bulan, tahun, dataBahanB3Id, jumlahB3Distribusi, dataCustomers, dataTransporters } = data;
  
    // Validasi keberadaan perusahaan
    const company = await this.prisma.company.findUnique({ where: { id: companyId } });
    if (!company) throw new NotFoundException('Perusahaan tidak ditemukan.');
  
    // Validasi keberadaan periode
    const period = await this.prisma.period.findUnique({ where: { id: periodId } });
    if (!period) throw new NotFoundException('Periode tidak ditemukan.');
  
    // Validasi apakah bulan dan tahun berada dalam rentang periode
    const startDate = new Date(period.startPeriodDate);
    const endDate = new Date(period.endPeriodDate);
    const inputDate = new Date(tahun, bulan - 1);
    if (inputDate < startDate || inputDate > endDate) {
      throw new BadRequestException('Bulan dan tahun yang dipilih berada di luar rentang periode.');
    }
  
    // Validasi keberadaan bahan B3
    const bahanB3 = await this.prisma.dataBahanB3.findUnique({ where: { id: dataBahanB3Id } });
    if (!bahanB3) throw new NotFoundException('Data bahan B3 tidak ditemukan.');
  
    // Validasi apakah laporan sudah ada
    const existingReport = await this.prisma.pelaporanBahanB3Distribusi.findFirst({
      where: { companyId, dataBahanB3Id, bulan, tahun },
    });
    if (existingReport) {
      if (existingReport.isApproved) {
        throw new BadRequestException('Laporan sudah disetujui dan tidak dapat dimodifikasi.');
      }
      throw new BadRequestException('Draft laporan sudah ada untuk bahan B3 ini pada bulan dan tahun yang sama.');
    }
  
    // Validasi data customer
    if (dataCustomers && dataCustomers.length > 0) {
      for (const customerId of dataCustomers) {
        const customer = await this.prisma.dataCustomer.findUnique({ where: { id: customerId } });
        if (!customer) {
          throw new NotFoundException(`Data customer dengan ID ${customerId} tidak ditemukan.`);
        }
      }
    }
  
    // Validasi data transporter
    if (dataTransporters && dataTransporters.length > 0) {
      for (const transporterId of dataTransporters) {
        const transporter = await this.prisma.dataTransporter.findUnique({ where: { id: transporterId } });
        if (!transporter) {
          throw new NotFoundException(`Data transporter dengan ID ${transporterId} tidak ditemukan.`);
        }
      }
    }
  
    // Membuat draft laporan distribusi bahan B3
    const draftReport = await this.prisma.pelaporanBahanB3Distribusi.create({
      data: {
        companyId,
        periodId,
        bulan,
        tahun,
        dataBahanB3Id,
        jumlahB3Distribusi,
        isDraft: true,
        DataCustomerOnPelaporanDistribusiBahanB3: {
          create: dataCustomers?.map((customerId) => ({ dataCustomerId: customerId })),
        },
        DataTransporterOnPelaporanDistribusiBahanB3: {
          create: dataTransporters?.map((transporterId) => ({ dataTransporterId: transporterId })),
        },
      },
    });
  
    return draftReport;
  }  

  async updateDraftReport(id: string, data: UpdatePelaporanBahanB3DistribusiDto) {
    return await this.prisma.$transaction(async (prisma) => {
      const draftReport = await prisma.pelaporanBahanB3Distribusi.findUnique({
        where: { id },
        include: { DataCustomerOnPelaporanDistribusiBahanB3: true, DataTransporterOnPelaporanDistribusiBahanB3: true },
      });
  
      if (!draftReport) throw new NotFoundException('Laporan draft tidak ditemukan.');
      if (!draftReport.isDraft) throw new BadRequestException('Laporan sudah difinalisasi dan tidak dapat diedit.');
      if (draftReport.isApproved) throw new BadRequestException('Laporan sudah disetujui dan tidak dapat diedit.');
  
      // Update laporan draft
      const updatedReport = await prisma.pelaporanBahanB3Distribusi.update({
        where: { id },
        data: {
          dataBahanB3Id: data.dataBahanB3Id || undefined,
          bulan: data.bulan || undefined,
          tahun: data.tahun || undefined,
          jumlahB3Distribusi: data.jumlahB3Distribusi ?? undefined,
        },
      });
  
      // Update data customer jika diberikan
      if (data.dataCustomers) {
        await prisma.dataCustomerOnPelaporanDistribusiBahanB3.deleteMany({
          where: { pelaporanBahanB3DistribusiId: id },
        });
        await prisma.dataCustomerOnPelaporanDistribusiBahanB3.createMany({
          data: data.dataCustomers.map((customerId) => ({
            pelaporanBahanB3DistribusiId: id,
            dataCustomerId: customerId,
          })),
        });
      }
  
      // Update data transporter jika diberikan
      if (data.dataTransporters) {
        await prisma.dataTransporterOnPelaporanDistribusiBahanB3.deleteMany({
          where: { pelaporanBahanB3DistribusiId: id },
        });
        await prisma.dataTransporterOnPelaporanDistribusiBahanB3.createMany({
          data: data.dataTransporters.map((transporterId) => ({
            pelaporanBahanB3DistribusiId: id,
            dataTransporterId: transporterId,
          })),
        });
      }
  
      return updatedReport;
    });
  }
  
  async finalizeReportsForPeriod(companyId: string, periodId: string) {
    return await this.prisma.$transaction(async (prisma) => {
      // Cek apakah periode valid
      const period = await prisma.period.findUnique({ where: { id: periodId, } });
      if (!period) throw new NotFoundException('Periode tidak ditemukan.');
  
      // Ambil rentang tanggal periode
      const startDate = new Date(period.startPeriodDate);
      const endDate = new Date(period.endPeriodDate);
  
      // Dapatkan semua bulan dan tahun dalam rentang periode
      const monthsInPeriod = this.getMonthsBetweenDates(startDate, endDate);
  
      // Ambil laporan draft dalam periode ini
      const draftReports = await prisma.pelaporanBahanB3Distribusi.findMany({
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
  
      // Cek apakah semua bulan dalam periode sudah dilaporkan
      const reportedMonths = draftReports.map((report) => `${report.bulan}-${report.tahun}`);
      const missingMonths = monthsInPeriod.filter(
        (month) => !reportedMonths.includes(`${month.bulan}-${month.tahun}`)
      );
  
      if (missingMonths.length > 0) {
        const missingMonthString = missingMonths
          .map((m) => `Bulan ${m.bulan} Tahun ${m.tahun}`)
          .join(', ');
        throw new BadRequestException(`Laporan belum lengkap. Bulan yang belum dilaporkan: ${missingMonthString}.`);
      }
  
      // Finalisasi laporan
      for (const report of draftReports) {
        await prisma.pelaporanBahanB3Distribusi.update({
          where: { id: report.id },
          data: {
            isDraft: false,
            isFinalized: true,
            status:StatusPengajuan.MENUNGGU_PERSETUJUAN
          },
        });
  
        await prisma.pelaporanBahanB3DistribusiHistory.create({
          data: {
            pelaporanBahanB3DistribusiId: report.id,
            statusPengajuan: StatusPengajuan.MENUNGGU_PERSETUJUAN,
            tanggalPengajuan: new Date(),
          },
        });
      }
  
      return { message: 'Semua laporan dalam periode berhasil difinalisasi dan menunggu persetujuan admin.' };
    });
  }
  
  async reviewReport(id: string, data: ReviewPelaporanBahanB3Dto) {
    const { status, adminNote } = data;
  
    if (![StatusPengajuan.DISETUJUI, StatusPengajuan.DITOLAK].includes(status)) {
      throw new BadRequestException('Status pengajuan tidak valid.');
    }
  
    return await this.prisma.$transaction(async (prisma) => {
      const report = await prisma.pelaporanBahanB3Distribusi.findUnique({
        where: { id },
        include: {
          DataCustomerOnPelaporanDistribusiBahanB3: { include: { dataCustomer: true } },
          DataTransporterOnPelaporanDistribusiBahanB3: { include: { dataTransporter: true } },
        },
      });
  
      if (!report || !report.isFinalized) {
        throw new BadRequestException('Laporan tidak valid atau belum difinalisasi.');
      }
  
      if (status === StatusPengajuan.DISETUJUI) {
        // Buat laporan final
        const final = await prisma.pelaporanBahanB3DistribusiFinal.create({
          data: {
            companyId: report.companyId,
            periodId: report.periodId,
            bulan: report.bulan,
            tahun: report.tahun,
            dataBahanB3Id: report.dataBahanB3Id,
            jumlahB3Distribusi: report.jumlahB3Distribusi,
            approveAt: new Date(),
          },
        });
  
        // Mengurangi stok di `DataBahanB3Company`
        const bahanB3Company = await prisma.dataBahanB3Company.upsert({
          where: {
            companyId_dataBahanB3Id: {
              companyId: report.companyId,
              dataBahanB3Id: report.dataBahanB3Id,
            },
          },
          update: {
            stokB3: {
              decrement: report.jumlahB3Distribusi,
            },
          },
          create: {
            companyId: report.companyId,
            dataBahanB3Id: report.dataBahanB3Id,
            stokB3: -report.jumlahB3Distribusi,
          },
        });
  
        // Validasi stok perusahaan tidak boleh negatif
        if (bahanB3Company.stokB3 < 0) {
          throw new BadRequestException('Stok perusahaan tidak mencukupi. Persetujuan laporan ditolak.');
        }
  
        // Simpan riwayat perubahan stok di `StokB3History`
        await prisma.stokB3History.create({
          data: {
            dataBahanB3CompanyId: bahanB3Company.id,
            previousStokB3: bahanB3Company.stokB3 + report.jumlahB3Distribusi,
            newStokB3: bahanB3Company.stokB3,
            changeDate: new Date(),
          },
        });
  
        // Mengurangi stok di `StokB3Periode`
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
              decrement: report.jumlahB3Distribusi,
            },
          },
          create: {
            companyId: report.companyId,
            dataBahanB3Id: report.dataBahanB3Id,
            bulan: report.bulan,
            tahun: report.tahun,
            stokB3: -report.jumlahB3Distribusi,
          },
        });
  
        // Validasi stok periode tidak boleh negatif
        if (stokPeriode.stokB3 < 0) {
          throw new BadRequestException('Stok periode tidak mencukupi. Persetujuan laporan ditolak.');
        }
  
        // Simpan riwayat perubahan stok periode di `StokB3PeriodeHistory`
        await prisma.stokB3PeriodeHistory.create({
          data: {
            stokB3PeriodeId: stokPeriode.id,
            previousStokB3: stokPeriode.stokB3 + report.jumlahB3Distribusi,
            newStokB3: stokPeriode.stokB3,
            changeDate: new Date(),
          },
        });
  
        // Update status laporan menjadi disetujui
        await prisma.pelaporanBahanB3Distribusi.update({
          where: { id },
          data: { isApproved: true, status: status },
        });
      } else {
        // Jika laporan ditolak, ubah status menjadi draft
        await prisma.pelaporanBahanB3Distribusi.update({
          where: { id },
          data: { isDraft: true, isFinalized: false, status: status },
        });
      }

      const kewajiban = await prisma.kewajibanPelaporanPerusahaan.findFirst(
        {
          where: { bulan: report.bulan, tahun: report.tahun, companyId: report.companyId, jenisLaporan: JenisPelaporan.DISTRIBUSI_B3 },
        }
      )
      // Tandai laporan sebagai disetujui
      await prisma.kewajibanPelaporanPerusahaan.update({
        where: { id: kewajiban.id},
        data: { sudahDilaporkan: true },
      });
  
      // Simpan riwayat pengajuan
      await prisma.pelaporanBahanB3DistribusiHistory.create({
        data: {
          pelaporanBahanB3DistribusiId: id,
          statusPengajuan: status,
          tanggalPengajuan: report.updatedAt,
          tanggalPenyelesaian: new Date(),
          catatanAdmin: adminNote,
        },
      });
  
      return { message: `Laporan berhasil ${status === StatusPengajuan.DISETUJUI ? 'disetujui' : 'ditolak'}.` };
    });
  }
  
  async searchReports(dto: SearchPelaporanBahanB3DistribusiDto) {
    const {
      companyId,
      periodId,
      dataBahanB3Id,
      bidangUsaha,
      tipePerusahaan,
      longitude,
      latitude,
      provinceId,
      regencyId,
      districtId,
      villageId,
      startDate,
      endDate,
      page = 1,
      limit = 10,
      returnAll = false,
    } = dto;
  
    const whereConditions: any = {};
  
    // Filter berdasarkan laporan
    if (companyId) whereConditions.companyId = companyId;
    if (periodId) whereConditions.periodId = periodId;
    if (dataBahanB3Id) whereConditions.dataBahanB3Id = dataBahanB3Id;
    if (startDate || endDate) {
      whereConditions.bulan = {
        ...(startDate && { gte: startDate.getMonth() + 1 }),
        ...(endDate && { lte: endDate.getMonth() + 1 }),
      };
      whereConditions.tahun = {
        ...(startDate && { gte: startDate.getFullYear() }),
        ...(endDate && { lte: endDate.getFullYear() }),
      };
    }
  
    // Filter perusahaan
    const companyConditions: any = {};
    if (bidangUsaha) companyConditions.bidangUsaha = bidangUsaha;
    if (tipePerusahaan) companyConditions.tipePerusahaan = { hasSome: tipePerusahaan };
    if (longitude) companyConditions.longitude = longitude;
    if (latitude) companyConditions.latitude = latitude;
    if (provinceId) companyConditions.provinceId = provinceId;
    if (regencyId) companyConditions.regencyId = regencyId;
    if (districtId) companyConditions.districtId = districtId;
    if (villageId) companyConditions.villageId = villageId;
  
    // Query perusahaan yang memenuhi kondisi
    const companies = await this.prisma.company.findMany({
      where: companyConditions,
      select: { id: true },
    });
  
    // Ambil daftar `companyId` yang valid
    const companyIds = companies.map((company) => company.id);
  
    // Tambahkan filter `companyId` pada laporan
    if (companyIds.length > 0) {
      whereConditions.companyId = { in: companyIds };
    } else {
      // Jika tidak ada perusahaan yang memenuhi filter, kembalikan hasil kosong
      return {
        message: 'Data laporan berhasil ditemukan.',
        data: [],
        pagination: returnAll ? null : { totalRecords: 0, currentPage: page, totalPages: 0 },
      };
    }
  
    // Query laporan dengan filter yang diberikan
    const reports = await this.prisma.pelaporanBahanB3Distribusi.findMany({
      where: whereConditions,
      include: {
        company: true,
        period: true,
        dataBahanB3: true,
        PelaporanBahanB3DistribusiHistory:true
      },
      ...(returnAll ? {} : { skip: (page - 1) * limit, take: limit }),
    });
  
    // Hitung total records
    const totalRecords = returnAll ? reports.length : await this.prisma.pelaporanBahanB3Distribusi.count({ where: whereConditions });
  
    return {
      message: 'Data laporan berhasil ditemukan.',
      data: reports,
      pagination: returnAll ? null : { totalRecords, currentPage: page, totalPages: Math.ceil(totalRecords / limit) },
    };
  }
  
  async getReportById(id: string) {
    const report = await this.prisma.pelaporanBahanB3Distribusi.findUnique({
      where: { id },
      include: {
        company: true,
        period: true,
        dataBahanB3: true,
        DataCustomerOnPelaporanDistribusiBahanB3: { include: { dataCustomer: true } },
        DataTransporterOnPelaporanDistribusiBahanB3: { include: { dataTransporter: true } },
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