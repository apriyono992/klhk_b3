import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from './prisma.services';
import { CreateDraftSuratKebenaranImportDto } from '../models/createDraftSuratKebenaranImportDto';
import { UpdateDraftSuratKebenaranImportDto } from 'src/models/updateDraftSuratKebenaranDto';
import { CreateDraftSuratPersetujuanImportDto } from 'src/models/createDraftSuratPersetujuanImportDto';
import { UpdateDraftSuratPersetujuanImportDto } from 'src/models/updateDraftSuratPersetujuanImportDto';
import { CreateDraftSuratExplicitConsentDto } from 'src/models/createDraftExplicitConsentDto';
import { UpdateDraftSuratExplicitConsentDto } from 'src/models/updateDraftExplicitConsentDto';
import { JenisExplicitConsent } from 'src/models/enums/jenisExplicitConsent';
import { TipeSuratNotifikasi } from 'src/models/enums/tipeSuratNotifikasi';

@Injectable()
export class DraftSuratNotifikasiService {
  constructor(private readonly prisma: PrismaService) {}

  // Method for creating Draft Surat Kebenaran Import
  // Method for creating Draft Surat Kebenaran Import with transaction
  async createDraftSuratKebenaranImport(dto: CreateDraftSuratKebenaranImportDto) {
    return await this.prisma.$transaction(async (prisma) => {
      const draftSurat = await prisma.kebenaranImport.create({
        data: {
          baseSurat: {
            create: {
              nomorSurat: dto.nomorSurat || undefined, 
              tanggalSurat: dto.tanggalSurat || undefined,
              tipeSurat: dto.tipeSurat,
              kodeDBKlh: dto.kodeDBKlh || undefined,
              sifatSurat: dto.sifatSurat || undefined,
              emailPenerima: dto.emailPenerima || undefined,
              tanggalPengiriman: dto.tanggalPengiriman || undefined,
              pejabat: dto.pejabatId ? { connect: { id: dto.pejabatId } } : undefined,
              notifikasi: dto.notifikasiId ? { connect: { id: dto.notifikasiId } } : null,
              NotifikasiTembusan: {
                create: dto.tembusanIds
                      ? dto.tembusanIds.map((tembusanId, index) => ({
                            dataTembusanId: tembusanId,
                            index: index,
                        }))
                      : [],
              },
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          },
          point1: dto.customPoint1 || undefined,
          point2: dto.customPoint2 || undefined,
          point3: dto.customPoint3 || undefined,
          tanggalMaksimalPengiriman: dto.tanggalMaksimalPengirimanSurat || undefined,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      // Update the associated Notifikasi with referenceNumber, negaraAsal, and dataBahanB3Id
      if (dto.notifikasiId) {
        await prisma.notifikasi.update({
          where: { id: dto.notifikasiId },
          data: {
            dataBahanB3: dto.dataBahanB3Id ? { connect: { id: dto.dataBahanB3Id } } : undefined,
            referenceNumber: dto.referenceNumber || undefined,
            negaraAsal: dto.negaraAsal || undefined,
          },
        });
      }

      return draftSurat;
    });
  }

  // Method for updating Draft Surat Kebenaran Import with transaction
  async updateDraftSuratKebenaranImport(id: string, dto: UpdateDraftSuratKebenaranImportDto) {
    return await this.prisma.$transaction(async (prisma) => {
      const existingDraftSurat = await prisma.baseSuratNotfikasi.findUnique({
        where: { id },
        include: { KebenaranImport: true, notifikasi: true },
      });

      if (!existingDraftSurat) {
        throw new NotFoundException(`Draft Surat with ID ${id} not found`);
      }

      const updatedDraftSurat = await prisma.kebenaranImport.update({
        where: { id: existingDraftSurat.KebenaranImport[0].id },
        data: {
          baseSurat: {
            update: {
              nomorSurat: dto.nomorSurat ?? existingDraftSurat.nomorSurat,
              tanggalSurat: dto.tanggalSurat ?? existingDraftSurat.tanggalSurat,
              kodeDBKlh: dto.kodeDBKlh ?? existingDraftSurat.kodeDBKlh,
              sifatSurat: dto.sifatSurat ?? existingDraftSurat.sifatSurat,
              tipeSurat: dto.tipeSurat ?? existingDraftSurat.tipeSurat,
              emailPenerima: dto.emailPenerima ?? existingDraftSurat.emailPenerima,
              tanggalPengiriman: dto.tanggalPengiriman ?? existingDraftSurat.tanggalPengiriman,
              pejabat: dto.pejabatId ? { connect: { id: dto.pejabatId } } : undefined,
              NotifikasiTembusan: {
                deleteMany: dto.tembusanIds
                ?  {} : undefined, // Remove existing tembusan entries
                create: dto.tembusanIds
                      ? dto.tembusanIds.map((tembusanId, index) => ({
                            dataTembusanId: tembusanId,
                            index: index,
                        }))
                      : undefined,
              },
              updatedAt: new Date(),
              referenceNumber: dto.referenceNumber ?? existingDraftSurat.notifikasi.referenceNumber,
              negaraAsal: dto.negaraAsal ?? existingDraftSurat.notifikasi.negaraAsal,
              namaPengirimNotifikasi: dto.namaPengirimNotifikasi ?? existingDraftSurat.namaPengirimNotifikasi,           
              perusaahaanAsal: dto.perusaahaanAsal ?? existingDraftSurat.perusaahaanAsal,
            },
          },
          point1: dto.customPoint1 ?? existingDraftSurat.KebenaranImport[0].point1,
          point2: dto.customPoint2 ?? existingDraftSurat.KebenaranImport[0].point2,
          point3: dto.customPoint3 ?? existingDraftSurat.KebenaranImport[0].point3,
          tanggalMaksimalPengiriman: dto.tanggalMaksimalSurat ?? existingDraftSurat.KebenaranImport[0].tanggalMaksimalPengiriman,
          updatedAt: new Date(),
          
        },
      });

      // Update the associated Notifikasi with referenceNumber, negaraAsal, and dataBahanB3Id
      if (dto.notifikasiId) {
        await prisma.notifikasi.update({
          where: { id: dto.notifikasiId },
          data: {
            dataBahanB3Id: dto.dataBahanB3Id ?? existingDraftSurat.notifikasi.dataBahanB3Id,
          },
        });
      }

      return updatedDraftSurat;
    });
  }

  // Method for creating Draft Surat Persetujuan Import with transaction
  async createDraftSuratPersetujuanImport(dto: CreateDraftSuratPersetujuanImportDto) {
    return await this.prisma.$transaction(async (prisma) => {
      const draftSurat = await prisma.persetujuanImport.create({
        data: {
          baseSurat: {
            create: {
              nomorSurat: dto.nomorSurat || undefined,
              tanggalSurat: dto.tanggalSurat || undefined,
              tipeSurat: dto.tipeSurat,
              kodeDBKlh: dto.kodeDBKlh || undefined,
              sifatSurat: dto.sifatSurat || undefined,
              emailPenerima: dto.emailPenerima || undefined,
              tanggalPengiriman: dto.tanggalPengiriman || undefined,
              pejabat: dto.pejabatId ? { connect: { id: dto.pejabatId } } : undefined,
              NotifikasiTembusan: {
                create: dto.tembusanIds
                      ? dto.tembusanIds.map((tembusanId, index) => ({
                            dataTembusanId: tembusanId,
                            index: index,
                        }))
                      : [],
              },
              notifikasi: dto.notifikasiId ? { connect: { id: dto.notifikasiId } } : null,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          },
          point1: dto.customPoint1 || undefined,
          point2: dto.customPoint2 || undefined,
          point3: dto.customPoint3 || undefined,
          point4: dto.customPoint4 || undefined,
          echaSpecificData: dto.echaSpecificData || undefined,
          validitasSurat: dto.validitasSurat || undefined,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      // Update the associated Notifikasi with referenceNumber, negaraAsal, and dataBahanB3Id
      if (dto.notifikasiId) {
        await prisma.notifikasi.update({
          where: { id: dto.notifikasiId },
          data: {
            dataBahanB3Id: dto.dataBahanB3Id || undefined,
          },
        });
      }

      return draftSurat;
    });
  }

  // Method for updating Draft Surat Persetujuan Import with transaction
  async updateDraftSuratPersetujuanImport(id: string, dto: UpdateDraftSuratPersetujuanImportDto) {
    return await this.prisma.$transaction(async (prisma) => {
      const existingDraftSurat = await prisma.baseSuratNotfikasi.findUnique({
        where: { id },
        include: { notifikasi: true, PersetujuanImport: true },
      });

      if (!existingDraftSurat) {
        throw new NotFoundException(`Draft Surat with ID ${id} not found`);
      }

      const updatedDraftSurat = await prisma.persetujuanImport.update({
        where: { id: existingDraftSurat.PersetujuanImport[0].id },
        data: {
          baseSurat: {
            update: {
              nomorSurat: dto.nomorSurat ?? existingDraftSurat.nomorSurat,
              tanggalSurat: dto.tanggalSurat ?? existingDraftSurat.tanggalSurat,
              kodeDBKlh: dto.kodeDBKlh ?? existingDraftSurat.kodeDBKlh,
              sifatSurat: dto.sifatSurat ?? existingDraftSurat.sifatSurat,
              emailPenerima: dto.emailPenerima ?? existingDraftSurat.emailPenerima,
              tanggalPengiriman: dto.tanggalPengiriman ?? existingDraftSurat.tanggalPengiriman,
              pejabat: dto.pejabatId ? { connect: { id: dto.pejabatId } } : undefined,
              NotifikasiTembusan: {
                deleteMany: dto.tembusanIds
                ? {} : undefined, // Remove existing tembusan entries
                create: dto.tembusanIds
                      ? dto.tembusanIds.map((tembusanId, index) => ({
                            dataTembusanId: tembusanId,
                            index: index,
                        }))
                      : undefined,
              },
              updatedAt: new Date(),
              referenceNumber: dto.referenceNumber ?? existingDraftSurat.notifikasi.referenceNumber,
              negaraAsal: dto.negaraAsal ?? existingDraftSurat.notifikasi.negaraAsal,
            },
          },
          regulation: dto.regulation ?? existingDraftSurat.PersetujuanImport[0].regulation,
          nomorSuratKebenaranImport: dto.nomorSuratKebenaranImport ?? existingDraftSurat.PersetujuanImport[0].nomorSuratKebenaranImport,
          tanggalKebenaranImport: dto.tanggalSuratKebenaranImport ?? existingDraftSurat.PersetujuanImport[0].tanggalKebenaranImport,
          nomorSuratPerusahaanPengimpor: dto.nomorSuratPerusahaanPengimpor ?? existingDraftSurat.PersetujuanImport[0].nomorSuratPerusahaanPengimpor,
          tanggalDiterimaKebenaranImport: dto.tanggalDiterimaKebenaranImport ?? existingDraftSurat.PersetujuanImport[0].tanggalDiterimaKebenaranImport,
          nomorSuratExplicitConsent: dto.nomorSuratExplicitConsent ?? existingDraftSurat.PersetujuanImport[0].nomorSuratExplicitConsent,
          tanggalSuratExplicitConsent: dto.tanggalSuratExplicitConsent ?? existingDraftSurat.PersetujuanImport[0].tanggalSuratExplicitConsent,
          point1: dto.customPoint1 ?? existingDraftSurat.PersetujuanImport[0].point1,
          point2: dto.customPoint2 ?? existingDraftSurat.PersetujuanImport[0].point2,
          point3: dto.customPoint3 ?? existingDraftSurat.PersetujuanImport[0].point3,
          point4: dto.customPoint4 ?? existingDraftSurat.PersetujuanImport[0].point4,
          echaSpecificData: dto.echaSpecificData || existingDraftSurat.PersetujuanImport[0].echaSpecificData,
          validitasSurat: dto.validitasSurat || existingDraftSurat.PersetujuanImport[0].validitasSurat,
          updatedAt: new Date(),
        },
      });

      // Update the associated Notifikasi with referenceNumber, negaraAsal, and dataBahanB3Id
      if (dto.notifikasiId) {
        await prisma.notifikasi.update({
          where: { id: dto.notifikasiId },
          data: {
            dataBahanB3Id: dto.dataBahanB3Id ?? existingDraftSurat.notifikasi?.dataBahanB3Id,
          },
        });
      }

      return updatedDraftSurat;
    });
  }

  async getDraftSuratWithRelations(draftSuratId: string) {
    const draftSurat = await this.prisma.baseSuratNotfikasi.findUnique({
      where: { id: draftSuratId },
      include: {
        dataBahanB3: true, // Include chemical details
        pejabat: true, // Include pejabat details
        NotifikasiTembusan: {include:{
          DataTembusan: true, // Include tembusan details
        }}, // Include tembusan details
        ExplicitConsent: {include: {
          ExplicitConsentDetails: true, // Include related ExplicitConsentDetails
        }}, // Include Explicit Consent specific fields
        KebenaranImport: true, // Include Kebenaran Import specific fields
        PersetujuanImport: true, // Include Persetujuan Import specific fields
        notifikasi: {
          include: {
            company: true, // Include company details
          },
        },
      },
    });
  
    if (!draftSurat) {
      throw new NotFoundException(`DraftSuratNotifikasi with ID ${draftSuratId} not found`);
    }
  
    return draftSurat;
  }

  // Method for creating Draft Surat Explicit Consent with active PDFHeader
  async createDraftSuratExplicitConsent(dto: CreateDraftSuratExplicitConsentDto) {
    return await this.prisma.$transaction(async (prisma) => {
      // Fetch an active PDFHeader
      const activePdfHeader = await prisma.pDFHeader.findFirst({
        where: { status: 'Active' },
      });

      if (!activePdfHeader) {
        throw new NotFoundException('No active PDFHeader found');
      }

      const draftSurat = await prisma.explicitConsent.create({
        data: {
          baseSurat: {
            create: {
              nomorSurat: dto.nomorSurat || undefined,
              tanggalSurat: dto.tanggalSurat || undefined,
              tipeSurat: dto.tipeSuratNotifikasi,
              kodeDBKlh: dto.kodeDBKlh || undefined,
              sifatSurat: dto.sifatSurat || undefined,
              emailPenerima: dto.emailPenerima || undefined,
              referenceNumber: dto.referenceNumber || undefined,
              negaraAsal: dto.negaraAsal || undefined,
              notifikasi: dto.notifikasiId ? { connect: { id: dto.notifikasiId } } : null,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          },
          point1: dto.customPoint1 || undefined,
          point2: dto.customPoint2 || undefined,
          point3: dto.customPoint3 || undefined,
          point4: dto.customPoint4 || undefined,
          namaExporter: dto.namaExporter || undefined,
          tujuanImport: dto.tujuanImport || undefined,
          pdfHeader:  { connect: { id: activePdfHeader.id } } , // Link to the active PDFHeader
          validitasSurat: dto.validitasSurat || undefined,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      return draftSurat;
    });
  }
  
  async updateDraftSuratExplicitConsent(id: string, dto: UpdateDraftSuratExplicitConsentDto) {
    return await this.prisma.$transaction(async (prisma) => {
      // Fetch the existing draft
      const existingDraftSurat = await prisma.baseSuratNotfikasi.findUnique({
        where: { id },
        include: { notifikasi: true, ExplicitConsent: {include: {pdfHeader: true}} },
      });

      if (!existingDraftSurat) {
        throw new NotFoundException(`Draft Surat with ID ${id} not found`);
      }

      const existingExplitcit = await prisma.explicitConsent.findUnique({
        where: { id: existingDraftSurat.ExplicitConsent[0].id },
        include: {
          baseSurat: true,
          pdfHeader: true,
          ExplicitConsentDetails: true, // Include related ExplicitConsentDetails
        },
      });
  
      // Fetch an active PDFHeader if not already linked or if explicitly provided in DTO
      let pdfHeaderUpdate = {};
      if (!existingExplitcit.pdfHeader || dto.pdfHeaderId) {
        const activePdfHeader = await prisma.pDFHeader.findFirst({
          where: { status: 'Active' },
        });
  
        if (!activePdfHeader) {
          throw new NotFoundException('No active PDFHeader found');
        }
  
        pdfHeaderUpdate = { pdfHeader: { connect: { id: activePdfHeader.id } } };
      }
  
      // Handle ECHA-specific logic: create or update ExplicitConsentDetails
      let echaDetailsUpdate = {};
      if (existingDraftSurat.tipeSurat === TipeSuratNotifikasi.EXPLICIT_CONSENT_AND_PERSETUJUAN_ECHA) {
        if (existingExplitcit.ExplicitConsentDetails?.length) {
          // Update existing ExplicitConsentDetails
          echaDetailsUpdate = {
            ExplicitConsentDetails: {
              update: {
                where: { id: existingExplitcit.ExplicitConsentDetails[0]?.id },
                data: {
                  nameOfChemicalSubstance: dto.nameOfChemicalSubstance ?? existingExplitcit.ExplicitConsentDetails[0]?.nameOfChemicalSubstance,
                  casNumberSubstance: dto.casNumberSubstance ?? existingExplitcit.ExplicitConsentDetails[0]?.casNumberSubstance,
                  nameOfPreparation: dto.nameOfPreparation ?? existingExplitcit.ExplicitConsentDetails[0]?.nameOfPreparation,
                  nameOfChemicalInPreparation: dto.nameOfChemicalInPreparation ?? existingExplitcit.ExplicitConsentDetails[0]?.nameOfChemicalInPreparation,
                  concentrationInPreparation: dto.concentrationInPreparation ?? existingExplitcit.ExplicitConsentDetails[0]?.concentrationInPreparation,
                  casNumberPreparation: dto.casNumberPreparation ?? existingExplitcit.ExplicitConsentDetails[0]?.casNumberPreparation,
                  consentToImport: dto.consentToImport ?? existingExplitcit.ExplicitConsentDetails[0]?.consentToImport,
                  useCategoryPesticide: dto.useCategoryPesticide ?? existingExplitcit.ExplicitConsentDetails[0]?.useCategoryPesticide,
                  useCategoryIndustrial: dto.useCategoryIndustrial ?? existingExplitcit.ExplicitConsentDetails[0]?.useCategoryIndustrial,
                  consentForOtherPreparations: dto.consentForOtherPreparations ?? existingExplitcit.ExplicitConsentDetails[0]?.consentForOtherPreparations,
                  allowedConcentrations: dto.allowedConcentrations ?? existingExplitcit.ExplicitConsentDetails[0]?.allowedConcentrations,
                  consentForPureSubstance: dto.consentForPureSubstance ?? existingExplitcit.ExplicitConsentDetails[0]?.consentForPureSubstance,
                  hasRestrictions: dto.hasRestrictions ?? existingExplitcit.ExplicitConsentDetails[0]?.hasRestrictions,
                  restrictionDetails: dto.restrictionDetails ?? existingExplitcit.ExplicitConsentDetails[0]?.restrictionDetails,
                  isTimeLimited: dto.isTimeLimited ?? existingExplitcit.ExplicitConsentDetails[0]?.isTimeLimited,
                  timeLimitDetails: dto.timeLimitDetails ?? existingExplitcit.ExplicitConsentDetails[0]?.timeLimitDetails,
                  sameTreatment: dto.sameTreatment ?? existingExplitcit.ExplicitConsentDetails[0]?.sameTreatment,
                  differentTreatmentDetails: dto.differentTreatmentDetails ?? existingExplitcit.ExplicitConsentDetails[0]?.differentTreatmentDetails,
                  otherRelevantInformation: dto.otherRelevantInformation ?? existingExplitcit.ExplicitConsentDetails[0]?.otherRelevantInformation,
                  dnaInstitutionName: dto.dnaInstitutionName ?? existingExplitcit.ExplicitConsentDetails[0]?.dnaInstitutionName,
                  dnaInstitutionAddress: dto.dnaInstitutionAddress ?? existingExplitcit.ExplicitConsentDetails[0]?.dnaInstitutionAddress,
                  dnaContactName: dto.dnaContactName ?? existingExplitcit.ExplicitConsentDetails[0]?.dnaContactName,
                  dnaTelephone: dto.dnaTelephone ?? existingExplitcit.ExplicitConsentDetails[0]?.dnaTelephone,
                  dnaTelefax: dto.dnaTelefax ?? existingExplitcit.ExplicitConsentDetails[0]?.dnaTelefax,
                  dnaEmail: dto.dnaEmail ?? existingExplitcit.ExplicitConsentDetails[0]?.dnaEmail,
                  dnaDate: dto.dnaDate ?? existingExplitcit.ExplicitConsentDetails[0]?.dnaDate,
                },
              },
            },
          };
        } else {
          // Create new ExplicitConsentDetails if not exists
          echaDetailsUpdate = {
            ExplicitConsentDetails: {
              create: {
                nameOfChemicalSubstance: dto.nameOfChemicalSubstance || undefined,
                casNumberSubstance: dto.casNumberSubstance || undefined,
                nameOfPreparation: dto.nameOfPreparation || undefined,
                nameOfChemicalInPreparation: dto.nameOfChemicalInPreparation || undefined,
                concentrationInPreparation: dto.concentrationInPreparation || undefined,
                casNumberPreparation: dto.casNumberPreparation || undefined,
                consentToImport: dto.consentToImport || undefined,
                useCategoryPesticide: dto.useCategoryPesticide || undefined,
                useCategoryIndustrial: dto.useCategoryIndustrial || undefined,
                consentForOtherPreparations: dto.consentForOtherPreparations || undefined,
                allowedConcentrations: dto.allowedConcentrations || undefined,
                consentForPureSubstance: dto.consentForPureSubstance || undefined,
                hasRestrictions: dto.hasRestrictions || undefined,
                restrictionDetails: dto.restrictionDetails || undefined,
                isTimeLimited: dto.isTimeLimited || undefined,
                timeLimitDetails: dto.timeLimitDetails || undefined,
                sameTreatment: dto.sameTreatment || undefined,
                differentTreatmentDetails: dto.differentTreatmentDetails || undefined,
                otherRelevantInformation: dto.otherRelevantInformation || undefined,
                dnaInstitutionName: dto.dnaInstitutionName || undefined,
                dnaInstitutionAddress: dto.dnaInstitutionAddress || undefined,
                dnaContactName: dto.dnaContactName || undefined,
                dnaTelephone: dto.dnaTelephone || undefined,
                dnaTelefax: dto.dnaTelefax || undefined,
                dnaEmail: dto.dnaEmail || [],
                dnaDate: dto.dnaDate || undefined,
              },
            },
          };
        }
      }
  
      // Update the Explicit Consent Draft
      const updatedDraftSurat = await prisma.explicitConsent.update({
        where: { id: existingExplitcit.id },
        data: {
          baseSurat: {
            update: {
              nomorSurat: dto.nomorSurat ?? existingExplitcit.baseSurat.nomorSurat,
              tanggalSurat: dto.tanggalSurat ?? existingExplitcit.baseSurat.tanggalSurat,
              kodeDBKlh: dto.kodeDBKlh ?? existingExplitcit.baseSurat.kodeDBKlh,
              sifatSurat: dto.sifatSurat ?? existingExplitcit.baseSurat.sifatSurat,
              emailPenerima: dto.emailPenerima ?? existingExplitcit.baseSurat.emailPenerima,
              referenceNumber: dto.referenceNumber ?? existingExplitcit.baseSurat.referenceNumber,
              negaraAsal: dto.negaraAsal ?? existingExplitcit.baseSurat.negaraAsal,
              pejabat: dto.pejabatId ? { connect: { id: dto.pejabatId } } : undefined,
              NotifikasiTembusan: {
                deleteMany: dto.tembusanIds
                ?  {} : undefined, // Remove existing tembusan entries
                create: dto.tembusanIds
                      ? dto.tembusanIds.map((tembusanId, index) => ({
                            dataTembusanId: tembusanId,
                            index: index,
                        }))
                      : undefined,
              },
              updatedAt: new Date(),
            },
          },
          point1: dto.customPoint1 ?? existingExplitcit.point1,
          point2: dto.customPoint2 ?? existingExplitcit.point2,
          point3: dto.customPoint3 ?? existingExplitcit.point3,
          point4: dto.customPoint4 ?? existingExplitcit.point4,
          namaExporter: dto.namaExporter ?? existingExplitcit.namaExporter,
          tujuanImport: dto.tujuanImport ?? existingExplitcit.tujuanImport,
          namaImpoter: dto.namaImpoter ?? existingExplitcit.namaImpoter,
          tujuanPenggunaan: dto.tujuanPenggunaan ?? existingExplitcit.tujuanPenggunaan,
          tujuanSurat: dto.tujuanSurat ?? existingExplitcit.tujuanSurat,
          validitasSurat: dto.validitasSurat ?? existingExplitcit.validitasSurat,
          updatedAt: new Date(),
          ...pdfHeaderUpdate,  // Link to the active PDFHeader if not already linked
          ...echaDetailsUpdate, // Handle ECHA-specific details creation or update
        },
      });
  
      return updatedDraftSurat;
    });
  }
  
}
