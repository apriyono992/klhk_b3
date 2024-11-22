import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from './prisma.services';
import { CreatePeriodDto } from 'src/models/createPeriodDto';
import { TipePerusahaan } from 'src/models/enums/tipePerusahaan';
import { JenisPelaporan } from 'src/models/enums/jenisPelaporan';
import { PaginationDto } from 'src/models/paginationDto';
import { SearchApplicationsWithPaginationDto } from 'src/models/searchApplicationsWithPaginationDto';
import { SearchRegistrationsWithPaginationDto } from 'src/models/searchRegistrationsWithPaginationDto';
import { SearchCompaniesReportWithPaginationDto } from 'src/models/searchCompaniesReportWithPaginationDto';

@Injectable()
export class PeriodService {
  constructor(private readonly prisma: PrismaService) {}

  // Create a new reporting period and set it as active if requested
  // Create a new reporting period and set it as active if requested (using a transaction)
  async createPeriod(data: CreatePeriodDto) {
    const { startPeriodDate, startReportingDate, endReportingDate, endPeriodDate, isReportingActive, finalizationDeadline, isActive, name } = data;

    // Validasi 1: Tanggal awal periode harus sebelum tanggal akhir periode
    if (new Date(startPeriodDate) >= new Date(endPeriodDate)) {
      throw new BadRequestException('Tanggal awal periode harus sebelum tanggal akhir periode.');
    }

    // Validasi 2: Tanggal awal periode harus sebelum tanggal awal pelaporan
    if (new Date(startPeriodDate) >= new Date(startReportingDate)) {
      throw new BadRequestException('Tanggal awal periode harus sebelum tanggal awal pelaporan.');
    }

    // Validasi 3: Tanggal awal pelaporan harus sebelum tanggal akhir pelaporan
    if (new Date(startReportingDate) >= new Date(endReportingDate)) {
      throw new BadRequestException('Tanggal awal pelaporan harus sebelum tanggal akhir pelaporan.');
    }

    // Validasi 4: Tanggal akhir periode harus sebelum tanggal akhir pelaporan
    if (new Date(endPeriodDate) >= new Date(endReportingDate)) {
      throw new BadRequestException('Tanggal akhir periode harus sebelum tanggal akhir pelaporan.');
    }

    // Validasi 5: Batas waktu finalisasi harus sebelum tanggal akhir pelaporan
    if (new Date(finalizationDeadline) <= new Date(endReportingDate)) {
      throw new BadRequestException('Batas waktu finalisasi harus setelah tanggal akhir pelaporan.');
    }

    // Validasi 6: Pastikan periode tidak saling berpotongan
  const overlappingPeriods = await this.prisma.period.findMany({
    where: {
      OR: [
        {
          startPeriodDate: { lte: new Date(endPeriodDate) },
          endPeriodDate: { gte: new Date(startPeriodDate) },
        },
        {
          startPeriodDate: { lte: new Date(endPeriodDate) },
          endPeriodDate: { gte: new Date(startPeriodDate) },
        },
      ],
    },
  });

  if (overlappingPeriods.length > 0) {
    throw new BadRequestException('Periode yang Anda buat bertabrakan dengan periode lain.');
  }


    // Memulai transaksi Prisma
    return await this.prisma.$transaction(async (prisma) => {
      // Jika isActive adalah true, nonaktifkan periode aktif lainnya
      if (isActive) {
        await prisma.period.updateMany({
          where: { isActive: true },
          data: { isActive: false },
        });
      }

      // Buat periode baru
      const newPeriod = await prisma.period.create({
        data: {
          name,
          startPeriodDate,
          endPeriodDate,
          startReportingDate,
          endReportingDate,
          finalizationDeadline,
          isActive,
          isReportingActive
        },
      });

      // Jika periode baru diaktifkan, buat kewajiban pelaporan
      if (isActive) {
        await this.buatKewajibanPelaporan(prisma, newPeriod.id);
      }

      return newPeriod;
    });
  }


