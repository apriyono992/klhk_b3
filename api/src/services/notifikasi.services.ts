import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from './prisma.services';
import { CreateNotifikasiDto } from '../models/createNotifikasiDto';
import { UpdateNotifikasiDto } from '../models/updateNotifikasiDto';
import { SearchNotifikasiDto } from '../models/searchNotifikasiDto';
import { Prisma, Status } from '@prisma/client';
import { StatusNotifikasi } from '../models/enums/statusNotifikasi';
import { DraftSuratNotifikasiService } from './draftSuratNotifikasi.service';
import { TipeSuratNotifikasi } from 'src/models/enums/tipeSuratNotifikasi';

// Allowed status transitions map
const allowedStatusTransitions = {
  [StatusNotifikasi.DITERIMA]: [
    StatusNotifikasi.VERIFIKASI_ADM_TEK,
    StatusNotifikasi.KIRIM_SURAT_KEBENARAN_IMPORT,
    StatusNotifikasi.DIBATALKAN,
  ],
  [StatusNotifikasi.VERIFIKASI_ADM_TEK]: [
    StatusNotifikasi.KIRIM_SURAT_KEBENARAN_IMPORT,
    StatusNotifikasi.DIBATALKAN,
  ],
  [StatusNotifikasi.KIRIM_SURAT_KEBENARAN_IMPORT]: [
    StatusNotifikasi.TUNGGU_RESPON,
    StatusNotifikasi.DIBATALKAN,
  ],
  [StatusNotifikasi.TUNGGU_RESPON]: [
    StatusNotifikasi.ADA_RENCANA_IMPOR,
    StatusNotifikasi.TIDAK_ADA_IMPOR,
    StatusNotifikasi.DIBATALKAN,
  ],
  [StatusNotifikasi.ADA_RENCANA_IMPOR]: [
    StatusNotifikasi.DIBATALKAN,
    StatusNotifikasi.SELESAI
    
  ],
  [StatusNotifikasi.TIDAK_ADA_IMPOR]: [StatusNotifikasi.DIBATALKAN],
  [StatusNotifikasi.SELESAI]: [],
  [StatusNotifikasi.DIBATALKAN]: [],
};

