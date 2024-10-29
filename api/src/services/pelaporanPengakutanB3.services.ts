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
                perusahaanAsalMuat: {
                create: detail.perusahaanAsalMuat.map((asal) => ({
                    companyId: asal.companyId,
                    namaPerusahaan: asal.namaPerusahaan,
                    alamat: asal.alamat,
                    latitude: asal.latitude,
                    longitude: asal.longitude,
                    locationType: asal.locationType,
                })),
                },
                perusahaanTujuanBongkar: {
                create: detail.perusahaanTujuanBongkar.map((tujuan) => ({
                    companyId: tujuan.companyId,
                    namaPerusahaan: tujuan.namaPerusahaan,
                    alamat: tujuan.alamat,
                    latitude: tujuan.latitude,
                    longitude: tujuan.longitude,
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
            perusahaanAsalMuat: {
            create: detailData.perusahaanAsalMuat,
            },
            perusahaanTujuanBongkar: {
            create: detailData.perusahaanTujuanBongkar,
            },
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

        // Update the PengangkutanDetail with new fields
        const updatedDetail = await this.prisma.pengangkutanDetail.update({
        where: { id: detailId },
        data: updateData,
        });

        // Handle perusahaanAsalMuat: create or update based on namaPerusahaan and alamat
        if (data.perusahaanAsalMuat) {
        for (const asalMuat of data.perusahaanAsalMuat) {
            const existingAsalMuat = await this.prisma.perusahaanAsalMuat.findFirst({
            where: {
                pengangkutanDetailId: detailId,
                namaPerusahaan: asalMuat.namaPerusahaan,
                alamat: asalMuat.alamat,
            },
            });

            if (existingAsalMuat) {
            // Update if a match is found
            await this.prisma.perusahaanAsalMuat.update({
                where: { id: existingAsalMuat.id },
                data: {
                namaPerusahaan: asalMuat.namaPerusahaan,
                alamat: asalMuat.alamat,
                latitude: asalMuat.latitude,
                longitude: asalMuat.longitude,
                locationType: asalMuat.locationType,
                },
            });
            } else {
            // Create new entry if no match is found
            await this.prisma.perusahaanAsalMuat.create({
                data: {
                pengangkutanDetail: { connect: { id: detailId } },
                namaPerusahaan: asalMuat.namaPerusahaan,
                alamat: asalMuat.alamat,
                latitude: asalMuat.latitude,
                longitude: asalMuat.longitude,
                locationType: asalMuat.locationType,
                company: { connect: { id: detail.pelaporanPengangkutan.company.id }}
                },
            });
            }
        }
        }

        // Handle perusahaanTujuanBongkar: create or update based on namaPerusahaan and alamat
        if (data.perusahaanTujuanBongkar) {
        for (const tujuanBongkar of data.perusahaanTujuanBongkar) {
            const existingTujuanBongkar = await this.prisma.perusahaanTujuanBongkar.findFirst({
            where: {
                pengangkutanDetailId: detailId,
                namaPerusahaan: tujuanBongkar.namaPerusahaan,
                alamat: tujuanBongkar.alamat,
            },
            });

            if (existingTujuanBongkar) {
            // Update if a match is found
            await this.prisma.perusahaanTujuanBongkar.update({
                where: { id: existingTujuanBongkar.id },
                data: {
                namaPerusahaan: tujuanBongkar.namaPerusahaan,
                alamat: tujuanBongkar.alamat,
                latitude: tujuanBongkar.latitude,
                longitude: tujuanBongkar.longitude,
                },
            });
            } else {
            // Create new entry if no match is found
            await this.prisma.perusahaanTujuanBongkar.create({
                data: {
                pengangkutanDetail: { connect: { id: detailId } },
                namaPerusahaan: tujuanBongkar.namaPerusahaan,
                alamat: tujuanBongkar.alamat,
                latitude: tujuanBongkar.latitude,
                longitude: tujuanBongkar.longitude,          
                company: { connect: { id: detail.pelaporanPengangkutan.company.id }}
                },
            });
            }
        }
        }

        return updatedDetail;
    }

    // Delete a PengangkutanDetail and its associated companies
  async deletePengangkutanDetailFromReport(detailId: string) {
    const detail = await this.prisma.pengangkutanDetail.findUnique({ where: { id: detailId } });
    if (!detail) throw new NotFoundException('Pengangkutan detail not found.');

    // Delete associated PerusahaanAsalMuat and PerusahaanTujuanBongkar records first
    await this.prisma.perusahaanAsalMuat.deleteMany({ where: { pengangkutanDetailId: detailId } });
    await this.prisma.perusahaanTujuanBongkar.deleteMany({ where: { pengangkutanDetailId: detailId } });

    // Now delete the PengangkutanDetail itself
    return this.prisma.pengangkutanDetail.delete({
      where: { id: detailId },
    });
  }

  // Add a new PerusahaanAsalMuat to an existing PengangkutanDetail
  async addPerusahaanAsalMuat(pengangkutanDetailId: string, data: CreatePerusahaanAsalMuatDanTujuanDto) {
    const detail = await this.prisma.pengangkutanDetail.findUnique({ where: { id: pengangkutanDetailId } });
    if (!detail) throw new NotFoundException('Pengangkutan detail not found.');

    return this.prisma.perusahaanAsalMuat.create({
      data: {
        ...data,
        pengangkutanDetailId,
      },
    });
  }

  // Add a new PerusahaanTujuanBongkar to an existing PengangkutanDetail
  async addPerusahaanTujuanBongkar(pengangkutanDetailId: string, data: CreatePerusahaanAsalMuatDanTujuanDto) {
    const detail = await this.prisma.pengangkutanDetail.findUnique({ where: { id: pengangkutanDetailId } });
    if (!detail) throw new NotFoundException('Pengangkutan detail not found.');

    return this.prisma.perusahaanTujuanBongkar.create({
      data: {
        ...data,
        pengangkutanDetailId,
      },
    });
  }

  // Update an existing PerusahaanAsalMuat entry with conditional updates
    async updatePerusahaanAsalMuat(id: string, data: UpdatePerusahaanAsalMuatDanTujuanDto) {
        // Check if the PerusahaanAsalMuat record exists
        const asalMuat = await this.prisma.perusahaanAsalMuat.findUnique({ where: { id } });
        if (!asalMuat) throw new NotFoundException('Loading company not found.');

        // Prepare the update data object conditionally based on provided fields
        const updateData: any = {};
        if (data.companyId !== undefined) updateData.companyId = data.companyId;
        if (data.namaPerusahaan !== undefined) updateData.namaPerusahaan = data.namaPerusahaan;
        if (data.alamat !== undefined) updateData.alamat = data.alamat;
        if (data.latitude !== undefined) updateData.latitude = data.latitude;
        if (data.longitude !== undefined) updateData.longitude = data.longitude;
        if (data.locationType !== undefined) updateData.locationType = data.locationType;

        // Perform the update with the constructed updateData object
        return this.prisma.perusahaanAsalMuat.update({
            where: { id },
            data: updateData,
        });
    }

    // Update an existing PerusahaanTujuanBongkar entry with conditional updates
    async updatePerusahaanTujuanBongkar(id: string, data: UpdatePerusahaanAsalMuatDanTujuanDto) {
        // Check if the PerusahaanTujuanBongkar record exists
        const tujuanBongkar = await this.prisma.perusahaanTujuanBongkar.findUnique({ where: { id } });
        if (!tujuanBongkar) throw new NotFoundException('Unloading company not found.');

        // Prepare the update data object conditionally based on provided fields
        const updateData: any = {};
        if (data.companyId !== undefined) updateData.companyId = data.companyId;
        if (data.namaPerusahaan !== undefined) updateData.namaPerusahaan = data.namaPerusahaan;
        if (data.alamat !== undefined) updateData.alamat = data.alamat;
        if (data.latitude !== undefined) updateData.latitude = data.latitude;
        if (data.longitude !== undefined) updateData.longitude = data.longitude;
        if (data.locationType !== undefined) updateData.locationType = data.locationType;

        // Perform the update with the constructed updateData object
        return this.prisma.perusahaanTujuanBongkar.update({
            where: { id },
            data: updateData,
        });
    }

  // Delete a PerusahaanAsalMuat entry
  async deletePerusahaanAsalMuat(id: string) {
    const asalMuat = await this.prisma.perusahaanAsalMuat.findUnique({ where: { id } });
    if (!asalMuat) throw new NotFoundException('Loading company not found.');

    return this.prisma.perusahaanAsalMuat.delete({ where: { id } });
  }

  // Delete a PerusahaanTujuanBongkar entry
  async deletePerusahaanTujuanBongkar(id: string) {
    const tujuanBongkar = await this.prisma.perusahaanTujuanBongkar.findUnique({ where: { id } });
    if (!tujuanBongkar) throw new NotFoundException('Unloading company not found.');

    return this.prisma.perusahaanTujuanBongkar.delete({ where: { id } });
  }

  // Finalize the report only if all reports for the entire period are present for all vehicles in the application
  async finalizeReport(id: string) {
    // Retrieve the report, including period and application details
    const report = await this.prisma.pelaporanPengangkutan.findUnique({
      where: { id },
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
    if (report.period.finalizationDeadline && new Date() > report.period.finalizationDeadline) {
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

    // Finalize the report and mark it as non-draft if all reports are present
    await this.prisma.pelaporanPengangkutan.update({
      where: { id },
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
        pengangkutanDetails: {
          include: {
            b3Substance: true, // Include B3Substance details in each PengangkutanDetail, if applicable
            perusahaanAsalMuat: true, // Include loading companies
            perusahaanTujuanBongkar: true, // Include unloading companies
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
        pengangkutanDetails: {
          include: {
            b3Substance: true,
            perusahaanAsalMuat: true,
            perusahaanTujuanBongkar: true,
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
