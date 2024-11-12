import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from './prisma.services';
import { CreatePelaporanPengangkutanDto } from 'src/models/createPelaporanPengakutanDto';
import { UpdatePelaporanPengangkutanDto } from 'src/models/updatePelaporanPengakutanDto';
import { CreatePengangkutanDetailDto } from 'src/models/createPelaporanPengakutanDetailDto';
import { UpdatePerusahaanAsalMuatDanTujuanDto } from 'src/models/updatePerusahaanAsalDanTujuanB3Dto';
import { CreatePerusahaanAsalMuatDanTujuanDto } from 'src/models/createPerusahaanAsalDanTujuanB3Dto';
import { UpdatePengangkutanDetailDto } from 'src/models/updatePelaporanPengakutanDetailDto';
import { SearchPelaporanPengakutanDto } from 'src/models/searchPelaporanPengakutanDto';
import { SearchBelumPelaporanPengakutanVehicleDto } from 'src/models/searchBelumPelaporanPengakutanVehicleDto';
import { SearchPermohonanRekomBelumDilaporkanDto } from 'src/models/searchPermohonanRekomBelumDilaporkanDto';

@Injectable()
export class PelaporanPengangkutanService {
  constructor(private readonly prisma: PrismaService) {}

    async createReport(data: CreatePelaporanPengangkutanDto) {
        const { applicationId, companyId, vehicleId, bulan, tahun, pengangkutanDetails } = data;
        const period = await this.prisma.period.findUnique({ where: { id: data.periodId } });
        if (!period) throw new BadRequestException('Specified period does not exist.');
    
        // Ensure the report is created within the allowed period
        const currentDate = new Date();
        if (currentDate < period.startDate || currentDate > period.endDate) {
          throw new BadRequestException('Current date is outside the reporting period.');
        }
        
        // Check if a report already exists for the same vehicle, month, and year
        const existingReport = await this.prisma.pelaporanPengangkutan.findFirst({
        where: {
            applicationId,
            vehicleId,
            bulan,
            tahun,
        },
        });

        if (existingReport) {
        throw new BadRequestException('Report already exists for this application, vehicle, month, and year.');
        }

        // Create the report along with the related details
        return this.prisma.pelaporanPengangkutan.create({
        data: {
            applicationId,
            vehicleId,
            companyId,
            bulan,
            tahun,
            isDraft: true,
            pengangkutanDetails: {
            create: pengangkutanDetails.map((detail) => ({
                b3SubstanceId: detail.b3SubstanceId,
                jumlahB3: detail.jumlahB3,
                DataPerusahaanAsalMuatOnPengakutanDetail: {
                  create: detail.perusahaanAsalMuat.map((asalMuat) => ({
                    perusahaanAsalMuatId: asalMuat,
                  })),
                  },
                  DataPerusahaanTujuanBongkarOnPengakutanDetail: {
                    create: detail.perusahaanTujuanBongkar.map((tujuanBongkar) => ({
                      perusahaanTujuanBongkarId: tujuanBongkar,
                    })),
                },
            })),
            },
            periodId: data.periodId,
        },
        });
    }

    // Update main PelaporanPengangkutan fields with conditional updates
    async updateMainData(id: string, data: UpdatePelaporanPengangkutanDto) {
        // Ensure the PelaporanPengangkutan report exists
        const report = await this.prisma.pelaporanPengangkutan.findUnique({ where: { id } });
        if (!report) throw new NotFoundException('Report not found.');

        // Prepare the update data object only with fields present in the request
        const updateData: any = {};
        if (data.bulan !== undefined) updateData.bulan = data.bulan;
        if (data.tahun !== undefined) updateData.tahun = data.tahun;
        if (data.isDraft !== undefined) updateData.isDraft = data.isDraft;

        // Perform the update with the constructed updateData object
        return this.prisma.pelaporanPengangkutan.update({
            where: { id },
            data: updateData,
        });
    }

    // Method to add a new PengangkutanDetail to a PelaporanPengangkutan
    async addPengangkutanDetail(pelaporanPengangkutanId: string, detailData: CreatePengangkutanDetailDto) {
        // Check if the main report exists
        const report = await this.prisma.pelaporanPengangkutan.findUnique({ where: { id: pelaporanPengangkutanId } });
        if (!report) throw new NotFoundException('Pelaporan pengangkutan not found.');

        // Check for duplicate b3SubstanceId in the current report
        const existingDetail = await this.prisma.pengangkutanDetail.findFirst({
        where: {
            pelaporanPengangkutanId,
            b3SubstanceId: detailData.b3SubstanceId,
        },
        });

        if (existingDetail) {
        throw new BadRequestException('b3SubstanceId already exists for this PelaporanPengangkutan.');
        }

        // Create PengangkutanDetail
        return this.prisma.pengangkutanDetail.create({
        data: {
            pelaporanPengangkutanId,
            b3SubstanceId: detailData.b3SubstanceId,
            jumlahB3: detailData.jumlahB3,
            DataPerusahaanAsalMuatOnPengakutanDetail: {
            create: detailData.perusahaanAsalMuat.map((asalMuat) => ({
              perusahaanAsalMuatId: asalMuat,
            })),
            },
            DataPerusahaanTujuanBongkarOnPengakutanDetail: {
              create: detailData.perusahaanTujuanBongkar.map((tujuanBongkar) => ({
                perusahaanTujuanBongkarId: tujuanBongkar,
              })),
            }
        },
        });
    }