  // Set an existing period as active and deactivate others (using a transaction)
  async setActivePeriod(periodId: string) {
    const period = await this.prisma.period.findUnique({ where: { id: periodId } });
    if (!period) throw new NotFoundException('Period not found.');

    // Validasi: Pastikan tanggal hari ini setelah atau sama dengan startPeriodDate
    const today = new Date();
    const startPeriodDate = new Date(period.startPeriodDate);

    if (today < startPeriodDate) {
      throw new BadRequestException(
        `Periode tidak dapat diaktifkan karena tanggal mulai periode (${period.startPeriodDate}) lebih besar dari hari ini (${today.toISOString().split('T')[0]}).`
      );
    }

    // Memulai transaksi Prisma
    return await this.prisma.$transaction(async (prisma) => {
      // Nonaktifkan semua periode yang sedang aktif
      await prisma.period.updateMany({
        where: { isActive: true },
        data: { isActive: false },
      });

      // Aktifkan periode yang dipilih
      const updatedPeriod = await prisma.period.update({
        where: { id: periodId },
        data: { isActive: true },
      });

      // Buat kewajiban pelaporan di dalam transaksi
      await this.buatKewajibanPelaporan(prisma, periodId);

      return updatedPeriod;
    });
  }


  // Get the currently active period
  async getActivePeriod() {
    const activePeriod = await this.prisma.period.findFirst({ where: { isActive: true } });
    if (!activePeriod) throw new NotFoundException('No active period found.');
    return activePeriod;
  }

  // Get a list of all periods, ordered by startDate
  async getAllPeriods() {
      return this.prisma.period.findMany({
          orderBy: { startPeriodDate: 'asc' },
      });
  }

    // Get all PelaporanPengangkutan under a specific period
  async getReportsByPeriod(periodId: string) {
    // Ensure the period exists
    const period = await this.prisma.period.findUnique({ where: { id: periodId } });
    if (!period) throw new NotFoundException('Period not found.');

    // Fetch all PelaporanPengangkutan under the specified period
    return this.prisma.pelaporanPengangkutan.findMany({
      where: { periodId },
      include: {
        application: true,         // Include related Application information if needed
        vehicle: true,             // Include related Vehicle information if needed
        pengangkutanDetails: true, // Include related PengangkutanDetails if needed
      },
    });
  }

