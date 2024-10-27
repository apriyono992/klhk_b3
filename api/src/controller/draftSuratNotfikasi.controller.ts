import { Controller, Post, Put, Get, Body, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags, ApiBody, ApiParam } from '@nestjs/swagger';
import { DraftSuratNotifikasiService } from '../services/draftSuratNotifikasi.service';
import { CreateDraftSuratKebenaranImportDto } from '../models/createDraftSuratKebenaranImportDto';
import { UpdateDraftSuratKebenaranImportDto } from '../models/updateDraftSuratKebenaranDto';
import { UpdateDraftSuratExplicitConsentDto } from 'src/models/updateDraftExplicitConsentDto';
import { CreateDraftSuratExplicitConsentDto } from 'src/models/createDraftExplicitConsentDto';

@ApiTags('Draft Surat Kebenaran Import')
@Controller('draft-surat-notifikasi')
export class DraftSuratNotifikasiController {
  constructor(private readonly draftSuratNotifikasiService: DraftSuratNotifikasiService) {}

  @Post()
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

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update an existing Draft Surat Kebenaran Import' })
  @ApiParam({ name: 'id', description: 'ID of the draft surat to update' })
  @ApiBody({ type: UpdateDraftSuratKebenaranImportDto })
  @ApiResponse({
    status: 200,
    description: 'The draft surat kebenaran import has been updated successfully.',
    schema: {
      example: {
        id: 'draft-surat-id',
        nomorSurat: '123/ABC/2024',
        tanggalSurat: '2024-01-01',
        kodeDBKlh: 'KLHK-2024',
        sifatSurat: 'Biasa',
        emailPenerima: 'example@company.com',
        tanggalPengiriman: '2024-01-01',
        pejabatId: 'pejabat-uuid',
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

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new Draft Surat Explicit Consent' })
  @ApiBody({ type: CreateDraftSuratExplicitConsentDto })
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

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update an existing Draft Surat Explicit Consent (supports ECHA)' })
  @ApiParam({ name: 'id', description: 'ID of the draft surat to update' })
  @ApiBody({ type: UpdateDraftSuratExplicitConsentDto })
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
}
