import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from './prisma.services';
import { CreatePeriodDto } from 'src/models/createPeriodDto';

@Injectable()
export class PeriodService {
  constructor(private readonly prisma: PrismaService) {}

  // Create a new reporting period and set it as active if requested
  async createPeriod(data: CreatePeriodDto) {
    const { startDate, endDate, finalizationDeadline, isActive, name } = data;

    if (startDate >= endDate) {
      throw new BadRequestException('Start date must be before end date.');
    }
    if (endDate >= finalizationDeadline) {
      throw new BadRequestException('Finalization deadline must be after end date.');
    }

    // If isActive is true, deactivate any other active period
    if (isActive) {
      await this.prisma.period.updateMany({
        where: { isActive: true },
        data: { isActive: false },
      });
    }

    return this.prisma.period.create({
      data: {
        name,
        startDate,
        endDate,
        finalizationDeadline,
        isActive,
      },
    });
  }

  // Set an existing period as active and deactivate others
  async setActivePeriod(periodId: string) {
    const period = await this.prisma.period.findUnique({ where: { id: periodId } });
    if (!period) throw new NotFoundException('Period not found.');

    // Deactivate all other active periods
    await this.prisma.period.updateMany({
      where: { isActive: true },
      data: { isActive: false },
    });

    // Activate the selected period
    return this.prisma.period.update({
      where: { id: periodId },
      data: { isActive: true },
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
            orderBy: { startDate: 'asc' },
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
}
