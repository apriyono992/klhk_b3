import { Injectable, ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import { Application, DraftSurat, Prisma } from '@prisma/client';
import { PrismaService } from './prisma.services';
import { CreateIdentitasPemohonDto } from 'src/models/identitasPemohonDto';
import { generateUniqueCode } from 'src/utils/uniqueKodeRekom';
import { StatusPermohonan } from 'src/models/enums/statusPermohonan';
import { TipeDokumen } from 'src/models/enums/tipeDokumen';
import { SearchApplicationDto } from 'src/models/searchPermohonanRekomendasiDto';
import path from 'path';
import { DraftSuratDto } from 'src/models/draftSuratDto';
import { AddTembusanToDraftSkDto } from 'src/models/addTembusanToDraftSkDto';
import { AddPejabatToDraftSkDto } from 'src/models/addPejabatToDraftSkDto';
import { UpdateApplicationStatusDto } from 'src/models/updateApplicationStatusDto';
import { JenisPermohonan } from 'src/models/enums/jenisPermohonan';
import { TelaahTeknisUpsertDto } from 'src/models/telaahTeknisDto';
import { TipeDokumenTelaah } from 'src/models/enums/tipeDokumenTelaah';
import { SearchRecommendationPelaporanStatusDto } from 'src/models/searchRecommendationPelaporanStatusDto';
import { eachMonthOfInterval, getYear, getMonth } from 'date-fns';
import { v4 as uuidv4 } from 'uuid'; // Import UUID library

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
      // [TipeDokumen.SDS_OR_LDK]: false,
      // [TipeDokumen.SOP_BONGKAR_MUAT]: false,
      // [TipeDokumen.SOP_TANGGAP_DARURAT]: false,
      // [TipeDokumen.STNK_KIR]: false,
      // [TipeDokumen.FOTO_KENDARAAN]: false,
      // [TipeDokumen.FOTO_SOP]: false,
      // [TipeDokumen.FOTO_KEMASAN_B3]: false,
      // [TipeDokumen.FOTO_ALAT_PELINDUNG_DIRI]: false,
      // [TipeDokumen.BUKTI_PELATIHAN]: false,
      // [TipeDokumen.SURAT_KETERANGAN_HASIL_PENGUJIAN_TANGKI_UKUR]: false,
      // [TipeDokumen.SURAT_KETERANGAN_BEJANA_TEKAN]: false,
      // [TipeDokumen.IT_IP_PREKURSOR]: false,
      // [TipeDokumen.INFORMASI_KETERSEDIAAN_ALAT_KOMUNIKASI]: false,
      // [TipeDokumen.INFORMASI_PEMELIHARAAN_KENDARAAN]: false,
      // [TipeDokumen.INFORMASI_PENCUCIAN_TANGKI]: false,
      // [TipeDokumen.SURAT_REKOMENDASI_B3_SEBELUMNYA]: false,
      // [TipeDokumen.SK_DIRJEN_PERHUBUNGAN_DARAT]: false,
      // [TipeDokumen.Other]: false,
    };

    while (retryCount <= maxRetries) {
      try {
        // Generate a unique kodePermohonan
        const kodePermohonan = generateUniqueCode();

        // Attempt to create the application
        application = await this.prisma.application.create({
          data: {
            status: StatusPermohonan.DRAFT_PERMOHONAN,
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
            newStatus: StatusPermohonan.DRAFT_PERMOHONAN,
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
        include :{ documents: true, draftSurat: {include:{pejabat:true, tembusan:true }} }
      });
      let updatedApplication;
      // Check if the new status is 'ValidasiPemohonanSelesai' and create DraftSurat if true
      if (data.status === StatusPermohonan.PEMBUATAN_DRAFT_SK ) {
        if(application.status !== data.status && (application.documents.length > 0 && application.documents.every(doc => doc.isValid === true))){
            // Log the old status and the new status in ApplicationStatusHistory
            await prisma.applicationStatusHistory.create({
              data: {
                applicationId: application.id,
                oldStatus: application.status,
                newStatus: data.status,
                changedAt: new Date(),
                changedBy: data.userId ?? undefined, // Optionally track the user who updated the status
              },
            });
        
            // Update the status of the application
            updatedApplication = await prisma.application.update({
              where: { id: data.applicationId },
              data: {
                status: data.status,
                updatedAt: new Date(),
              },
            });

          const telaah = await prisma.telaahTeknisRekomendasiB3.create({
            data: {
              application: {connect: {id: application.id}}, // NOT NULL, wajib
              company: {connect: {id: application.companyId}}, // NOT NULL, wajib (ubah sesuai kebutuhan Anda)
              tindak_lanjut: '', // Nullable
            },
          });

          // Insert TelaahTeknisDocumentNotesRekomendasiB3 records based on TipeDokumenTelaah enum
          const documentTypes = Object.values(TipeDokumenTelaah);
          for (const tipeDokumen of documentTypes) {
            try{
              await prisma.telaahTeknisDocumentNotesRekomendasiB3.create({
                data: {
                  telaahTeknisRekomendasiB3Id: telaah.id,
                  tipeDokumen: tipeDokumen,
                  isValid: false, // Default to false; this can be updated later as needed
                  notes: null,
                  changedBy: data.userId ?? undefined, // Optionally track the user who added the initial status
                },
              });
            }catch(error){
              console.log(error);
            }

          }

          const draftSurat = await prisma.draftSurat.findUnique({
            where: { applicationId: application.id },
            include :{ PermohonanRekomendasiTembusan: {include:{ DataTembusan: true }} }
          });
          
          if(draftSurat){
            await prisma.draftSurat.update({
              where: { id: draftSurat.id },
              data: {
                tipeSurat: application.tipeSurat, // NOT NULL, wajib (ubah sesuai kebutuhan Anda)
                nomorSurat: null, // Nullable
                tanggalSurat: null, // Nullable
                kodeDBKlh: null, // Nullable
                pejabatId: null, // Nullable
              },
            }); // Update DraftSurat
          }
          else{
            await prisma.draftSurat.create({
              data: {
                applicationId: application.id, // NOT NULL, wajib
                tipeSurat: application.tipeSurat, // NOT NULL, wajib (ubah sesuai kebutuhan Anda)
                nomorSurat: null, // Nullable
                tanggalSurat: null, // Nullable
                kodeDBKlh: null, // Nullable
                pejabatId: null, // Nullable
                PermohonanRekomendasiTembusan: {}, // Optional, bisa diisi atau tidak tergantung data yang tersedia
              },
            });

          }
        }
        else{
          throw new BadRequestException('Failed to update status to ValidasiPemohonanSelesai, not all documents are valid');
        }
         
      }
      else if (data?.status === StatusPermohonan.DRAFT_SK_TANDA_TANGAN_DIREKTUR) {
        if (application.draftSurat.tembusan.length === 0) {
          throw new BadRequestException(
            'Gagal memperbarui status menjadi Draft SK, tembusan belum ditambahkan',
          );
        }
        if (application.draftSurat.pejabat === null) {
          throw new BadRequestException(
            'Gagal memperbarui status menjadi Draft SK, pejabat belum ditambahkan',
          );
        }
        // Log the old status and the new status in ApplicationStatusHistory
        await prisma.applicationStatusHistory.create({
          data: {
            applicationId: application.id,
            oldStatus: application.status,
            newStatus: data.status,
            changedAt: new Date(),
            changedBy: data.userId ?? undefined, // Optionally track the user who updated the status
          },
        });
    
        // Update the status of the application
        updatedApplication = await prisma.application.update({
          where: { id: data.applicationId },
          data: {
            status: data.status,
            updatedAt: new Date(),
          },
        });
      } else if (data?.status === StatusPermohonan.SELESAI) {
        if (
          application.draftSurat.nomorSurat === null ||
          application.draftSurat.nomorSurat.trim() === ''
        ) {
          throw new BadRequestException(
            'Gagal memperbarui status menjadi Selesai, nomor surat belum diisi',
          );
        }
        if (
          application.draftSurat.tanggalSurat === null ||
          application.draftSurat.tanggalSurat.toString().trim() === ''
        ) {
          throw new BadRequestException(
            'Gagal memperbarui status menjadi Selesai, tanggal surat belum diisi',
          );
        }
        // Log the old status and the new status in ApplicationStatusHistory
        await prisma.applicationStatusHistory.create({
          data: {
            applicationId: application.id,
            oldStatus: application.status,
            newStatus: data.status,
            changedAt: new Date(),
            changedBy: data.userId ?? undefined, // Optionally track the user who updated the status
          },
        });
    
        // Update the status of the application
        updatedApplication = await prisma.application.update({
          where: { id: data.applicationId },
          data: {
            status: data.status,
            updatedAt: new Date(),
          },
        });
      }
      else if (application.status !== data.status){
        // Log the old status and the new status in ApplicationStatusHistory
        await prisma.applicationStatusHistory.create({
          data: {
            applicationId: application.id,
            oldStatus: application.status,
            newStatus: data.status,
            changedAt: new Date(),
            changedBy: data.userId ?? undefined, // Optionally track the user who updated the status
          },
        });
    
        // Update the status of the application
        updatedApplication = await prisma.application.update({
          where: { id: data.applicationId },
          data: {
            status: data.status,
            updatedAt: new Date(),
          },
        });
      }
      return {
        message: `Application status updated to ${data.status}`
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
            PermohonanRekomendasiTembusan: {
              include:{ DataTembusan: true }
            },
          },
        },
        identitasPemohon: true,  // Include Identitas Pemohon
        vehicles: {
          include: {
            vehicle: true,
          },
        },        // Optionally include draftSurat relation
        b3Substances:{
          include:{
            dataBahanB3:true,
            asalMuatLocations: true,
            tujuanBongkarLocations: true
          }
        },
        TelaahTeknisRekomendasiB3:{
          include:{
            TelaahTeknisDocumentNotesRekomendasiB3:true,
            TelaahTeknisPejabat: {include: {DataPejabat: true}}
          }}
      },
    });

    if (!application) {
      throw new NotFoundException('Application not found');
    }

    return application;
  }

   // Method to search applications based on multiple filters with pagination
  async searchApplications(searchDto: SearchApplicationDto) {
    const { companyId, applicationId, status, kodePermohonan, periodId, page, limit, sortBy, sortOrder, returnAll } = searchDto;

    // Build the dynamic where condition based on the filters provided
    const whereCondition: Prisma.ApplicationWhereInput = {
        ...(companyId && { companyId: { in: companyId } }), // Filter by multiple companyIds
        ...(applicationId && { id: { in: applicationId } }), // Filter by multiple applicationIds
        ...(status && { status: { in: status } }), // Filter by multiple statuses
        ...(kodePermohonan && { kodePermohonan: { in: kodePermohonan, mode: 'insensitive' } }), // Filter by multiple kodePermohonan
        ...(periodId && {
          KewajibanPelaporanAplikasi: {
            some: {
              periodId: { in: periodId },
            },
          },
        }),
    };

    if (returnAll){
      // Query all applications without pagination
      const applications = await this.prisma.application.findMany({
          where: whereCondition,
          orderBy: { [sortBy]: sortOrder },
          include: {
            company: true, // Optionally include company relation
            identitasPemohon: true, // Optionally include identitasPemohon relation
            vehicles: {include:{
              vehicle: {
                include:{
                  KewajibanPelaporanAplikasi:true,
                  PelaporanPengangkutan:true
                }
              }
            }}, // Optionally include vehicles relation
            documents: true, // Optionally include documents relation
            b3Substances:true,
            KewajibanPelaporanAplikasi:{
              include:{
                period:true
              }
            },
            statusHistory: true,
          },
      });

      return {
          applications,
          page: 1,
          limit: applications.length,
          total: applications.length,
      };
    }
    // Query the total count of applications for pagination
    const total = await this.prisma.application.count({ where: whereCondition });

    // Query the applications based on the dynamic where condition and include pagination
    const applications = await this.prisma.application.findMany({
        where: whereCondition,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          company: true, // Optionally include company relation
          identitasPemohon: true, // Optionally include identitasPemohon relation
          vehicles: true, // Optionally include vehicles relation
          documents: true, // Optionally include documents relation
          b3Substances:true,
          statusHistory: true,
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

    // Perform the update
    const updatedDraftSurat = await this.prisma.draftSurat.update({
      where: { id: updateData.draftId },
      data: {
        pejabatId: updatePayload.pejabatId ?? undefined,
        kodeDBKlh: updatePayload.kodeDBKlh ?? undefined,
        nomorSurat: updatePayload.nomorSurat ?? undefined,
        tipeSurat: updatePayload.tipeSurat ?? undefined,
        tanggalSurat: updatePayload.tanggalSurat ?? undefined,
        PermohonanRekomendasiTembusan: {
          deleteMany: updateData.tembusanIds ? {} : undefined, // Remove existing tembusan entries
          create: updateData.tembusanIds
                ? updateData.tembusanIds.map((tembusanId, index) => ({
                      dataTembusanId: tembusanId,
                      index: index,
                  }))
                : undefined,
        },
      },
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
            select: { PermohonanRekomendasiTembusan: {include: {DataTembusan: true}}, updatedAt: true }
          });
  
          // Filter out tembusan yang sudah ada untuk menghindari duplikasi
          const filteredTembusanIds = updateData.tembusanIds.filter(id => 
            !existingApplication.PermohonanRekomendasiTembusan.some(tembusan => tembusan.dataTembusanId === id)
          );
  
          if (filteredTembusanIds.length === 0) {
            throw new Error('Semua Data Tembusan sudah terdaftar.');
          }
  
          // Tambahkan tembusan ke aplikasi hanya jika data tidak berubah
          return await prisma.draftSurat.update({
            where: { id: updateData.applicationId, updatedAt: existingApplication.updatedAt }, // OCC check menggunakan updatedAt
            data: {
              PermohonanRekomendasiTembusan: {
                create: filteredTembusanIds.map((tembusanId, index) => ({
                  dataTembusanId: tembusanId,
                  index: index,
                })),
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
  
  async upsertTelaahTeknis(applicationId: string, data: TelaahTeknisUpsertDto) {
    // Find the existing record based on applicationId
    const application = await this.prisma.application.findFirst({
      where: { id: applicationId },
      include: { company: true },
    });

    // Find the existing record based on applicationId
    const existingRecord = await this.prisma.telaahTeknisRekomendasiB3.findFirst({
      where: { applicationId },
      include: { TelaahTeknisPejabat: {
        include:{ DataPejabat: true }
      } },
    });
    
    // If pejabat data is provided, prepare the connect and disconnect arrays
    let connectPejabat = [];
    let disconnectPejabat = [];

    if (data.pejabat) {
      const existingPejabatIds = existingRecord?.TelaahTeknisPejabat.map((p) => p.id) || [];
      const newPejabatIds = data.pejabat.map((p) => p);

      // Determine which pejabat records to connect
      connectPejabat = newPejabatIds
        .filter((id) => !existingPejabatIds.includes(id))
        .map((id) => ({ id }));

      // Determine which pejabat records to disconnect
      disconnectPejabat = existingPejabatIds
        .filter((id) => !newPejabatIds.includes(id))
        .map((id) => ({ id }));
    }
  
    if (existingRecord) {
      // If it exists, update only the provided fields
      return this.prisma.telaahTeknisRekomendasiB3.update({
        where: { id: existingRecord.id },
        data: {
          ...(data.kronologi_permohonan && { kronologi_permohonan: data.kronologi_permohonan }),
          ...(data.lain_lain && { lain_lain: data.lain_lain }),
          ...(data.tindak_lanjut && { tindak_lanjut: data.tindak_lanjut }),
          ...(data.pejabat && { TelaahTeknisPejabat: {
            deleteMany: {},
            create: data.pejabat
                  ? data.pejabat.map((pejabatId, index) => ({
                        dataPejabatId: pejabatId,
                        index: index,
                    }))
                  : undefined,
          } }),
          ...(data.printed !== undefined && { printed: data.printed }),
        },
      });
    } else {
      // Otherwise, create a new record with the provided data
      return this.prisma.telaahTeknisRekomendasiB3.create({
        data: {
          application: {connect: { id: application.id }},
          company: { connect: {id: application.companyId}},
          kronologi_permohonan: data.kronologi_permohonan || [],
          lain_lain: data.lain_lain || [],
          tindak_lanjut: data.tindak_lanjut || '',
          TelaahTeknisPejabat: {
            create: data.pejabat
                  ? data.pejabat.map((pejabatId, index) => ({
                        dataPejabatId: pejabatId,
                        index: index,
                    }))
                  : undefined,
          },
          printed: data.printed ?? existingRecord?.printed ?? false,
        },
      });
    }
  }

  async getRecommendationStatus(dto: SearchRecommendationPelaporanStatusDto) {
    const { periodId, companyIds, page, limit, sortBy, sortOrder, returnAll } = dto;

    // Ambil periode berdasarkan periodId
    const period = await this.prisma.period.findUnique({
      where: { id: periodId ?? '' },
    });

    if (!period) {
      throw  new BadRequestException('Periode tidak ditemukan');
    }

    // Buat daftar bulan berdasarkan periode
    const monthsInPeriod = eachMonthOfInterval({
      start: period.startPeriodDate,
      end: period.endPeriodDate,
    }).map((date) => ({
      bulan: getMonth(date) + 1, // Bulan berbasis 1
      tahun: getYear(date),
    }));

    // Ambil semua aplikasi dengan filter companyIds jika ada
    const applicationFilters: any = {
      ...(companyIds && { companyId: { in: companyIds } }),
      ...({status: StatusPermohonan.SELESAI}),
    };

    const totalCount = await this.prisma.application.count({
      where: applicationFilters,
    });

    const applications = await this.prisma.application.findMany({
      where: applicationFilters,
      ...(returnAll
        ? {} // Abaikan pagination jika returnAll = true
        : {
            take: limit,
            skip: (page - 1) * limit,
          }),
      include: {
        company: true, // Termasuk data perusahaan
      },
      orderBy: { [sortBy]: sortOrder.toLowerCase() },
    });

    // Ambil kewajiban surat rekomendasi berdasarkan periode
    const kewajibanFilters: any = {
      periodId,
      ...(companyIds && { companyId: { in: companyIds } }),
    };

    const kewajiban = await this.prisma.kewajibanPelaporanAplikasi.findMany({
      where: kewajibanFilters,
    });

    // Proses data aplikasi dan kewajiban
    const result = applications.map((application) => {
      const kewajibanAplikasi = kewajiban.filter(
        (k) => k.applicationId === application.id,
      );

      // Buat respons untuk setiap bulan dalam periode
      return monthsInPeriod.flatMap(({ bulan, tahun }) => {
        const laporan = kewajibanAplikasi.find(
          (k) => k.bulan === bulan && k.tahun === tahun,
        );

        return {
          id: laporan ? laporan.id : uuidv4(), // ID dari kewajiban jika ada, jika tidak, generate UUID
          applicationId: application.id,
          applicationName: application.kodePermohonan,
          companyId: application.company.id,
          companyName: application.company.name,
          bulan,
          tahun,
          sudahDilaporkan: laporan ? laporan.sudahDilaporkan : false,
          periodId: period.id,
          periodName: period.name,
        };
      });
    });

    // Flatten hasil menjadi satu array
    return {
      total: totalCount,
      page: returnAll ? 1 : page,
      limit: returnAll ? totalCount : limit,
      data: result.flat(),
    };
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