  async buatKewajibanPelaporan(prisma: any, periodId: string) {
    // Ambil data periode termasuk `endDate` sebagai batas waktu
    const period = await prisma.period.findUnique({
      where: { id: periodId },
    });
    if (!period) throw new Error('Periode tidak ditemukan.');
  
    const startDate = new Date(period.startDate);
    const endDate = new Date(period.endDate);
    const companies = await prisma.company.findMany();
    const endDateReport = new Date(period.endReportingDate);

  
    // Fungsi untuk menghasilkan daftar bulan dan tahun dalam periode
    const generateMonthsInRange = (start: Date, end: Date) => {
      const months = [];
      const current = new Date(start);
  
      while (current <= end) {
        months.push({
          bulan: current.getMonth() + 1, // Bulan dalam format 1-12
          tahun: current.getFullYear(),
        });
        current.setMonth(current.getMonth() + 1); // Pindah ke bulan berikutnya
      }
  
      return months;
    };
  
    // Buat daftar bulan dan tahun dalam periode
    const monthsInRange = generateMonthsInRange(startDate, endDate);
  
    for (const company of companies) {
      const kewajibanPerusahaan = [];
      const kewajibanAplikasi = [];
      const kewajibanRegistrasi = [];
  
      // Buat kewajiban pelaporan per perusahaan berdasarkan tipe perusahaan
      for (const { bulan, tahun } of monthsInRange) {
        if (company.tipePerusahaan.includes(TipePerusahaan.PERUSAHAAN_PRODUSEN)) {
          kewajibanPerusahaan.push(
            {
              jenisLaporan: JenisPelaporan.PENGGUNAAN_BAHAN_B3,
              companyId: company.id,
              periodId,
              tanggalBatas: endDateReport, // Batas waktu tetap `endDate` periode
              bulan,
              tahun,
            },
            {
              jenisLaporan: JenisPelaporan.PRODUKSI_B3,
              companyId: company.id,
              periodId,
              tanggalBatas: endDateReport,
              bulan,
              tahun,
            }
          );
        }
        if (company.tipePerusahaan.includes(TipePerusahaan.PERUSAHAAN_PENGGUNA)) {
          kewajibanPerusahaan.push({
            jenisLaporan: JenisPelaporan.PENGGUNAAN_BAHAN_B3,
            companyId: company.id,
            periodId,
            tanggalBatas: endDateReport,
            bulan,
            tahun,
          });
        }
        if (company.tipePerusahaan.includes(TipePerusahaan.PERUSAHAAN_DISTRIBUTOR)) {
          kewajibanPerusahaan.push({
            jenisLaporan: JenisPelaporan.DISTRIBUSI_B3,
            companyId: company.id,
            periodId,
            tanggalBatas: endDateReport,
            bulan,
            tahun,
          });
        }
        if (company.tipePerusahaan.includes(TipePerusahaan.PERUSAHAAN_IMPOR)) {
          kewajibanPerusahaan.push({
            jenisLaporan: JenisPelaporan.PENGGUNAAN_BAHAN_B3,
            companyId: company.id,
            periodId,
            tanggalBatas: endDateReport,
            bulan,
            tahun,
          });
        }
      }
  
      // Buat kewajiban pelaporan per perusahaan
      await prisma.kewajibanPelaporanPerusahaan.createMany({
        data: kewajibanPerusahaan,
        skipDuplicates: true,
      });
  
      // Buat kewajiban pelaporan per aplikasi (per kendaraan)
      const applications = await prisma.application.findMany({
        where: { companyId: company.id, status: 'SELESAI' },
        include: { vehicles: true },
      });
  
      for (const application of applications) {
        for (const vehicle of application.vehicles) {
          for (const { bulan, tahun } of monthsInRange) {
            kewajibanAplikasi.push({
              applicationId: application.id,
              companyId: company.id,
              periodId,
              vehicleId: vehicle.id,
              sudahDilaporkan: false,
              tanggalBatas: endDateReport,
              bulan,
              tahun,
            });
          }
        }
      }
  
      await prisma.kewajibanPelaporanAplikasi.createMany({
        data: kewajibanAplikasi,
        skipDuplicates: true,
      });
  
      // Buat kewajiban pelaporan registrasi
      const registrations = await prisma.registrasi.findMany({
        where: { companyId: company.id, status: 'SELESAI' },
      });
  
      for (const registrasi of registrations) {
        for (const { bulan, tahun } of monthsInRange) {
          kewajibanRegistrasi.push({
            registrasiId: registrasi.id,
            companyId: company.id,
            periodId,
            sudahDilaporkan: false,
            tanggalBatas: endDateReport,
            bulan,
            tahun,
          });
        }
      }
  
      await prisma.kewajibanPelaporanRegistrasi.createMany({
        data: kewajibanRegistrasi,
        skipDuplicates: true,
      });
    }
  }
  
