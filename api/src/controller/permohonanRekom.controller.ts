import { Controller, Get, Post, Body, Param, Patch, BadRequestException, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBody, ApiResponse } from '@nestjs/swagger';
import { DraftSuratDto } from 'src/models/draftSuratDto';
import { StatusPermohonan } from 'src/models/enums/statusPermohonan';
import { CreateIdentitasPemohonDto } from 'src/models/identitasPemohonDto';
import { SearchApplicationDto } from 'src/models/searchPermohonanRekomendasiDto';
import { UpdateApplicationStatusDto } from 'src/models/updateApplicationStatusDto';
import { PermohonanRekomendasiB3Service } from 'src/services/permohonanRekom.services';

@ApiTags('Permohonan')
@Controller('rekom/permohonan')
export class PermohonanRekomendasiB3Controller {
  constructor(private readonly permohonanService: PermohonanRekomendasiB3Service) {}

  @Post()
  @ApiOperation({ summary: 'Create initial application and Identitas Pemohon for a company' })
  @ApiResponse({
    status: 201,
    description: 'Application and Identitas Pemohon created successfully.',
    content: {
      'application/json': {
        example: {
          message: 'Application and Identitas Pemohon created successfully',
          application: {
            id: 'app123',
            status: 'DraftPermohonan',
            tipeSurat: 'SURAT_A',
            kodePermohonan: 'B3-2024-001',
            companyId: 'company001',
            tanggalPengajuan: '2024-10-19T12:00:00.000Z',
            identitasPemohonId: 'pemohon001',
            requiredDocumentsStatus: {
              SDS_OR_LDK: false,
              Other: false,
            },
          },
          identitasPemohon: {
            id: 'pemohon001',
            namaPemohon: 'John Doe',
            alamatDomisili: 'Jakarta',
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid data for Identitas Pemohon or application.',
  })
  async createInitialApplication(@Body() createIdentitasPemohonDto: CreateIdentitasPemohonDto) {
    return this.permohonanService.createInitialApplicationWithPemohon(createIdentitasPemohonDto);
  }

  @Get('search')
  @ApiOperation({ summary: 'Search applications based on multiple filters with pagination' })
  @ApiResponse({
    status: 200,
    description: 'List of applications matching the criteria.',
    content: {
      'application/json': {
        example: {
          data: [
            {
              id: 'app123',
              kodePermohonan: 'B3-2024-001',
              companyId: 'company001',
              status: 'DraftPermohonan',
            },
          ],
          page: 1,
          limit: 10,
          total: 1,
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Invalid query parameters' })
  async searchApplications(@Query() searchDto: SearchApplicationDto) {
    if (!searchDto.page || !searchDto.limit) {
      throw new BadRequestException('Page and limit parameters are required for pagination.');
    }

    const applications = await this.permohonanService.searchApplications(searchDto);
    return applications;
  }

  @Get(':applicationId')
  @ApiOperation({ summary: 'Get a single application by its ID' })
  @ApiParam({
    name: 'applicationId',
    type: String,
    description: 'The ID of the application to retrieve',
  })
  @ApiResponse({
    status: 200,
    description: 'The application details',
    content: {
      'application/json': {
        example: {
          id: 'app123',
          kodePermohonan: 'B3-2024-001',
          status: 'DraftPermohonan',
          companyId: 'company001',
          identitasPemohon: {
            namaPemohon: 'John Doe',
            alamatDomisili: 'Jakarta',
          },
          documents: [],
          vehicles: [],
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Application not found',
  })
  async getApplicationById(@Param('applicationId') applicationId: string) {
    return this.permohonanService.getApplicationById(applicationId);
  }

  @Patch('status')
  @ApiOperation({ summary: 'Update the status of an application' })
  @ApiBody({
    type: UpdateApplicationStatusDto,
    examples: {
      example1: {
        summary: 'Valid request',
        value: {
          applicationId: 'app123',
          status: 'ValidasiPemohonanSelesai',
          userId: 'user123',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'The application status was successfully updated',
    content: {
      'application/json': {
        example: {
          message: 'Application status updated to ValidasiPemohonanSelesai',
          application: {
            id: 'app123',
            status: 'ValidasiPemohonanSelesai',
            updatedAt: '2024-10-19T12:30:00.000Z',
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request. Application ID or new status is missing.',
  })
  async updateApplicationStatus(@Body() data: UpdateApplicationStatusDto) {
    return this.permohonanService.updateApplicationStatus(data);
  }

  @Get('status-history/:applicationId')
  @ApiOperation({ summary: 'Get the status history of an application' })
  @ApiResponse({
    status: 200,
    description: 'The status history of the application',
    content: {
      'application/json': {
        example: {
          history: [
            {
              applicationId: 'app123',
              oldStatus: null,
              newStatus: 'DraftPermohonan',
              changedAt: '2024-10-19T12:00:00.000Z',
            },
            {
              applicationId: 'app123',
              oldStatus: 'DraftPermohonan',
              newStatus: 'ValidasiPemohonanSelesai',
              changedAt: '2024-10-19T12:30:00.000Z',
            },
          ],
        },
      },
    },
  })
  async getApplicationStatusHistory(@Param('applicationId') applicationId: string) {
    if (!applicationId) {
      throw new BadRequestException('Application ID is required.');
    }

    return this.permohonanService.getApplicationStatusHistory(applicationId);
  }

  @Patch('draft-surat')
  @ApiOperation({ summary: 'Update DraftSurat by ID' })
  @ApiParam({ name: 'id', description: 'ID of the DraftSurat' })
  @ApiBody({
    type: DraftSuratDto,
    examples: {
      example1: {
        summary: 'Valid request',
        value: {
          draftId: 'draft123',
          pejabatId: 'pejabat001',
          kodeDBKlh: '123-XYZ',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully updated the DraftSurat',
    content: {
      'application/json': {
        example: {
          message: 'Successfully updated the DraftSurat',
          data: {
            id: 'draft123',
            pejabatId: 'pejabat001',
            kodeDBKlh: '123-XYZ',
            nomorSurat: null,
          },
        },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'DraftSurat not found' })
  async updateDraftSurat(@Body() updateData: DraftSuratDto) {
    const updatedDraftSurat = await this.permohonanService.updateDraftSurat(updateData);
    return {
      message: 'Successfully updated the DraftSurat',
      data: updatedDraftSurat,
    };
  }
}
