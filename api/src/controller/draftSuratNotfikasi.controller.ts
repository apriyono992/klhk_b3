import { Controller, Post, Put, Get, Body, Param, HttpCode, HttpStatus, NotFoundException, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags, ApiBody, ApiParam } from '@nestjs/swagger';
import { DraftSuratNotifikasiService } from '../services/draftSuratNotifikasi.service';
import { CreateDraftSuratKebenaranImportDto } from '../models/createDraftSuratKebenaranImportDto';
import { UpdateDraftSuratKebenaranImportDto } from '../models/updateDraftSuratKebenaranDto';
import { UpdateDraftSuratExplicitConsentDto } from 'src/models/updateDraftExplicitConsentDto';
import { CreateDraftSuratExplicitConsentDto } from 'src/models/createDraftExplicitConsentDto';
import { CreateDraftSuratPersetujuanImportDto } from 'src/models/createDraftSuratPersetujuanImportDto';
import { UpdateDraftSuratPersetujuanImportDto } from 'src/models/updateDraftSuratPersetujuanImportDto';
import { JwtAuthGuard } from 'src/utils/auth.guard';
import { RolesGuard } from 'src/utils/roles.guard';

@UseGuards(JwtAuthGuard, RolesGuard)
@ApiTags('Draft Surat Kebenaran Import')
@Controller('draft-surat-notifikasi')
export class DraftSuratNotifikasiController {
  constructor(private readonly draftSuratNotifikasiService: DraftSuratNotifikasiService) {}

  @Post('kebenaran-import')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new Draft Surat Kebenaran Import' })
  @ApiBody({ type: CreateDraftSuratKebenaranImportDto })
  @ApiResponse({
    status: 201,
    description: 'The draft surat kebenaran import has been created successfully.',
    schema: {
      example: {
        id: 'draft-surat-id',
        nomorSurat: '123/ABC/2024',
        tanggalSurat: '2024-01-01',
        tipeSurat: 'Kebenaran Import',
        kodeDBKlh: 'KLHK-2024',
        sifatSurat: 'Biasa',
        emailPenerima: 'example@company.com',
        tanggalPengiriman: '2024-01-01',
        pejabatId: 'pejabat-uuid',
        customPoint1: 'Custom content for point 1',
        customPoint2: 'Custom content for point 2',
        customPoint3: 'Custom content for point 3',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      },
    },
  })
  async createDraftSuratKebenaranImport(@Body() createDraftSuratKebenaranImportDto: CreateDraftSuratKebenaranImportDto) {
    return this.draftSuratNotifikasiService.createDraftSuratKebenaranImport(createDraftSuratKebenaranImportDto);
  }