  // Method untuk menambahkan satu perusahaan ke kewajiban
  async tambahKewajibanPerusahaan(periodId: string, companyId: string) {
    // Ambil data periode
    const period = await this.prisma.period.findUnique({
      where: { id: periodId },
    });
    if (!period) {
      throw new BadRequestException('Periode tidak ditemukan.');
    }

    const startDate = new Date(period.startPeriodDate);
    const endDate = new Date(period.endPeriodDate);

    // Ambil data perusahaan
    const company = await this.prisma.company.findUnique({
      where: { id: companyId },
    });
    if (!company) {
      throw new BadRequestException('Perusahaan tidak ditemukan.');
    }

    // Fungsi untuk menghasilkan daftar bulan dan tahun dalam periode
    const generateMonthsInRange = (start: Date, end: Date) => {
      const months = [];
      const current = new Date(start);

      while (current <= end) {
        months.push({
          bulan: current.getMonth() + 1, // Bulan dalam format 1-12
          tahun: current.getFullYear(), // Tahun
        });
        current.setMonth(current.getMonth() + 1); // Pindah ke bulan berikutnya
      }

      return months;
    };

    // Daftar bulan dan tahun dalam rentang periode
    const monthsInRange = generateMonthsInRange(startDate, endDate);

    // Kewajiban Perusahaan
    const kewajibanPerusahaan = [];
    for (const { bulan, tahun } of monthsInRange) {
      if (company.tipePerusahaan.includes('PERUSAHAAN_PRODUSEN')) {
        kewajibanPerusahaan.push(
          {
            jenisLaporan: 'PENGGUNAAN_BAHAN_B3',
            companyId: company.id,
            periodId,
            tanggalBatas: endDate,
            bulan,
            tahun,
          },
          {
            jenisLaporan: 'PRODUKSI_B3',
            companyId: company.id,
            periodId,
            tanggalBatas: endDate,
            bulan,
            tahun,
          }
        );
      }
      if (company.tipePerusahaan.includes('PERUSAHAAN_PENGGUNA')) {
        kewajibanPerusahaan.push({
          jenisLaporan: 'PENGGUNAAN_BAHAN_B3',
          companyId: company.id,
          periodId,
          tanggalBatas: endDate,
          bulan,
          tahun,
        });
      }
      if (company.tipePerusahaan.includes('PERUSAHAAN_DISTRIBUTOR')) {
        kewajibanPerusahaan.push({
          jenisLaporan: 'DISTRIBUSI_B3',
          companyId: company.id,
          periodId,
          tanggalBatas: endDate,
          bulan,
          tahun,
        });
      }
      if (company.tipePerusahaan.includes('PERUSAHAAN_IMPOR')) {
        kewajibanPerusahaan.push({
          jenisLaporan: 'PENGGUNAAN_BAHAN_B3',
          companyId: company.id,
          periodId,
          tanggalBatas: endDate,
          bulan,
          tahun,
        });
      }
    }

    await this.prisma.kewajibanPelaporanPerusahaan.createMany({
      data: kewajibanPerusahaan,
      skipDuplicates: true,
    });

    // Kewajiban Aplikasi
    const kewajibanAplikasi = [];
    const applications = await this.prisma.application.findMany({
      where: { companyId: company.id, status: 'SELESAI' },
      include: { vehicles: true },
    });

    for (const application of applications) {
      for (const vehicle of application.vehicles) {
        for (const { bulan, tahun } of monthsInRange) {
          kewajibanAplikasi.push({
            applicationId: application.id,
            companyId: company.id,
            periodId,
            vehicleId: vehicle.vehicleId,
            sudahDilaporkan: false,
            tanggalBatas: endDate,
            bulan,
            tahun,
          });
        }
      }
    }

    await this.prisma.kewajibanPelaporanAplikasi.createMany({
      data: kewajibanAplikasi,
      skipDuplicates: true,
    });

    // Kewajiban Registrasi
    const kewajibanRegistrasi = [];
    const registrations = await this.prisma.registrasi.findMany({
      where: { companyId: company.id, status: 'SELESAI' },
    });

    for (const registrasi of registrations) {
      for (const { bulan, tahun } of monthsInRange) {
        kewajibanRegistrasi.push({
          registrasiId: registrasi.id,
          companyId: company.id,
          periodId,
          sudahDilaporkan: false,
          tanggalBatas: endDate,
          bulan,
          tahun,
        });
      }
    }

    await this.prisma.kewajibanPelaporanRegistrasi.createMany({
      data: kewajibanRegistrasi,
      skipDuplicates: true,
    });

    return { message: 'Kewajiban berhasil ditambahkan untuk perusahaan.' };
  }