    // Update an existing PengangkutanDetail with conditional creation or updates for related companies
    async updatePengangkutanDetail(detailId: string, data: UpdatePengangkutanDetailDto) {
        // Ensure the PengangkutanDetail exists
        const detail = await this.prisma.pengangkutanDetail.findUnique({ where: { id: detailId }, include: { pelaporanPengangkutan: {include:{ company: true}}} });
        if (!detail) throw new NotFoundException('Pengangkutan detail not found.');

        // Prepare the data object, only including fields that are present in the request
        const updateData: any = {};
        if (data.b3SubstanceId) updateData.b3SubstanceId = data.b3SubstanceId;
        if (data.jumlahB3) updateData.jumlahB3 = data.jumlahB3;

        if (data.perusahaanAsalMuat) {
          // Check for existing PerusahaanAsalMuat records and delete them
          await this.prisma.perusahaanAsalMuat.deleteMany({ where: { DataPerusahaanAsalMuatOnPengakutanDetail: {some: {pengangkutanDetailId: detailId}} } });

          // Create new PerusahaanAsalMuat records
          updateData.DataPerusahaanAsalMuatOnPengakutanDetail = {
            create: data.perusahaanAsalMuat.map((asalMuat) => ({
              perusahaanAsalMuatId: asalMuat,
            })),
          };
        }

        if(data.perusahaanTujuanBongkar) {
          // Check for existing PerusahaanTujuanBongkar records and delete them
          await this.prisma.perusahaanTujuanBongkar.deleteMany({ where: { DataPerusahaanTujuanBongkarOnPengakutanDetail:{some: {pengangkutanDetailId: detailId}} } });

          // Create new PerusahaanTujuanBongkar records
          updateData.DataPerusahaanTujuanBongkarOnPengakutanDetail = {
            create: data.perusahaanTujuanBongkar.map((tujuanBongkar) => ({
              perusahaanTujuanBongkarId: tujuanBongkar,
            })),
          };
        }

        // Update the PengangkutanDetail with new fields
        const updatedDetail = await this.prisma.pengangkutanDetail.update({
        where: { id: detailId },
        data: updateData,
        });

        return updatedDetail;
    }

    // Delete a PengangkutanDetail and its associated companies
    async deletePengangkutanDetailFromReport(detailId: string) {
      const detail = await this.prisma.pengangkutanDetail.findUnique({ where: { id: detailId } });
      if (!detail) throw new NotFoundException('Pengangkutan detail not found.');

      // Now delete the PengangkutanDetail itself
      return this.prisma.pengangkutanDetail.delete({
        where: { id: detailId },
      });
    }

    // Finalize the report only if all reports for the entire period are present for all vehicles in the application
    async finalizeReport(companyId:string, period: string) {
      // Retrieve the report, including period and application details
      const report = await this.prisma.pelaporanPengangkutan.findFirst({
        where: { periodId: period, companyId:companyId },
        include: {
          period: true,            // Include period to check finalization deadline
          application: {
            include: { vehicles: true }, // Include all vehicles in the application
          },
          pengangkutanDetails: true,
        },
      });

      if (!report) throw new NotFoundException('Report not found.');

      // Check if within the finalization deadline
      if (report?.period?.finalizationDeadline && new Date() > report.period.finalizationDeadline) {
        throw new BadRequestException('Finalization period has expired.');
      }

      // Calculate all months within the period
      const monthsInPeriod = this.getMonthsBetweenDates(report.period.startDate, report.period.endDate);

      // Get all vehicle IDs within the application
      const allVehicleIds = report.application.vehicles.map(vehicle => vehicle.vehicleId);

      // Check if each vehicle has a report for every month in the period
      for (const { bulan, tahun } of monthsInPeriod) {
        const monthlyReports = await this.prisma.pelaporanPengangkutan.findMany({
          where: {
            applicationId: report.applicationId,
            bulan,
            tahun,
          },
          select: { vehicleId: true },
        });

        const reportedVehicleIds = monthlyReports.map(r => r.vehicleId);
        const missingVehicles = allVehicleIds.filter(vehicleId => !reportedVehicleIds.includes(vehicleId));

        if (missingVehicles.length > 0) {
          throw new BadRequestException(`Not all vehicles have submitted reports for ${bulan}/${tahun}.`);
        }
      }

      // Agregasi jumlah B3 per jenis dari detail laporan
      const totalJumlahB3 = report.pengangkutanDetails.reduce((total, detail) => total + detail.jumlahB3, 0);

      // Buat laporan final di tabel LaporanPengangkutanFinal
      const finalizedReport = await this.prisma.laporanPengangkutanFinal.create({
        data: {
          applicationId: report.applicationId,
          perusahaanId: report.application.companyId,
          bulan: report.bulan,
          tahun: report.tahun,
          totalJumlahB3,
        },
      });

      // Simpan detail jenis B3 di tabel LaporanPengangkutanFinalDetail
      for (const detail of report.pengangkutanDetails) {
        await this.prisma.laporanPengangkutanFinalDetail.create({
          data: {
            laporanPengangkutanFinalId: finalizedReport.id,
            b3SubstanceId: detail.b3SubstanceId,
            jumlahB3: detail.jumlahB3,
          },
        });
      }

        // Finalize the report and mark it as non-draft if all reports are present
        await this.prisma.pelaporanPengangkutan.updateMany({
          where: { periodId: period, companyId:companyId },
          data: { isDraft: false },
        });

      return { message: 'Report and details finalized successfully.' };
    }

