import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "./prisma.services";
import { CreatePelaporanBahanB3DistribusiDto } from "src/models/createPelaporanBahanB3DistribusiDto";
import { UpdatePelaporanBahanB3DistribusiDto } from "src/models/updatePelaporanBahanB3DistribusiDto";
import { ReviewPelaporanBahanB3Dto } from "src/models/reviewPelaporanBahanB3Dto";

@Injectable()
export class PelaporanBahanB3DihasilkanService {
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
    const startDate = new Date(period.startDate);
    const endDate = new Date(period.endDate);
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
      const startDate = new Date(period.startDate);
      const endDate = new Date(period.endDate);
  
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
      const report = await prisma.pelaporanBahanB3Distribusi.findUnique({ where: { id }, include:{
        DataCustomerOnPelaporanDistribusiBahanB3:{ include: { dataCustomer:true}},
        DataTransporterOnPelaporanDistribusiBahanB3:{ include: { dataTransporter:true}}
      } });
  
      if (!report || !report.isFinalized) {
        throw new BadRequestException('Laporan tidak valid atau belum difinalisasi.');
      }
  
      if (status === StatusPengajuan.DISETUJUI) {
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

        // Salin data transporter ke DataTransporterFinal
        for (const transporter of report.DataTransporterOnPelaporanDistribusiBahanB3) {
            await prisma.dataTransporterFinal.create({
            data: {
                pelaporanId: final.id,
                namaTransporter: transporter.dataTransporter.namaTransPorter,
                alamat: transporter.dataTransporter.alamat,
                email: transporter.dataTransporter.email,
                telepon: transporter.dataTransporter.telepon,
                fax: transporter.dataTransporter.fax,
                longitude: transporter.dataTransporter.longitude,
                latitude: transporter.dataTransporter.latitude,
                companyId: transporter.dataTransporter.companyId,
                provinceId: transporter.dataTransporter.provinceId,
                regencyId: transporter.dataTransporter.regencyId,
                districtId: transporter.dataTransporter.districtId,
                villageId: transporter.dataTransporter.villageId,
            },
            });
        }
  
        // Salin data customer ke DataCustomerFinal
        for (const customer of report.DataCustomerOnPelaporanDistribusiBahanB3) {
            await prisma.dataCustomerFinal.create({
            data: {
                pelaporanId: final.id,
                namaCustomer: customer.dataCustomer.namaCustomer,
                alamat: customer.dataCustomer.alamat,
                email: customer.dataCustomer.email,
                telepon: customer.dataCustomer.telepon,
                fax: customer.dataCustomer.fax,
                longitude: customer.dataCustomer.longitude,
                latitude: customer.dataCustomer.latitude,
                companyId: customer.dataCustomer.companyId,
                provinceId: customer.dataCustomer.provinceId,
                regencyId: customer.dataCustomer.regencyId,
                districtId: customer.dataCustomer.districtId,
                villageId: customer.dataCustomer.villageId,
            },
            });
        }
    
        await prisma.pelaporanBahanB3Distribusi.update({
        where: { id },
        data: { isApproved: true },
        });
        } else {
            await prisma.pelaporanBahanB3Distribusi.update({
            where: { id },
            data: { isDraft: true, isFinalized: false },
            });
        }
    
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