  async getCompanies(periodId?: string, isReported?: boolean) {
    const today = new Date();
  
    const whereClause: any = {
      sudahDilaporkan: isReported !== undefined ? isReported : undefined,
      period: {
        endPeriodDate: {
          lte: today, // Periode dengan endPeriodDate kurang dari atau sama dengan hari ini
        },
      },
    };
  
    // Tambahkan filter berdasarkan periodId jika disediakan
    if (periodId) {
      whereClause.periodId = periodId;
    }
  
    const totalCount = await this.prisma.kewajibanPelaporanPerusahaan.count({
      where: whereClause,
    });
  
    const data = await this.prisma.kewajibanPelaporanPerusahaan.findMany({
      where: whereClause,
      include: {
        company: true,
        period: true,
      },
    });
  
    return { total: totalCount, data };
  }
  

  // Method untuk mendapatkan daftar registrasi (reported/unreported)
  async getRegistrations(periodId?: string, isReported?: boolean) {
    const today = new Date();
  
    const whereClause: any = {
      sudahDilaporkan: isReported !== undefined ? isReported : undefined,
      period: {
        endPeriodDate: {
          lte: today, // Periode dengan endPeriodDate kurang dari atau sama dengan hari ini
        },
      },
    };
  
    // Tambahkan filter berdasarkan periodId jika disediakan
    if (periodId) {
      whereClause.periodId = periodId;
    }

    const totalCount = await this.prisma.kewajibanPelaporanRegistrasi.count({
      where: whereClause,
    });

    const data = await this.prisma.kewajibanPelaporanRegistrasi.findMany({
      where: whereClause,
      include: {
        registrasi: { include: { BahanB3Registrasi: true } },
        company: true,
        period: true,
      },
    });

    return { total: totalCount, data };
  }

  // Method untuk mendapatkan daftar aplikasi (reported/unreported)
  async getApplications(periodId?: string, isReported?: boolean) {
    const today = new Date();
  
    const whereClause: any = {
      sudahDilaporkan: isReported !== undefined ? isReported : undefined,
      period: {
        endPeriodDate: {
          lte: today, // Periode dengan endPeriodDate kurang dari atau sama dengan hari ini
        },
      },
    };
  
    // Tambahkan filter berdasarkan periodId jika disediakan
    if (periodId) {
      whereClause.periodId = periodId;
    }
    const totalCount = await this.prisma.kewajibanPelaporanAplikasi.count({
      where: whereClause,
    });

    const data = await this.prisma.kewajibanPelaporanAplikasi.findMany({
      where: whereClause,
      include: {
        application: true,
        company: true,
        vehicle: true,
        period: true,
      },
    });

    return { total: totalCount, data };
  }

    // Utility untuk membuat query options
    private buildQueryOptions(
      filter: any,
      pagination: PaginationDto,
      isReported?: boolean
    ) {
      const { periodId, companyIds, jenisLaporan, vehicleIds } = filter;
      const { sortOrder, sortBy } = pagination;
  
      return {
        where: {
          periodId: periodId || undefined,
          companyId: companyIds?.length ? { in: companyIds } : undefined,
          jenisLaporan: jenisLaporan || undefined,
          vehicleId: vehicleIds?.length ? { in: vehicleIds } : undefined,
          sudahDilaporkan: isReported !== undefined ? isReported : undefined,
        },
        orderBy: { [sortBy]: sortOrder },
      };
    }
  
    // Method untuk mencari kewajiban pelaporan perusahaan
    async searchCompanies(
      query: SearchCompaniesReportWithPaginationDto
    ) {
      const {
        periodId,
        companyIds,
        jenisLaporan,
        isReported,
        page,
        limit,
        returnAll = true,
        sortBy = 'createdAt', // Default sorting
        sortOrder = 'asc', // Default sorting order
      } = query;
    
      const today = new Date();
    
      const queryOptions = {
        where: {
          periodId: periodId || undefined,
          companyId: companyIds?.length ? { in: companyIds } : undefined,
          jenisLaporan: jenisLaporan || undefined,
          sudahDilaporkan: isReported !== undefined ? isReported : undefined,
          // Tambahkan logika untuk reported = false
          ...(isReported === false && {
            period: {
              endPeriodDate: {
                lt: today, // Cari perusahaan dengan endPeriodDate yang sudah lewat
              },
            },
          }),
        },
        orderBy: { [sortBy]: sortOrder },
      };
      if (returnAll) {
        const data = await this.prisma.kewajibanPelaporanPerusahaan.findMany({
          ...queryOptions,
          include: { company: true },
        });
        return { total: data.length, data };
      }
  
      const total = await this.prisma.kewajibanPelaporanPerusahaan.count({
        where: queryOptions.where,
      });
  
      if (total === 0) {
        return { total: 0, data: [] };
      }
  
      const data = await this.prisma.kewajibanPelaporanPerusahaan.findMany({
        ...queryOptions,
        include: { company: true },
        skip: (page - 1) * limit,
        take: limit,
      });
  
      return { total, data };
    }
  
