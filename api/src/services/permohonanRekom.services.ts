import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { Application, DraftSurat, Prisma } from '@prisma/client';
import { PrismaService } from './prisma.services';
import { CreateIdentitasPemohonDto } from 'src/models/identitasPemohonDto';
import { generateUniqueCode } from 'src/utils/uniqueKodeRekom';
import { StatusPermohonan } from 'src/models/enums/statusPermohonan';
import { TipeDokumen } from 'src/models/enums/TipeDokumen';
import { SearchApplicationDto } from 'src/models/searchPermohonanRekomendasiDto';
import path from 'path';
import { DraftSuratDto } from 'src/models/draftSuratDto';
import { AddTembusanToDraftSkDto } from 'src/models/addTembusanToDraftSkDto';
import { AddPejabatToDraftSkDto } from 'src/models/addPejabatToDraftSkDto';
import { UpdateApplicationStatusDto } from 'src/models/updateApplicationStatusDto';
import { JenisPermohonan } from 'src/models/enums/jenisPermohonan';

@Injectable()
export class PermohonanRekomendasiB3Service {
  constructor(private readonly prisma: PrismaService) {}

  // Retry logic to insert the application
  async createInitialApplicationWithPemohon(createDto: CreateIdentitasPemohonDto, maxRetries = 3) {
    // Create Identitas Pemohon
    const identitasPemohon = await this.prisma.identitasApplication.create({
      data: {
        namaPemohon: createDto.namaPemohon,
        alamatDomisili: createDto.alamatDomisili,
        teleponFax: createDto.teleponFax,
        email: createDto.email,
        npwp: createDto.npwp,
        ktp: createDto.ktp,
        jabatan: createDto.jabatan,
        company: { connect: { id: createDto.companyId } }, // Relasi dengan company
      },
    });
  
    let retryCount = 0;
    let application;

    // Initialize the requiredDocumentsStatus JSON object with all required documents set to false
    const initialRequiredDocumentsStatus = {
      [TipeDokumen.SDS_OR_LDK]: false,
      [TipeDokumen.SOP_BONGKAR_MUAT]: false,
      [TipeDokumen.SOP_TANGGAP_DARURAT]: false,
      [TipeDokumen.STNK_KIR]: false,
      [TipeDokumen.FOTO_KENDARAAN]: false,
      [TipeDokumen.FOTO_SOP]: false,
      [TipeDokumen.FOTO_KEMASAN_B3]: false,
      [TipeDokumen.FOTO_ALAT_PELINDUNG_DIRI]: false,
      [TipeDokumen.BUKTI_PELATIHAN]: false,
      [TipeDokumen.SURAT_KETERANGAN_HASIL_PENGUJIAN_TANGKI_UKUR]: false,
      [TipeDokumen.SURAT_KETERANGAN_BEJANA_TEKAN]: false,
      [TipeDokumen.IT_IP_PREKURSOR]: false,
      [TipeDokumen.INFORMASI_KETERSEDIAAN_ALAT_KOMUNIKASI]: false,
      [TipeDokumen.INFORMASI_PEMELIHARAAN_KENDARAAN]: false,
      [TipeDokumen.INFORMASI_PENCUCIAN_TANGKI]: false,
      [TipeDokumen.SURAT_REKOMENDASI_B3_SEBELUMNYA]: false,
      [TipeDokumen.SK_DIRJEN_PERHUBUNGAN_DARAT]: false,
      [TipeDokumen.Other]: false,
    };

    while (retryCount <= maxRetries) {
      try {
        // Generate a unique kodePermohonan
        const kodePermohonan = generateUniqueCode();

        // Attempt to create the application
        application = await this.prisma.application.create({
          data: {
            status: StatusPermohonan.DraftPermohonan,
            jenisPermohonan: JenisPermohonan.REKOMENDASI_B3,
            tipeSurat: createDto.tipeSurat,
            kodePermohonan,
            tanggalPengajuan: new Date(),
            companyId: createDto.companyId,
            identitasPemohonId: identitasPemohon.id,
            requiredDocumentsStatus: initialRequiredDocumentsStatus, // Initialize with default false values
          },
        });

        // Log the initial status creation in the history
        await this.prisma.applicationStatusHistory.create({
          data: {
            application: { connect: { id: application.id } },
            oldStatus: null,
            newStatus: StatusPermohonan.DraftPermohonan,
            changedAt: new Date(),
          },
        });

        return {
          message: 'Application and Identitas Pemohon created successfully',
          application,
          identitasPemohon,
        };
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
          // Conflict on kodePermohonan, retry
          retryCount++;
          if (retryCount > maxRetries) {
            throw new ConflictException('Failed to create application after multiple retries due to kodePermohonan conflict.');
          }
        } else {
          // Other errors, rethrow
          throw error;
        }
      }
    }
  }

  async updateApplicationStatus(data: UpdateApplicationStatusDto) {
    return this.prisma.$transaction(async (prisma) => {
      // Check if the application exists
      const application = await prisma.application.findUnique({
        where: { id: data.applicationId },
      });
  
      // Log the old status and the new status in ApplicationStatusHistory
      await prisma.applicationStatusHistory.create({
        data: {
          applicationId: application.id,
          oldStatus: application.status,
          newStatus: data.status,
          changedAt: new Date(),
          changedBy: data.userId ?? null, // Optionally track the user who updated the status
        },
      });
  
      // Update the status of the application
      const updatedApplication = await prisma.application.update({
        where: { id: data.applicationId },
        data: {
          status: data.status,
          updatedAt: new Date(),
        },
      });
  
      // Check if the new status is 'ValidasiPemohonanSelesai' and create DraftSurat if true
      if (data.status === StatusPermohonan.ValidasiPemohonanSelesai) {
        await prisma.draftSurat.create({
          data: {
            applicationId: application.id, // NOT NULL, wajib
            tipeSurat: application.tipeSurat, // NOT NULL, wajib (ubah sesuai kebutuhan Anda)
            nomorSurat: null, // Nullable
            tanggalSurat: null, // Nullable
            kodeDBKlh: null, // Nullable
            pejabatId: null, // Nullable
            tembusan: {}, // Optional, bisa diisi atau tidak tergantung data yang tersedia
          },
        });
      }
  
      return {
        message: `Application status updated to ${data.status}`,
        application: updatedApplication,
      };
    });
  }

  // Method to get the status history of an application
  async getApplicationStatusHistory(applicationId: string) {
    // Retrieve the status history from ApplicationStatusHistory
    const statusHistory = await this.prisma.applicationStatusHistory.findMany({
      where: { applicationId },
      orderBy: { changedAt: 'asc' }, // Order by the timestamp of the change
    });

    if (statusHistory.length === 0) {
      throw new NotFoundException(`No status history found for Application ID ${applicationId}`);
    }

    return statusHistory;
  }

   // Method to fetch a single application by ID
   async getApplicationById(applicationId: string) {
    const application = await this.prisma.application.findUnique({
      where: { id: applicationId },
      include: {
        company: true,             // Optionally include company relation
        documents: true,           // Optionally include documents relation
        draftSurat: {
          include: {
            pejabat: true,
            tembusan: true,
          },
        },
        identitasPemohon: true,  // Include Identitas Pemohon
        vehicles: {
          include: {
            vehicle: true,
          },
        },        // Optionally include draftSurat relation
      },
    });

    if (!application) {
      throw new NotFoundException('Application not found');
    }

    return application;
  }

   // Method to search applications based on multiple filters with pagination
  async searchApplications(searchDto: SearchApplicationDto) {
    const { companyId, applicationId, status, kodePermohonan, page, limit, sortBy, sortOrder } = searchDto;

    // Build the dynamic where condition based on the filters provided
    const whereCondition: Prisma.ApplicationWhereInput = {
        ...(companyId && { companyId: { in: companyId } }), // Filter by multiple companyIds
        ...(applicationId && { id: { in: applicationId } }), // Filter by multiple applicationIds
        ...(status && { status: { in: status } }), // Filter by multiple statuses
        ...(kodePermohonan && { kodePermohonan: { in: kodePermohonan, mode: 'insensitive' } }), // Filter by multiple kodePermohonan
    };

    // Query the total count of applications for pagination
    const total = await this.prisma.application.count({ where: whereCondition });

    // Query the applications based on the dynamic where condition and include pagination
    const applications = await this.prisma.application.findMany({
        where: whereCondition,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        select: {
            id: true,
            kodePermohonan: true,
            companyId: true,
            status: true,
        },
    });

    // Return the data in the specified format
    return {
        applications,
        page,
        limit,
        total,
    };
  }

  async updateDraftSurat(updateData: DraftSuratDto) {
    // Prepare update object
    const updatePayload: any = {};

    if (updateData.pejabatId) {
      updatePayload.pejabatId = updateData.pejabatId;
    }

    if (updateData.kodeDBKlh) {
      updatePayload.kodeDBKlh = updateData.kodeDBKlh;
    }

    if (updateData.nomorSurat) {
      updatePayload.nomorSurat = updateData.nomorSurat;
    }

    if (updateData.tipeSurat) {
      updatePayload.tipeSurat = updateData.tipeSurat;
    }

    if (updateData.tanggalSurat) {
      updatePayload.tanggalSurat = updateData.tanggalSurat;
    }

    if (updateData.tembusanIds) {
      updatePayload.tembusan = {
        set: updateData.tembusanIds.map((id) => ({ id })), // Clear old tembusan and set new ones
      };
    }

    // Perform the update
    const updatedDraftSurat = await this.prisma.draftSurat.update({
      where: { id: updateData.draftId },
      data: updatePayload,
    });

    return updatedDraftSurat;
  }

  async addPejabatToApplication(updatedData: AddPejabatToDraftSkDto) {
    let attempt = 0;
    const maxRetries = 3;
    
    while (attempt < maxRetries) {
      attempt++;
      try {
        return await this.prisma.$transaction(async (prisma) => {
          // Ambil aplikasi untuk cek versi
          const existingApplication = await prisma.draftSurat.findUnique({
            where: { id: updatedData.applicationId },
            select: { pejabat: true, updatedAt: true }
          });
  
          // Tambahkan pejabat ke aplikasi hanya jika data tidak berubah
          return await prisma.draftSurat.update({
            where:{ id: updatedData.applicationId, updatedAt: existingApplication.updatedAt }, // OCC check menggunakan updatedAt
            data: {
              pejabat: {
                connect: { id: updatedData.pejabatId }
              }
            }
          });
        });
      } catch (error) {
        // Jika terjadi konflik versi atau kegagalan, coba lagi (maksimum 3 kali)
        if (attempt >= maxRetries) {
          throw new Error('Gagal menambahkan Data Pejabat setelah 3 kali percobaan.');
        }
      }
    }
  }
  
  async addTembusanToApplication(updateData: AddTembusanToDraftSkDto){
    let attempt = 0;
    const maxRetries = 3;
  
    while (attempt < maxRetries) {
      attempt++;
      try {
        return await this.prisma.$transaction(async (prisma) => {
          // Ambil data aplikasi untuk cek versi
          const existingApplication = await prisma.draftSurat.findUnique({
            where: { id: updateData.applicationId },
            select: { tembusan: true, updatedAt: true }
          });
  
          // Filter out tembusan yang sudah ada untuk menghindari duplikasi
          const filteredTembusanIds = updateData.tembusanIds.filter(id => 
            !existingApplication.tembusan.some(tembusan => tembusan.id === id)
          );
  
          if (filteredTembusanIds.length === 0) {
            throw new Error('Semua Data Tembusan sudah terdaftar.');
          }
  
          // Tambahkan tembusan ke aplikasi hanya jika data tidak berubah
          return await prisma.draftSurat.update({
            where: { id: updateData.applicationId, updatedAt: existingApplication.updatedAt }, // OCC check menggunakan updatedAt
            data: {
              tembusan: {
                connect: filteredTembusanIds.map(id => ({ id }))
              }
            }
          });
        });
      } catch (error) {
        // Jika terjadi konflik versi atau kegagalan, coba lagi (maksimum 3 kali)
        if (attempt >= maxRetries) {
          throw new Error('Gagal menambahkan Data Tembusan setelah 3 kali percobaan.');
        }
      }
    }
  }  

  // async createPejabatAndConnectToDraftSurat(applicationId: string, pejabatData: { nip: string; nama: string; jabatan: string; status: string }) {
  //   return await this.prisma.$transaction(async (prisma) => {
  //     // Buat pejabat baru
  //     const newPejabat = await prisma.dataPejabat.create({
  //       data: pejabatData,
  //     });
  
  //     // Hubungkan pejabat ke aplikasi
  //     const updatedApplication = await prisma.draftSurat.update({
  //       where: { id: applicationId },
  //       data: {
  //         pejabat: {
  //           connect: { id: newPejabat.id }
  //         }
  //       }
  //     });
  
  //     return updatedApplication;
  //   });
  // }

  // async createTembusanAndConnectToApplication(applicationId: string, tembusanData: { nama: string; tipe: string }) {
  //   return await this.prisma.$transaction(async (prisma) => {
  //     // Buat tembusan baru
  //     const newTembusan = await prisma.dataTembusan.create({
  //       data: tembusanData,
  //     });
  
  //     // Hubungkan tembusan ke aplikasi
  //     const updatedApplication = await prisma.draftSurat.update({
  //       where: { id: applicationId },
  //       data: {
  //         tembusan: {
  //           connect: { id: newTembusan.id }
  //         }
  //       }
  //     });
  
  //     return updatedApplication;
  //   });
  // }
  
}