    // Fetch a single report with full related data by ID, or throw an error if it doesn't exist
    async getReportById(id: string) {
      const report = await this.prisma.pelaporanPengangkutan.findUnique({
        where: { id },
        include: {
          period: true, // Include period information
          application: {
            include: {
              vehicles: true, // Include vehicles associated with the application
            },
          },
          company: true, // Include company information
          vehicle: true, // Include vehicle information
          pengangkutanDetails: {
            include: {
              b3Substance: true, // Include B3Substance details in each PengangkutanDetail, if applicable
              DataPerusahaanAsalMuatOnPengakutanDetail: {include:{ perusahaanAsalMuat: true }},
              DataPerusahaanTujuanBongkarOnPengakutanDetail: {include:{ perusahaanTujuanBongkar: true }},
            },
          },
        },
      });

      if (!report) {
        throw new NotFoundException('Report not found.');
      }

      return report;
    }

    async searchReports(params: SearchPelaporanPengakutanDto) {
      const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc', applicationId, periodId, bulan, tahun, vehicleIds, b3SubstanceIds, longitudeAsalMuat, latitudeAsalMuat, longitudeTujuanBongkar, latitudeTujuanBongkar } = params;

      const offset = (page - 1) * limit;

      // Construct the query conditions
      const where: any = {
        ...(applicationId ? { applicationId } : {}),
        ...(periodId ? { periodId } : {}),
        ...(bulan ? { bulan } : {}),
        ...(tahun ? { tahun } : {}),
        ...(vehicleIds ? { vehicleId: { in: vehicleIds } } : {}),
        ...(b3SubstanceIds ? { pengangkutanDetails: { some: { b3SubstanceId: { in: b3SubstanceIds } } } } : {}),
        // Combine latitude and longitude filters for perusahaanAsalMuat
        ...(longitudeAsalMuat && latitudeAsalMuat
          ? {
              pengangkutanDetails: {
                some: {
                  perusahaanAsalMuat: {
                    some: {
                      longitude: longitudeAsalMuat,
                      latitude: latitudeAsalMuat,
                    },
                  },
                },
              },
            }
          : {}),
        // Combine latitude and longitude filters for perusahaanTujuanBongkar
        ...(longitudeTujuanBongkar && latitudeTujuanBongkar
          ? {
              pengangkutanDetails: {
                some: {
                  perusahaanTujuanBongkar: {
                    some: {
                      longitude: longitudeTujuanBongkar,
                      latitude: latitudeTujuanBongkar,
                    },
                  },
                },
              },
            }
          : {}),
      };

      const reports = await this.prisma.pelaporanPengangkutan.findMany({
        where,
        orderBy: { [sortBy]: sortOrder },
        skip: offset,
        take: limit,
        include: {
          period: true,
          application: {
            include: {
              vehicles: true,
              company: true,
            },
          },
          vehicle: true,
          company: true,
          pengangkutanDetails: {
            include: {
              b3Substance: true,
              DataPerusahaanAsalMuatOnPengakutanDetail: {include:{ perusahaanAsalMuat: true }},
              DataPerusahaanTujuanBongkarOnPengakutanDetail: {include:{ perusahaanTujuanBongkar: true }},
            },
          },
        },
      });

      const total = await this.prisma.pelaporanPengangkutan.count({ where });

      return {
        data: reports,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };
    }