    // Method untuk mencari kewajiban pelaporan registrasi
  async searchRegistrations(dto: SearchRegistrationsWithPaginationDto) {
    const {
      periodId,
      companyIds,
      isReported,
      page,
      limit,
      returnAll = true,
      sortBy = 'createdAt', // Default sorting
      sortOrder = 'asc', // Default sorting order
    } = dto;

    const today = new Date();

    const queryOptions = {
      where: {
        periodId: periodId || undefined,
        companyId: companyIds?.length ? { in: companyIds } : undefined,
        sudahDilaporkan: isReported !== undefined ? isReported : undefined,
        // Tambahkan logika untuk isReported = false
        ...(isReported === false && {
          period: {
            endPeriodDate: {
              lt: today, // Cari periode dengan endPeriodDate yang sudah lewat
            },
          },
        }),
      },
      orderBy: { [sortBy]: sortOrder },
    };

    if (returnAll) {
      const data = await this.prisma.kewajibanPelaporanRegistrasi.findMany({
        ...queryOptions,
        include: {
          registrasi: true,
          company: true,
          period: true, // Tambahkan relasi period untuk akses endPeriodDate
        },
      });
      return { total: data.length, data };
    }

    const total = await this.prisma.kewajibanPelaporanRegistrasi.count({
      where: queryOptions.where,
    });

    if (total === 0) {
      return { total: 0, data: [] };
    }

    const data = await this.prisma.kewajibanPelaporanRegistrasi.findMany({
      ...queryOptions,
      include: {
        registrasi: true,
        company: true,
        period: true, // Tambahkan relasi period untuk akses endPeriodDate
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    return { total, data };
  }

    
  // Method untuk mencari kewajiban pelaporan aplikasi (per kendaraan)
  async searchApplications(dto: SearchApplicationsWithPaginationDto) {
    const {
      periodId,
      companyIds,
      vehicleIds,
      isReported,
      page,
      limit,
      returnAll = true,
      sortBy = 'createdAt', // Default sorting
      sortOrder = 'asc', // Default sorting order
    } = dto;

    const today = new Date();

    const queryOptions = {
      where: {
        periodId: periodId || undefined,
        companyId: companyIds?.length ? { in: companyIds } : undefined,
        vehicleId: vehicleIds?.length ? { in: vehicleIds } : undefined,
        sudahDilaporkan: isReported !== undefined ? isReported : undefined,
        // Tambahkan logika untuk isReported = false
        ...(isReported === false && {
          period: {
            endPeriodDate: {
              lt: today, // Cari aplikasi dengan endPeriodDate yang sudah lewat
            },
          },
        }),
      },
      orderBy: { [sortBy]: sortOrder },
    };

    if (returnAll) {
      const data = await this.prisma.kewajibanPelaporanAplikasi.findMany({
        ...queryOptions,
        include: {
          application: true,
          company: true,
          vehicle: true,
          period: true, // Tambahkan relasi period untuk akses endPeriodDate
        },
      });
      return { total: data.length, data };
    }

    const total = await this.prisma.kewajibanPelaporanAplikasi.count({
      where: queryOptions.where,
    });

    if (total === 0) {
      return { total: 0, data: [] };
    }

    const data = await this.prisma.kewajibanPelaporanAplikasi.findMany({
      ...queryOptions,
      include: {
        application: true,
        company: true,
        vehicle: true,
        period: true, // Tambahkan relasi period untuk akses endPeriodDate
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    return { total, data };
  }

}