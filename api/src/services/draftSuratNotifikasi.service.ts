import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from './prisma.services';
import { CreateDraftSuratKebenaranImportDto } from '../models/createDraftSuratKebenaranImportDto';
import { UpdateDraftSuratKebenaranImportDto } from 'src/models/updateDraftSuratKebenaranDto';
import { CreateDraftSuratPersetujuanImportDto } from 'src/models/createDraftSuratPersetujuanImportDto';
import { UpdateDraftSuratPersetujuanImportDto } from 'src/models/updateDraftSuratPersetujuanImportDto';
import { CreateDraftSuratExplicitConsentDto } from 'src/models/createDraftExplicitConsentDto';
import { UpdateDraftSuratExplicitConsentDto } from 'src/models/updateDraftExplicitConsentDto';
import { JenisExplicitConsent } from 'src/models/enums/jenisExplicitConsent';

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
              tembusan: dto.tembusanIds ? { connect: dto.tembusanIds.map((tembusanId) => ({ id: tembusanId })) } : undefined,
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
              tembusan: dto.tembusanIds
                ? { set: dto.tembusanIds.map((tembusanId) => ({ id: tembusanId })) }
                : undefined,
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
              tembusan: dto.tembusanIds ? { connect: dto.tembusanIds.map((tembusanId) => ({ id: tembusanId })) } : undefined,
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
        where: { id },
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
              tembusan: dto.tembusanIds ? { set: dto.tembusanIds.map((tembusanId) => ({ id: tembusanId })) } : undefined,
              updatedAt: new Date(),
              referenceNumber: dto.referenceNumber ?? existingDraftSurat.notifikasi.referenceNumber,
              negaraAsal: dto.negaraAsal ?? existingDraftSurat.notifikasi.negaraAsal,
            },
          },
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
        tembusan: true, // Include tembusan details
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
        where: { status: 'active' },
      });

      if (!activePdfHeader) {
        throw new NotFoundException('No active PDFHeader found');
      }

      const draftSurat = await prisma.explicitConsent.create({
        data: {
          baseSurat: {
            create: {
              nomorSurat: dto.nomorSurat || null,
              tanggalSurat: dto.tanggalSurat || null,
              tipeSurat: dto.tipeSuratNotifikasi,
              kodeDBKlh: dto.kodeDBKlh || null,
              sifatSurat: dto.sifatSurat || null,
              emailPenerima: dto.emailPenerima || null,
              referenceNumber: dto.referenceNumber || null,
              negaraAsal: dto.negaraAsal || null,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          },
          point1: dto.customPoint1 || null,
          point2: dto.customPoint2 || null,
          point3: dto.customPoint3 || null,
          point4: dto.customPoint4 || null,
          namaExporter: dto.namaExporter || null,
          tujuanImport: dto.tujuanImport || null,
          additionalInfo: dto.additionalInfo || null,
          pdfHeader:  { connect: { id: activePdfHeader.id } } , // Link to the active PDFHeader
          validitasSurat: dto.validitasSurat || null,
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
      const existingDraftSurat = await prisma.explicitConsent.findUnique({
        where: { id },
        include: {
          baseSurat: true,
          pdfHeader: true,
          ExplicitConsentDetails: true, // Include related ExplicitConsentDetails
        },
      });
  
      if (!existingDraftSurat) {
        throw new NotFoundException(`Draft Surat with ID ${id} not found`);
      }
  
      // Fetch an active PDFHeader if not already linked or if explicitly provided in DTO
      let pdfHeaderUpdate = {};
      if (!existingDraftSurat.pdfHeader || dto.pdfHeaderId) {
        const activePdfHeader = await prisma.pDFHeader.findFirst({
          where: { status: 'active' },
        });
  
        if (!activePdfHeader) {
          throw new NotFoundException('No active PDFHeader found');
        }
  
        pdfHeaderUpdate = { pdfHeader: { connect: { id: activePdfHeader.id } } };
      }
  
      // Handle ECHA-specific logic: create or update ExplicitConsentDetails
      let echaDetailsUpdate = {};
      if (dto.jenisExplicitConsent === JenisExplicitConsent.ECHA) {
        if (existingDraftSurat.ExplicitConsentDetails?.length) {
          // Update existing ExplicitConsentDetails
          echaDetailsUpdate = {
            ExplicitConsentDetails: {
              update: {
                where: { explicitConsentId: existingDraftSurat.id },
                data: {
                  nameOfChemicalSubstance: dto.nameOfChemicalSubstance ?? existingDraftSurat.ExplicitConsentDetails[0]?.nameOfChemicalSubstance,
                  casNumberSubstance: dto.casNumberSubstance ?? existingDraftSurat.ExplicitConsentDetails[0]?.casNumberSubstance,
                  nameOfPreparation: dto.nameOfPreparation ?? existingDraftSurat.ExplicitConsentDetails[0]?.nameOfPreparation,
                  nameOfChemicalInPreparation: dto.nameOfChemicalInPreparation ?? existingDraftSurat.ExplicitConsentDetails[0]?.nameOfChemicalInPreparation,
                  concentrationInPreparation: dto.concentrationInPreparation ?? existingDraftSurat.ExplicitConsentDetails[0]?.concentrationInPreparation,
                  casNumberPreparation: dto.casNumberPreparation ?? existingDraftSurat.ExplicitConsentDetails[0]?.casNumberPreparation,
                  consentToImport: dto.consentToImport ?? existingDraftSurat.ExplicitConsentDetails[0]?.consentToImport,
                  useCategoryPesticide: dto.useCategoryPesticide ?? existingDraftSurat.ExplicitConsentDetails[0]?.useCategoryPesticide,
                  useCategoryIndustrial: dto.useCategoryIndustrial ?? existingDraftSurat.ExplicitConsentDetails[0]?.useCategoryIndustrial,
                  consentForOtherPreparations: dto.consentForOtherPreparations ?? existingDraftSurat.ExplicitConsentDetails[0]?.consentForOtherPreparations,
                  allowedConcentrations: dto.allowedConcentrations ?? existingDraftSurat.ExplicitConsentDetails[0]?.allowedConcentrations,
                  consentForPureSubstance: dto.consentForPureSubstance ?? existingDraftSurat.ExplicitConsentDetails[0]?.consentForPureSubstance,
                  hasRestrictions: dto.hasRestrictions ?? existingDraftSurat.ExplicitConsentDetails[0]?.hasRestrictions,
                  restrictionDetails: dto.restrictionDetails ?? existingDraftSurat.ExplicitConsentDetails[0]?.restrictionDetails,
                  isTimeLimited: dto.isTimeLimited ?? existingDraftSurat.ExplicitConsentDetails[0]?.isTimeLimited,
                  timeLimitDetails: dto.timeLimitDetails ?? existingDraftSurat.ExplicitConsentDetails[0]?.timeLimitDetails,
                  sameTreatment: dto.sameTreatment ?? existingDraftSurat.ExplicitConsentDetails[0]?.sameTreatment,
                  differentTreatmentDetails: dto.differentTreatmentDetails ?? existingDraftSurat.ExplicitConsentDetails[0]?.differentTreatmentDetails,
                  otherRelevantInformation: dto.otherRelevantInformation ?? existingDraftSurat.ExplicitConsentDetails[0]?.otherRelevantInformation,
                  dnaInstitutionName: dto.dnaInstitutionName ?? existingDraftSurat.ExplicitConsentDetails[0]?.dnaInstitutionName,
                  dnaInstitutionAddress: dto.dnaInstitutionAddress ?? existingDraftSurat.ExplicitConsentDetails[0]?.dnaInstitutionAddress,
                  dnaContactName: dto.dnaContactName ?? existingDraftSurat.ExplicitConsentDetails[0]?.dnaContactName,
                  dnaTelephone: dto.dnaTelephone ?? existingDraftSurat.ExplicitConsentDetails[0]?.dnaTelephone,
                  dnaTelefax: dto.dnaTelefax ?? existingDraftSurat.ExplicitConsentDetails[0]?.dnaTelefax,
                  dnaEmail: dto.dnaEmail ?? existingDraftSurat.ExplicitConsentDetails[0]?.dnaEmail,
                  dnaDate: dto.dnaDate ?? existingDraftSurat.ExplicitConsentDetails[0]?.dnaDate,
                },
              },
            },
          };
        } else {
          // Create new ExplicitConsentDetails if not exists
          echaDetailsUpdate = {
            ExplicitConsentDetails: {
              create: {
                nameOfChemicalSubstance: dto.nameOfChemicalSubstance || null,
                casNumberSubstance: dto.casNumberSubstance || null,
                nameOfPreparation: dto.nameOfPreparation || null,
                nameOfChemicalInPreparation: dto.nameOfChemicalInPreparation || null,
                concentrationInPreparation: dto.concentrationInPreparation || null,
                casNumberPreparation: dto.casNumberPreparation || null,
                consentToImport: dto.consentToImport || null,
                useCategoryPesticide: dto.useCategoryPesticide || null,
                useCategoryIndustrial: dto.useCategoryIndustrial || null,
                consentForOtherPreparations: dto.consentForOtherPreparations || null,
                allowedConcentrations: dto.allowedConcentrations || null,
                consentForPureSubstance: dto.consentForPureSubstance || null,
                hasRestrictions: dto.hasRestrictions || null,
                restrictionDetails: dto.restrictionDetails || null,
                isTimeLimited: dto.isTimeLimited || null,
                timeLimitDetails: dto.timeLimitDetails || null,
                sameTreatment: dto.sameTreatment || null,
                differentTreatmentDetails: dto.differentTreatmentDetails || null,
                otherRelevantInformation: dto.otherRelevantInformation || null,
                dnaInstitutionName: dto.dnaInstitutionName || null,
                dnaInstitutionAddress: dto.dnaInstitutionAddress || null,
                dnaContactName: dto.dnaContactName || null,
                dnaTelephone: dto.dnaTelephone || null,
                dnaTelefax: dto.dnaTelefax || null,
                dnaEmail: dto.dnaEmail || null,
                dnaDate: dto.dnaDate || null,
              },
            },
          };
        }
      }
  
      // Update the Explicit Consent Draft
      const updatedDraftSurat = await prisma.explicitConsent.update({
        where: { id },
        data: {
          baseSurat: {
            update: {
              nomorSurat: dto.nomorSurat ?? existingDraftSurat.baseSurat.nomorSurat,
              tanggalSurat: dto.tanggalSurat ?? existingDraftSurat.baseSurat.tanggalSurat,
              kodeDBKlh: dto.kodeDBKlh ?? existingDraftSurat.baseSurat.kodeDBKlh,
              sifatSurat: dto.sifatSurat ?? existingDraftSurat.baseSurat.sifatSurat,
              emailPenerima: dto.emailPenerima ?? existingDraftSurat.baseSurat.emailPenerima,
              referenceNumber: dto.referenceNumber ?? existingDraftSurat.baseSurat.referenceNumber,
              negaraAsal: dto.negaraAsal ?? existingDraftSurat.baseSurat.negaraAsal,
              updatedAt: new Date(),
            },
          },
          point1: dto.customPoint1 ?? existingDraftSurat.point1,
          point2: dto.customPoint2 ?? existingDraftSurat.point2,
          point3: dto.customPoint3 ?? existingDraftSurat.point3,
          point4: dto.customPoint4 ?? existingDraftSurat.point4,
          namaExporter: dto.namaExporter ?? existingDraftSurat.namaExporter,
          tujuanImport: dto.tujuanImport ?? existingDraftSurat.tujuanImport,
          additionalInfo: dto.additionalInfo ?? existingDraftSurat.additionalInfo,
          validitasSurat: dto.validitasSurat ?? existingDraftSurat.validitasSurat,
          updatedAt: new Date(),
          ...pdfHeaderUpdate,  // Link to the active PDFHeader if not already linked
          ...echaDetailsUpdate, // Handle ECHA-specific details creation or update
        },
      });
  
      return updatedDraftSurat;
    });
  }
  
}