    async getUnreportedVehicles(data: SearchBelumPelaporanPengakutanVehicleDto) {
      const { applicationId, periodId } = data;

      // Ensure at least one parameter is provided
      if (!applicationId && !periodId) {
          // If both are missing, return an empty array or a default response
          return [];
      }

      // If periodId is provided, get the period and date range
      let monthsInPeriod = [];
      if (periodId) {
          const period = await this.prisma.period.findUnique({
              where: { id: periodId },
          });
          if (!period) throw new NotFoundException('Period not found.');
          monthsInPeriod = this.getMonthsBetweenDates(period.startDate, period.endDate);
      }

      // Get all vehicles in the application if applicationId is provided
      const vehicles = applicationId
          ? await this.prisma.vehicle.findMany({
              where: { applications: { some: { applicationId: applicationId } } },
          })
          : [];

      // Get all reports within this period if periodId is provided
      const reportedVehicles = periodId
          ? await this.prisma.pelaporanPengangkutan.findMany({
              where: {
                  ...(applicationId ? { applicationId } : {}),
                  OR: monthsInPeriod.map(month => ({
                      bulan: month.bulan,
                      tahun: month.tahun,
                  })),
              },
              select: { vehicleId: true },
          })
          : [];

      // Find vehicle IDs that do not appear in reported vehicles
      const reportedVehicleIds = new Set(reportedVehicles.map(r => r.vehicleId));
      const unreportedVehicles = vehicles.filter(vehicle => !reportedVehicleIds.has(vehicle.id));

      return unreportedVehicles;
    }

    async getUnreportedMonthsForVehicle(data: SearchBelumPelaporanPengakutanVehicleDto) {
        const { applicationId, periodId } = data;

        // Ensure at least one parameter is provided
        if (!applicationId && !periodId) {
            // Return empty array or default response if both are missing
            return [];
        }

        // If periodId is provided, get the period and date range
        let monthsInPeriod = [];
        if (periodId) {
            const period = await this.prisma.period.findUnique({
                where: { id: periodId },
            });
            if (!period) throw new NotFoundException('Period not found.');
            monthsInPeriod = this.getMonthsBetweenDates(period.startDate, period.endDate);
        }

        // Get all reported months for the vehicle within the period
        const reportedMonths = applicationId && periodId
            ? await this.prisma.pelaporanPengangkutan.findMany({
                where: {
                    applicationId,
                    OR: monthsInPeriod.map(month => ({
                        bulan: month.bulan,
                        tahun: month.tahun,
                    })),
                },
                select: { bulan: true, tahun: true },
            })
            : [];

        // Determine which months are missing by comparing with monthsInPeriod
        const reportedMonthsSet = new Set(reportedMonths.map(month => `${month.bulan}-${month.tahun}`));
        const unreportedMonths = monthsInPeriod.filter(
            month => !reportedMonthsSet.has(`${month.bulan}-${month.tahun}`)
        );

        return unreportedMonths;
    }

    async getUnreportedApplications(data: SearchPermohonanRekomBelumDilaporkanDto) {
        const { periodId, companyId } = data;

        // Ensure at least one parameter is provided
        if (!periodId && !companyId) {
            // Return empty array or default response if both are missing
            return [];
        }

        // If periodId is provided, get the period and date range
        let monthsInPeriod = [];
        if (periodId) {
            const period = await this.prisma.period.findUnique({
                where: { id: periodId },
            });
            if (!period) throw new NotFoundException('Period not found.');
            monthsInPeriod = this.getMonthsBetweenDates(period.startDate, period.endDate);
        }

        // Retrieve all applications, optionally filtered by company
        const allApplications = await this.prisma.application.findMany({
            where: {
                ...(companyId ? { companyId } : {}),
            }
        });

        // Retrieve applications that have reports within the period and optionally filter by company
        const reportedApplications = periodId
            ? await this.prisma.pelaporanPengangkutan.findMany({
                where: {
                    ...(companyId ? { application: { companyId } } : {}),
                    OR: monthsInPeriod.map(month => ({
                        bulan: month.bulan,
                        tahun: month.tahun,
                    })),
                },
                select: { applicationId: true },
                distinct: ['applicationId'],
            })
            : [];

        // Determine which applications are missing reports
        const reportedApplicationIds = new Set(reportedApplications.map(report => report.applicationId));
        const unreportedApplications = allApplications.filter(
            application => !reportedApplicationIds.has(application.id)
        );

        return unreportedApplications;
    }

    // Helper to get all months between two dates
    private getMonthsBetweenDates(startDate: Date, endDate: Date): { bulan: number; tahun: number }[] {
    const months = [];
    let currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      months.push({
        bulan: currentDate.getMonth() + 1, // Month is zero-indexed in JavaScript
        tahun: currentDate.getFullYear(),
      });
      currentDate.setMonth(currentDate.getMonth() + 1); // Move to the next month
    }

    return months;
    }
  
}