  @Put('kebenaran-import/:id')
  @ApiOperation({ summary: 'Update an existing Draft Surat Kebenaran Import' })
  @ApiParam({ name: 'id', description: 'ID of the draft surat to update' })
  @ApiBody({
    type: UpdateDraftSuratKebenaranImportDto,
    description: 'Payload for updating a draft of Kebenaran Import',
    examples: {
      example1: {
        summary: 'Update Kebenaran Import Draft Example',
        value: {
          draftNotifikasiId: 'notifikasi-id',
          nomorSurat: '123/ABC/2024',
          tanggalSurat: '2024-01-01T00:00:00.000Z',
          tanggalMaksimalSurat: '2024-12-31T00:00:00.000Z',
          tipeSurat: 'Kebenaran Import',
          kodeDBKlh: 'KLHK-2024',
          sifatSurat: 'Biasa',
          referenceNumber: 'EU-2024-1234',
          negaraAsal: 'Indonesia',
          namaPengirimNotifikasi: 'John Doe',
          perusahaanAsal: 'ABC Corp',
          emailPenerima: 'example@company.com',
          tanggalPengiriman: '2024-01-01T00:00:00.000Z',
          dataBahanB3Id: 'bahan-b3-uuid',
          tembusanIds: ['tembusan-uuid-1', 'tembusan-uuid-2'],
          pejabatId: 'pejabat-uuid',
          notifikasiId: 'notifikasi-uuid',
          customPoint1: 'Updated custom content for point 1',
          customPoint2: 'Updated custom content for point 2',
          customPoint3: 'Updated custom content for point 3',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'The draft surat kebenaran import has been updated successfully.',
    schema: {
      example: {
        id: 'draft-surat-id',
        nomorSurat: '123/ABC/2024',
        tanggalSurat: '2024-01-01',
        tanggalMaksimalSurat: '2024-12-31',
        tipeSurat: 'Kebenaran Import',
        kodeDBKlh: 'KLHK-2024',
        sifatSurat: 'Biasa',
        referenceNumber: 'EU-2024-1234',
        negaraAsal: 'Indonesia',
        namaPengirimNotifikasi: 'John Doe',
        perusahaanAsal: 'ABC Corp',
        emailPenerima: 'example@company.com',
        tanggalPengiriman: '2024-01-01',
        dataBahanB3Id: 'bahan-b3-uuid',
        tembusanIds: ['tembusan-uuid-1', 'tembusan-uuid-2'],
        pejabatId: 'pejabat-uuid',
        notifikasiId: 'notifikasi-uuid',
        customPoint1: 'Updated custom content for point 1',
        customPoint2: 'Updated custom content for point 2',
        customPoint3: 'Updated custom content for point 3',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-02T00:00:00.000Z',
      },
    },
  })
  async updateDraftSuratKebenaranImport(
    @Param('id') draftSuratId: string,
    @Body() updateDraftSuratKebenaranImportDto: UpdateDraftSuratKebenaranImportDto,
  ) {
    return this.draftSuratNotifikasiService.updateDraftSuratKebenaranImport(draftSuratId, updateDraftSuratKebenaranImportDto);
  }

  @Post('explicit-consent')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new Draft Surat Explicit Consent' })
  @ApiBody({
    type: CreateDraftSuratExplicitConsentDto,
    description: 'Payload for creating a new Explicit Consent draft',
    examples: {
      example1: {
        summary: 'Create Explicit Consent Draft Example',
        value: {
          nomorSurat: '123/ABC/2024',
          tanggalSurat: '2024-01-01T00:00:00.000Z',
          jenisExplicitConsent: 'Non Echa',
          kodeDBKlh: 'KLHK-2024',
          sifatSurat: 'Biasa',
          emailPenerima: 'example@company.com',
          referenceNumber: 'EU-2024-1234',
          negaraAsal: 'EU',
          namaExporter: 'ABC Exporter',
          tujuanImport: 'Indonesia',
          customPoint1: 'Point 1',
          customPoint2: 'Point 2',
          customPoint3: 'Point 3',
          customPoint4: 'Point 4',
          additionalInfo: 'Additional Information',
          validitasSurat: '2024-01-01T00:00:00.000Z',
          pdfHeaderId: 'active-header-id',
          tipeSuratNotifikasi: 'EXPLICIT_CONSENT_AND_PERSETUJUAN_ECHA',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'The draft surat explicit consent has been created successfully.',
    schema: {
      example: {
        id: 'explicit-consent-id',
        nomorSurat: '123/ABC/2024',
        tanggalSurat: '2024-01-01',
        jenisExplicitConsent: 'Non Echa',
        kodeDBKlh: 'KLHK-2024',
        sifatSurat: 'Biasa',
        emailPenerima: 'example@company.com',
        referenceNumber: 'EU-2024-1234',
        negaraAsal: 'EU',
        namaExporter: 'ABC Exporter',
        tujuanImport: 'Indonesia',
        customPoint1: 'Point 1',
        customPoint2: 'Point 2',
        customPoint3: 'Point 3',
        customPoint4: 'Point 4',
        additionalInfo: 'Additional Information',
        validitasSurat: '2024-01-01T00:00:00.000Z',
        pdfHeaderId: 'active-header-id',
      },
    },
  })
  async createDraftSuratExplicitConsent(@Body() dto: CreateDraftSuratExplicitConsentDto) {
    return this.draftSuratNotifikasiService.createDraftSuratExplicitConsent(dto);
  }

  @Put('explicit-consent/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update an existing Draft Surat Explicit Consent (supports ECHA)' })
  @ApiParam({ name: 'id', description: 'ID of the draft surat to update' })
  @ApiBody({
    type: UpdateDraftSuratExplicitConsentDto,
    description: 'Payload for updating a draft of Explicit Consent',
    examples: {
      example1: {
        summary: 'Complete Update Explicit Consent Draft Example',
        value: {
          nomorSurat: '123/ABC/2024',
          tanggalSurat: '2024-01-01T00:00:00.000Z',
          jenisExplicitConsent: 'ECHA',
          kodeDBKlh: 'KLHK-2024',
          sifatSurat: 'Biasa',
          emailPenerima: 'example@company.com',
          namaExporter: 'ABC Exporter',
          namaImpoter: 'XYZ Importer',
          tujuanPenggunaan: 'Industrial Manufacturing',
          tujuanImport: 'Indonesia',
          tujuanSurat: 'Request for Explicit Consent',
          referenceNumber: 'EU-2024-1234',
          negaraAsal: 'EU',
          customPoint1: 'Updated Point 1',
          customPoint2: 'Updated Point 2',
          customPoint3: 'Updated Point 3',
          customPoint4: 'Updated Point 4',
          additionalInfo: 'Updated Additional Information',
          validitasSurat: '2025-01-01T00:00:00.000Z',
          pdfHeaderId: 'active-header-id',
          nameOfChemicalSubstance: 'Chemical A',
          casNumberSubstance: '123-45-6',
          nameOfPreparation: 'Preparation A',
          nameOfChemicalInPreparation: 'Chemical A',
          concentrationInPreparation: '50%',
          casNumberPreparation: '654-32-1',
          consentToImport: true,
          useCategoryPesticide: false,
          useCategoryIndustrial: true,
          consentForOtherPreparations: false,
          allowedConcentrations: '50-100%',
          consentForPureSubstance: true,
          hasRestrictions: true,
          restrictionDetails: 'Only for industrial use',
          isTimeLimited: true,
          timeLimitDetails: '2025-12-31T00:00:00.000Z',
          sameTreatment: true,
          differentTreatmentDetails: 'N/A',
          otherRelevantInformation: 'No additional information',
          dnaInstitutionName: 'Directorate of Hazardous Substances Management',
          dnaInstitutionAddress: 'C Building, 2nd Floor, Jakarta',
          dnaContactName: 'Sugasri',
          dnaTelephone: '+62-21-85905639',
          dnaTelefax: '+62-21-85906679',
          dnaEmail: ['notifikasi_b3@yahoo.com'],
          dnaDate: '2024-01-01T00:00:00.000Z',
          notifikasiId: 'notifikasi-uuid',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'The draft surat explicit consent has been updated successfully.',
    schema: {
      example: {
        id: 'explicit-consent-id',
        nomorSurat: '123/ABC/2024',
        tanggalSurat: '2024-01-01',
        jenisExplicitConsent: 'ECHA',
        kodeDBKlh: 'KLHK-2024',
        sifatSurat: 'Biasa',
        emailPenerima: 'example@company.com',
        referenceNumber: 'EU-2024-1234',
        negaraAsal: 'EU',
        namaExporter: 'ABC Exporter',
        tujuanImport: 'Indonesia',
        customPoint1: 'Updated Point 1',
        customPoint2: 'Updated Point 2',
        customPoint3: 'Updated Point 3',
        customPoint4: 'Updated Point 4',
        additionalInfo: 'Updated Additional Information',
        validitasSurat: '2025-01-01T00:00:00.000Z',
        pdfHeaderId: 'active-header-id',
        nameOfChemicalSubstance: 'Chemical A',
        casNumberSubstance: '123-45-6',
        nameOfPreparation: 'Preparation A',
        nameOfChemicalInPreparation: 'Chemical A',
        concentrationInPreparation: '50%',
        casNumberPreparation: '654-32-1',
        consentToImport: true,
        useCategoryPesticide: false,
        useCategoryIndustrial: true,
        consentForOtherPreparations: false,
        allowedConcentrations: '50-100%',
        consentForPureSubstance: true,
        hasRestrictions: true,
        restrictionDetails: 'Only for industrial use',
        isTimeLimited: true,
        timeLimitDetails: '2025-12-31',
        sameTreatment: true,
        differentTreatmentDetails: '',
        otherRelevantInformation: 'No additional information',
        dnaInstitutionName: 'Directorate of Hazardous Substances Management',
        dnaInstitutionAddress: 'C Building, 2nd Floor, Jakarta',
        dnaContactName: 'Sugasri',
        dnaTelephone: '+62-21-85905639',
        dnaTelefax: '+62-21-85906679',
        dnaEmail: 'notifikasi_b3@yahoo.com',
        dnaDate: '2024-01-01T00:00:00.000Z',
      },
    },
  })
  async updateDraftSuratExplicitConsent(
    @Param('id') draftSuratId: string,
    @Body() dto: UpdateDraftSuratExplicitConsentDto,
  ) {
    return this.draftSuratNotifikasiService.updateDraftSuratExplicitConsent(draftSuratId, dto);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get draft surat explicit consent with related entities' })
  @ApiParam({ name: 'id', description: 'ID of the draft surat to retrieve' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved the draft surat and related entities',
    schema: {
      example: {
        "id": "draft-surat-id",
        "nomorSurat": "123/ABC/2024",
        "tanggalSurat": "2024-01-01",
        "tipeSurat": "Explicit Consent",
        "kodeDBKlh": "KLHK-2024",
        "sifatSurat": "Biasa",
        "emailPenerima": "example@company.com",
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z",
        "dataBahanB3": {
          "id": "chemical-id",
          "namaBahanKimia": "Chemical A",
          "casNumber": "123-45-6"
        },
        "pejabat": {
          "id": "pejabat-id",
          "nama": "John Doe",
          "nip": "123456789",
          "jabatan": "Director",
          "email": "johndoe@example.com"
        },
        "tembusan": [
          {
            "id": "tembusan-id",
            "nama": "Tembusan Person 1"
          },
          {
            "id": "tembusan-id-2",
            "nama": "Tembusan Person 2"
          }
        ],
        "ExplicitConsent": {
          "id": "explicit-consent-id",
          "namaExporter": "ABC Exporter",
          "tujuanImport": "Indonesia",
          "point1": "Point 1",
          "point2": "Point 2",
          "point3": "Point 3",
          "point4": "Point 4",
          "additionalInfo": "Additional Information",
          "validitasSurat": "2024-12-31T00:00:00.000Z",
          "ExplicitConsentDetails": {
            "nameOfChemicalSubstance": "Chemical A",
            "casNumberSubstance": "123-45-6",
            "nameOfPreparation": "Preparation A",
            "nameOfChemicalInPreparation": "Chemical A",
            "concentrationInPreparation": "50%",
            "casNumberPreparation": "654-32-1",
            "consentToImport": true,
            "useCategoryPesticide": false,
            "useCategoryIndustrial": true,
            "consentForOtherPreparations": false,
            "allowedConcentrations": "50-100%",
            "consentForPureSubstance": true,
            "hasRestrictions": true,
            "restrictionDetails": "Only for industrial use",
            "isTimeLimited": true,
            "timeLimitDetails": "2025-12-31",
            "sameTreatment": true,
            "differentTreatmentDetails": "",
            "otherRelevantInformation": "No additional information",
            "dnaInstitutionName": "Directorate of Hazardous Substances Management",
            "dnaInstitutionAddress": "C Building, 2nd Floor, Jakarta",
            "dnaContactName": "Sugasri",
            "dnaTelephone": "+62-21-85905639",
            "dnaTelefax": "+62-21-85906679",
            "dnaEmail": "notifikasi_b3@yahoo.com",
            "dnaDate": "2024-01-01T00:00:00.000Z"
          }
        },
        "KebenaranImport": [
          {
            "id": "kebenaran-id",
            "point1": "Kebenaran Point 1",
            "point2": "Kebenaran Point 2",
            "point3": "Kebenaran Point 3",
            "tanggalMaksimalPengiriman": "2024-12-31"
          }
        ],
        "PersetujuanImport": [
          {
            "id": "persetujuan-id",
            "point1": "Persetujuan Point 1",
            "point2": "Persetujuan Point 2",
            "point3": "Persetujuan Point 3",
            "point4": "Persetujuan Point 4",
            "validitasSurat": "2025-12-31"
          }
        ],
        "notifikasi": {
          "id": "notifikasi-id",
          "status": "Pending",
          "notes": "This is a sample note.",
          "tanggalDiterima": "2024-01-01T00:00:00.000Z",
          "company": {
            "id": "company-id",
            "name": "PT ABC Chemicals"
          }
        }
      }
    }
  })
  async getDraftSuratWithRelations(@Param('id') draftSuratId: string) {
    return this.draftSuratNotifikasiService.getDraftSuratWithRelations(draftSuratId);
  }

  @Post('persetujuan-import')
  @ApiOperation({ summary: 'Create a new Draft Surat Persetujuan Import' })
  @ApiBody({
    description: 'Request payload for creating a Draft Surat Persetujuan Import',
    type: CreateDraftSuratPersetujuanImportDto,
    examples: {
      example1: {
        summary: 'Valid request example',
        value: {
          nomorSurat: '1234/IMP',
          tanggalSurat: '2024-10-30T00:00:00Z',
          tipeSurat: 'Explicit Consent and Persetujuan ECHA',
          kodeDBKlh: 'K12345',
          sifatSurat: 'Urgent',
          emailPenerima: 'recipient@example.com',
          tanggalPengiriman: '2024-10-31T00:00:00Z',
          pejabatId: '123e4567-e89b-12d3-a456-426614174000',
          tembusanIds: ['111e4567-e89b-12d3-a456-426614174111'],
          echaSpecificData: 'ECHA-related information here',
          validitasSurat: '2024-12-31T00:00:00Z',
          referenceNumber: 'REF123456',
          negaraAsal: 'Indonesia',
          dataBahanB3Id: '222e4567-e89b-12d3-a456-426614174222',
          notifikasiId: '333e4567-e89b-12d3-a456-426614174333',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'The draft surat persetujuan import has been successfully created.',
    schema: {
      example: {
        id: '123e4567-e89b-12d3-a456-426614174000',
        nomorSurat: '1234/IMP',
        tanggalSurat: '2024-10-30T00:00:00Z',
        tipeSurat: 'Explicit Consent and Persetujuan ECHA',
        echaSpecificData: 'ECHA-related information here',
        validitasSurat: '2024-12-31T00:00:00Z',
        referenceNumber: 'REF123456',
        negaraAsal: 'Indonesia',
        createdAt: '2024-10-30T10:00:00Z',
        updatedAt: '2024-10-30T10:00:00Z',
      },
    },
  })
  async createDraftSuratPersetujuanImport(
    @Body() dto: CreateDraftSuratPersetujuanImportDto,
  ) {
    return await this.draftSuratNotifikasiService.createDraftSuratPersetujuanImport(dto);
  }

  @Put('persetujuan-import/:id')
  @ApiOperation({ summary: 'Update an existing Draft Surat Persetujuan Import' })
  @ApiParam({
    name: 'id',
    description: 'ID of the draft surat persetujuan import',
  })
  @ApiBody({
    description: 'Request payload for updating a Draft Surat Persetujuan Import',
    type: UpdateDraftSuratPersetujuanImportDto,
    examples: {
      example1: {
        summary: 'Complete Update Draft Surat Persetujuan Import Example',
        value: {
          nomorSurat: '5678/IMP',
          tanggalSurat: '2024-11-01T00:00:00Z',
          tipeSurat: 'Explicit Consent and Persetujuan ECHA',
          kodeDBKlh: 'K67890',
          sifatSurat: 'Non-Urgent',
          emailPenerima: 'update-recipient@example.com',
          tanggalPengiriman: '2024-11-02T00:00:00Z',
          pejabatId: '456e7890-e89b-12d3-a456-426614174456',
          tembusanIds: ['789e1234-e89b-12d3-a456-426614174789'],
          echaSpecificData: 'Updated ECHA-related information',
          validitasSurat: '2025-01-31T00:00:00Z',
          referenceNumber: 'REF789123',
          negaraAsal: 'Malaysia',
          dataBahanB3Id: '999e8887-e89b-12d3-a456-426614174888',
          notifikasiId: '777e6667-e89b-12d3-a456-426614174999',
          regulation: 'REACH Regulation compliance',
          nomorSuratKebenaranImport: 'KB/2024/789',
          tanggalKebenaranImport: '2024-10-15',
          nomorSuratPerusahaanPengimpor: 'IMP/2024/3456',
          tanggalDiterimaKebenaranImport: '2024-11-03',
          nomorSuratExplicitConsent: 'EXP/2024/567',
          tanggalSuratExplicitConsent: '2024-11-05',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'The draft surat persetujuan import has been successfully updated.',
    schema: {
      example: {
        id: '123e4567-e89b-12d3-a456-426614174000',
        nomorSurat: '5678/IMP',
        tanggalSurat: '2024-11-01T00:00:00Z',
        tipeSurat: 'Explicit Consent and Persetujuan ECHA',
        point1: 'Updated details on import specifications',
        point2: 'Updated additional context and requirements',
        point3: 'Updated certification of compliance',
        point4: 'Updated handling and transport precautions',
        echaSpecificData: 'Updated ECHA-related information',
        validitasSurat: '2025-01-31T00:00:00Z',
        referenceNumber: 'REF789123',
        negaraAsal: 'Malaysia',
        createdAt: '2024-10-30T10:00:00Z',
        updatedAt: '2024-11-01T10:00:00Z',
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Draft Surat with the given ID not found.' })
  async updateDraftSuratPersetujuanImport(
    @Param('id') id: string,
    @Body() dto: UpdateDraftSuratPersetujuanImportDto,
  ) {
    const draftSurat = await this.draftSuratNotifikasiService.updateDraftSuratPersetujuanImport(id, dto);
    if (!draftSurat) throw new NotFoundException(`Draft Surat with ID ${id} not found`);
    return draftSurat;
  }
}