@Injectable()
export class NotifikasiService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly draftSuratNotifikasiService: DraftSuratNotifikasiService,  // Inject DraftSuratNotifikasiService
  ) {}

  // Create a new Notifikasi and log the initial status in NotifikasiStatusHistory
  async createNotifikasi(dto: CreateNotifikasiDto) {
    return this.prisma.$transaction(async (prisma) => {
      const newNotifikasi = await prisma.notifikasi.create({
        data: {
          companyId: dto.companyId,
          referenceNumber: dto.referenceNumber,
          dataBahanB3Id: dto.databahanb3Id,
          status: dto.status,
          tanggalDiterima: dto.tanggalDiterima || new Date(),
          exceedsThreshold: dto.exceedsThreshold || false,
          createdById: dto.changeBy || undefined, // Directly assign the user ID as a string here
          negaraAsal: dto.negaraAsal
        },
      });

      await prisma.notifikasiStatusHistory.create({
        data: {
          notifikasiId: newNotifikasi.id,
          newStatus: dto.status,
          tanggalPerubahan: new Date(),
          changedAt: new Date(),
          changedBy: dto.changeBy || undefined, // Directly assign the user ID as a string here
          oldStatus: null,
        },
      });

      return newNotifikasi;
    });
  }

  // Patch (Update) an existing Notifikasi and log the status change if updated
  async patchNotifikasi(id: string, dto: UpdateNotifikasiDto) {
    return this.prisma.$transaction(async (prisma) => {
      const notifikasi = await prisma.notifikasi.findUnique({ where: { id } });
      if (!notifikasi) throw new NotFoundException(`Notifikasi with ID ${id} not found`);

      const updateData: Prisma.NotifikasiUpdateInput = {};

      // Enforce notes if the previous status was DIBATALKAN and the status is being changed
      if (notifikasi.status === StatusNotifikasi.DIBATALKAN && dto.status && dto.status !== StatusNotifikasi.DIBATALKAN) {
        if (!dto.notes) {
          throw new BadRequestException(`Notes are required when changing the status from DIBATALKAN to another status.`);
        }
      }

      // Validate status transition
      if (dto.status && dto.status !== notifikasi.status) {
        const validTransitions = allowedStatusTransitions[notifikasi.status];
        if (!validTransitions.includes(dto.status)) {
          throw new BadRequestException(
            `Invalid status transition from ${notifikasi.status} to ${dto.status}. Allowed transitions are: ${validTransitions.join(
              ', ',
            )}.`,
          );
        }

        // If the status transition is valid, proceed with the update
        updateData.status = dto.status;
        updateData.tanggalPerubahan = dto.tanggalPerubahan || new Date();
      }

      if (dto.companyId) {
        updateData.company = { connect: { id: dto.companyId } };
      }
      if (dto.tanggalDiterima) {
        updateData.tanggalDiterima = dto.tanggalDiterima;
      }
      if (dto.tanggalSelesai) {
        updateData.tanggalSelesai = dto.tanggalSelesai;
      }
      if (typeof dto.exceedsThreshold !== 'undefined') {
        updateData.exceedsThreshold = dto.exceedsThreshold;
      }

      const updatedNotifikasi = await prisma.notifikasi.update({
        where: { id },
        data: updateData,
      });

      // If the status is being updated to "Kirim Surat Kebenaran Import", create a base DraftSurat
      if (dto.status === StatusNotifikasi.KIRIM_SURAT_KEBENARAN_IMPORT && dto.status !== notifikasi.status) {
        await this.draftSuratNotifikasiService.createDraftSuratKebenaranImport({
          notifikasiId: id,              // Link to the notifikasi
          tipeSurat: dto.tipeSurat ?? TipeSuratNotifikasi.KEBENARAN_IMPORT_BIASA, // Required field
          nomorSurat: null,              // Default to null (can be filled later)
          tanggalSurat: null,            // Default to null (can be filled later)
          kodeDBKlh: null,               // Default to null (can be filled later)
          sifatSurat: null,              // Default to null (can be filled later)
          emailPenerima: null,           // Default to null (can be filled later)
          tanggalPengiriman: null,       // Default to null (can be filled later)
          dataBahanB3Id: null,           // Default to null (can be filled later)
          pejabatId: null,               // Default to null (can be filled later)
          tembusanIds: [],               // Default to empty array (can be filled later)
          customPoint1: null,            // Default to null (can be filled later)
          customPoint2: null,            // Default to null (can be filled later)
          customPoint3: null             // Default to null (can be filled later)
        });
      }
      // If the status is being updated to "Kirim Surat Kebenaran Import", create a base DraftSurat
      if (dto.status === StatusNotifikasi.ADA_RENCANA_IMPOR && dto.status !== notifikasi.status) {
        await this.draftSuratNotifikasiService.createDraftSuratPersetujuanImport({
          notifikasiId: id,              // Link to the notifikasi
          tipeSurat: dto.tipeSurat ?? TipeSuratNotifikasi.EXPLICIT_CONSENT_AND_PERSETUJUAN_ECHA, // Required field
          nomorSurat: null,              // Default to null (can be filled later)
          tanggalSurat: null,            // Default to null (can be filled later)
          kodeDBKlh: null,               // Default to null (can be filled later)
          sifatSurat: null,              // Default to null (can be filled later)
          emailPenerima: null,           // Default to null (can be filled later)
          tanggalPengiriman: null,       // Default to null (can be filled later)
          dataBahanB3Id: null,           // Default to null (can be filled later)
          pejabatId: null,               // Default to null (can be filled later)
          tembusanIds: [],               // Default to empty array (can be filled later)
          customPoint1: null,            // Default to null (can be filled later)
          customPoint2: null,            // Default to null (can be filled later)
          customPoint3: null             // Default to null (can be filled later)
        });

        await this.draftSuratNotifikasiService.createDraftSuratExplicitConsent({
          notifikasiId: id,              // Link to the notifikasi
          tipeSuratNotifikasi: dto.tipeSurat ?? TipeSuratNotifikasi.EXPLICIT_CONSENT_AND_PERSETUJUAN_ECHA, // Required field
        });
      }
        
      // If the status was updated, log the change in NotifikasiStatusHistory
      if (dto.status && dto.status !== notifikasi.status) {
        await prisma.notifikasiStatusHistory.create({
          data: {
            notifikasiId: updatedNotifikasi.id,
            oldStatus: notifikasi.status,
            newStatus: dto.status,
            tanggalPerubahan: dto.tanggalPerubahan || new Date(),
            changedAt: new Date(),
            changedBy: dto.changeBy || undefined, // Directly assign the user ID as a string here
            notes: dto.notes, // Include notes if provided
          },
        });
      }

      return updatedNotifikasi;
    });
  }

  // Get a single Notifikasi by its ID
  async getNotifikasiById(id: string) {
    const notifikasi = await this.prisma.notifikasi.findUnique({
      where: { id },
      include: {
        statusHistory: { include: { User: true } },
        company: true,
        draftSuratNotifikasiId: {include: {
          NotifikasiTembusan: {include: {DataTembusan:true}}, pejabat: true, ExplicitConsent: {include:{ExplicitConsentDetails:true}}, KebenaranImport: true, PersetujuanImport: true}},
        dataBahanB3: true,
        User: true,
      },
    });
    if (!notifikasi) throw new NotFoundException(`Notifikasi with ID ${id} not found`);
    return notifikasi;
  }

  // Get a list of Notifikasis with pagination, filtering, and time range
  async searchNotifikasi(dto: SearchNotifikasiDto) {
    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc', companyIds, statuses, startDate, endDate } = dto;

    // Build the where clause dynamically
    const whereClause: Prisma.NotifikasiWhereInput = {
      ...(companyIds?.length ? { companyId: { in: companyIds } } : {}),
      ...(statuses?.length ? { status: { in: statuses } } : {}),
      ...(startDate && endDate
        ? {
            tanggalDiterima: {
              gte: startDate, // Greater than or equal to startDate
              lte: endDate,   // Less than or equal to endDate
            },
          }
        : startDate
        ? {
            tanggalDiterima: {
              gte: startDate, // Greater than or equal to startDate if only startDate is provided
            },
          }
        : endDate
        ? {
            tanggalDiterima: {
              lte: endDate, // Less than or equal to endDate if only endDate is provided
            },
          }
        : {}),
    };

    const [total, notifikasis] = await this.prisma.$transaction([
      this.prisma.notifikasi.count({ where: whereClause }),
      this.prisma.notifikasi.findMany({
        where: whereClause,
        orderBy: { [sortBy]: sortOrder.toLowerCase() },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          company: true,
          statusHistory: true,
          draftSuratNotifikasiId: true,
          dataBahanB3: true,
        },
      }),
    ]);

    return {
      total,
      page,
      limit,
      data: notifikasis,
    };
  }

  // Soft delete a Notifikasi by updating its status
  async softDeleteNotifikasi(id: string) {
    const notifikasi = await this.prisma.notifikasi.findUnique({ where: { id } });
    if (!notifikasi) throw new NotFoundException(`Notifikasi with ID ${id} not found`);

    return this.prisma.notifikasi.update({
      where: { id },
      data: {
        status: StatusNotifikasi.DIBATALKAN, // Soft delete by changing status
      },
    });
  }
}
