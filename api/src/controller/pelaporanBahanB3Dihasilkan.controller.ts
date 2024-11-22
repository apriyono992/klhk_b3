import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Query,
    UseGuards,
  } from '@nestjs/common';
  import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';
import { CreatePelaporanBahanB3DihasilkanDto } from 'src/models/createPelaporanBahanB3DihasilkanDto';
import { RolesAccess } from 'src/models/enums/roles';
import { ReviewPelaporanBahanB3Dto } from 'src/models/reviewPelaporanBahanB3Dto';
import { SearchPelaporanB3DihasilkanDto } from 'src/models/searchPelaporanBahanB3DihasilkanDto';
import { UpdatePelaporanB3DihasilkanDto } from 'src/models/updatePelaporanBahanB3DihasilkanDto';
import { PelaporanBahanB3DihasilkanService } from 'src/services/pelaporanBahanB3Dihasilkan.services';
import { JwtAuthGuard } from 'src/utils/auth.guard';
import { Roles } from 'src/utils/roles.decorator';
import { RolesGuard } from 'src/utils/roles.guard';

@UseGuards(JwtAuthGuard, RolesGuard)
  @ApiTags('Pelaporan Bahan B3 Dihasilkan')
  @Controller('pelaporan-b3-dihasilkan')
  export class PelaporanBahanB3DihasilkanController {
    constructor(private readonly service: PelaporanBahanB3DihasilkanService) {}
  
    @Roles(RolesAccess.PIC_PELAPORAN, RolesAccess.PENGELOLA, RolesAccess.SUPER_ADMIN)
    @Post()
    @ApiOperation({ summary: 'Buat laporan draft B3 yang dihasilkan' })
    @ApiBody({
      description: 'Data untuk membuat laporan draft B3 yang dihasilkan',
      schema: {
        type: 'object',
        properties: {
          tipeProduk: {
            type: 'string',
            enum: ['B3', 'NON_B3'],
            example: 'B3',
          },
          companyId: {
            type: 'string',
            format: 'uuid',
            example: '123e4567-e89b-12d3-a456-426614174000',
          },
          periodId: {
            type: 'string',
            format: 'uuid',
            example: '321e4567-e89b-12d3-a456-426614174999',
          },
          bulan: {
            type: 'number',
            example: 10,
          },
          tahun: {
            type: 'number',
            example: 2024,
          },
          prosesProduksi: {
            type: 'string',
            example: 'Proses Pengolahan Limbah B3',
          },
          dataBahanB3Id: {
            type: 'string',
            format: 'uuid',
            example: '111e4567-e89b-12d3-a456-426614174111',
          },
          jumlahB3Dihasilkan: {
            type: 'number',
            format: 'float',
            example: 123.45678,
          },
        },
      },
    })
    @ApiResponse({
      status: 201,
      description: 'Laporan draft berhasil dibuat.',
      schema: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid', example: '123e4567-e89b-12d3-a456-426614174000' },
          companyId: { type: 'string', format: 'uuid', example: '123e4567-e89b-12d3-a456-426614174000' },
          tipeProduk: { type: 'string', example: 'B3' },
          periodId: { type: 'string', format: 'uuid', example: '321e4567-e89b-12d3-a456-426614174999' },
          bulan: { type: 'number', example: 10 },
          tahun: { type: 'number', example: 2024 },
          prosesProduksi: { type: 'string', example: 'Proses Pengolahan Limbah B3' },
          dataBahanB3Id: { type: 'string', format: 'uuid', example: '111e4567-e89b-12d3-a456-426614174111' },
          jumlahB3Dihasilkan: { type: 'number', format: 'float', example: 123.45678 },
          isDraft: { type: 'boolean', example: true },
        },
      },
    })
    async createReport(@Body() dto: CreatePelaporanBahanB3DihasilkanDto) {
      return await this.service.createReport(dto);
    }
  
    @Roles(RolesAccess.PIC_PELAPORAN, RolesAccess.PENGELOLA, RolesAccess.SUPER_ADMIN)
    @Patch('update/:id')
    @ApiOperation({ summary: 'Update laporan draft B3 yang dihasilkan' })
    @ApiParam({
      name: 'id',
      type: 'string',
      description: 'ID laporan draft yang akan diupdate',
      example: '123e4567-e89b-12d3-a456-426614174000',
    })
    @ApiBody({
      description: 'Data yang akan diupdate untuk laporan draft',
      schema: {
        type: 'object',
        properties: {
          tipeProduk: {
            type: 'string',
            enum: ['B3', 'NON_B3'],
            example: 'B3',
          },
          periodId: {
            type: 'string',
            format: 'uuid',
            example: '321e4567-e89b-12d3-a456-426614174999',
          },
          bulan: {
            type: 'number',
            example: 11,
          },
          tahun: {
            type: 'number',
            example: 2024,
          },
          prosesProduksi: {
            type: 'string',
            example: 'Proses Baru',
          },
          dataBahanB3Id: {
            type: 'string',
            format: 'uuid',
            example: '111e4567-e89b-12d3-a456-426614174111',
          },
          jumlahB3Dihasilkan: {
            type: 'number',
            format: 'float',
            example: 150.6789,
          },
        },
      },
    })
    @ApiResponse({
      status: 200,
      description: 'Laporan draft berhasil diupdate.',
      schema: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid', example: '123e4567-e89b-12d3-a456-426614174000' },
          tipeProduk: { type: 'string', example: 'B3' },
          periodId: { type: 'string', format: 'uuid', example: '321e4567-e89b-12d3-a456-426614174999' },
          bulan: { type: 'number', example: 11 },
          tahun: { type: 'number', example: 2024 },
          prosesProduksi: { type: 'string', example: 'Proses Baru' },
          dataBahanB3Id: { type: 'string', format: 'uuid', example: '111e4567-e89b-12d3-a456-426614174111' },
          jumlahB3Dihasilkan: { type: 'number', format: 'float', example: 150.6789 },
          isDraft: { type: 'boolean', example: true },
          isApproved: { type: 'boolean', example: false },
        },
      },
    })
    @ApiResponse({
      status: 404,
      description: 'Laporan draft tidak ditemukan.',
    })
    @ApiResponse({
      status: 400,
      description: 'Laporan sudah difinalisasi atau sudah disetujui dan tidak dapat diedit.',
    })
    async updateDraftReport(@Param('id') id: string, @Body() dto: UpdatePelaporanB3DihasilkanDto) {
      return await this.service.updateDraftReport(id, dto);
    }
    
    @Roles(RolesAccess.PIC_PELAPORAN, RolesAccess.PENGELOLA, RolesAccess.SUPER_ADMIN)
    @Delete('delete/:id')
    @ApiOperation({ summary: 'Hapus laporan draft B3 yang dihasilkan' })
    @ApiResponse({ status: 200, description: 'Laporan draft berhasil dihapus.' })
    async deleteDraftReport(@Param('id') id: string) {
      return await this.service.deleteDraftReport(id);
    }
  
    @Roles(RolesAccess.PIC_PELAPORAN, RolesAccess.SUPER_ADMIN)
    @Patch('review/:id')
    @ApiOperation({ summary: 'Review laporan yang sudah difinalisasi' })
    @ApiParam({
      name: 'id',
      type: 'string',
      description: 'ID laporan yang akan direview',
      example: '123e4567-e89b-12d3-a456-426614174000',
    })
    @ApiBody({
      description: 'Data untuk melakukan review laporan',
      schema: {
        type: 'object',
        properties: {
          status: {
            type: 'string',
            enum: ['DISETUJUI', 'DITOLAK'],
            example: 'DISETUJUI',
          },
          adminNote: {
            type: 'string',
            example: 'Laporan sudah sesuai dan disetujui.',
          },
        },
      },
    })
    @ApiResponse({
      status: 200,
      description: 'Laporan berhasil disetujui atau ditolak.',
      schema: {
        type: 'object',
        properties: {
          message: { type: 'string', example: 'Laporan berhasil disetujui.' },
        },
      },
    })
    @ApiResponse({
      status: 404,
      description: 'Laporan tidak ditemukan atau belum difinalisasi.',
    })
    @ApiResponse({
      status: 400,
      description: 'Status pengajuan tidak valid.',
    })
    async reviewReport(@Param('id') id: string, @Body() dto: ReviewPelaporanBahanB3Dto) {
      return await this.service.reviewReport(id, dto);
    }
  
    @Roles(RolesAccess.PIC_PELAPORAN, RolesAccess.PENGELOLA, RolesAccess.SUPER_ADMIN)
    @Post('finalize/:companyId/:periodId')
    @ApiOperation({ summary: 'Finalisasi semua laporan draft untuk periode tertentu' })
    @ApiResponse({ status: 200, description: 'Laporan draft berhasil difinalisasi.' })
    async finalizeReportsForPeriod(
      @Param('companyId') companyId: string,
      @Param('periodId') periodId: string,
    ) {
      return await this.service.finalizeReportsForPeriod(companyId, periodId);
    }
  
    @Get('missing-reports/:periodId')
    @ApiOperation({ summary: 'Dapatkan daftar perusahaan yang belum melaporkan' })
    @ApiParam({
      name: 'periodId',
      type: 'string',
      description: 'ID periode yang akan dicek',
      example: '321e4567-e89b-12d3-a456-426614174999',
    })
    @ApiResponse({
      status: 200,
      description: 'Daftar perusahaan yang belum melaporkan.',
      schema: {
        type: 'object',
        properties: {
          message: { type: 'string', example: 'Daftar perusahaan yang belum melakukan pelaporan.' },
          companies: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'string', format: 'uuid', example: '123e4567-e89b-12d3-a456-426614174000' },
                name: { type: 'string', example: 'PT. Contoh Perusahaan' },
                penanggungJawab: { type: 'string', example: 'Budi Santoso' },
                alamatKantor: { type: 'string', example: 'Jl. Sudirman No. 123, Jakarta' },
                telpKantor: { type: 'string', example: '(021) 12345678' },
                emailKantor: { type: 'string', example: 'info@contohperusahaan.com' },
                npwp: { type: 'string', example: '01.234.567.8-901.000' },
                bidangUsaha: { type: 'string', example: 'Manufaktur' },
              },
            },
          },
        },
      },
    })
    @ApiResponse({
      status: 404,
      description: 'Periode tidak ditemukan.',
    })
    async getCompaniesWithoutReports(@Param('periodId') periodId: string) {
      return await this.service.getCompaniesWithoutReports(periodId);
    }
  
    @Get('missing-finalized-reports/:periodId')
    @ApiOperation({ summary: 'Dapatkan daftar perusahaan yang belum finalisasi laporan' })
    @ApiParam({
      name: 'periodId',
      type: 'string',
      description: 'ID periode yang akan dicek',
      example: '321e4567-e89b-12d3-a456-426614174999',
    })
    @ApiResponse({
      status: 200,
      description: 'Daftar perusahaan yang belum finalisasi laporan.',
      schema: {
        type: 'object',
        properties: {
          message: { type: 'string', example: 'Daftar perusahaan yang belum melakukan finalisasi laporan.' },
          companies: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'string', format: 'uuid', example: '123e4567-e89b-12d3-a456-426614174000' },
                name: { type: 'string', example: 'PT. Contoh Perusahaan' },
                penanggungJawab: { type: 'string', example: 'Budi Santoso' },
                alamatKantor: { type: 'string', example: 'Jl. Sudirman No. 123, Jakarta' },
                telpKantor: { type: 'string', example: '(021) 12345678' },
                emailKantor: { type: 'string', example: 'info@contohperusahaan.com' },
                npwp: { type: 'string', example: '01.234.567.8-901.000' },
                bidangUsaha: { type: 'string', example: 'Manufaktur' },
              },
            },
          },
        },
      },
    })
    @ApiResponse({
      status: 404,
      description: 'Periode tidak ditemukan.',
    })
    async getCompaniesWithoutFinalizedReports(@Param('periodId') periodId: string) {
      return await this.service.getCompaniesWithoutFinalizedReports(periodId);
    }

    @Get('search')
    @ApiOperation({ summary: 'Cari laporan berdasarkan filter' })
    @ApiResponse({
      status: 200,
      description: 'Data laporan berhasil ditemukan.',
      schema: {
        type: 'object',
        properties: {
          message: { type: 'string', example: 'Data laporan berhasil ditemukan.' },
          data: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'string', format: 'uuid', example: 'report123' },
                tipeProduk: { type: 'string', example: 'B3' },
                companyId: { type: 'string', format: 'uuid', example: '123e4567-e89b-12d3-a456-426614174000' },
                periodId: { type: 'string', format: 'uuid', example: '321e4567-e89b-12d3-a456-426614174999' },
                bulan: { type: 'number', example: 10 },
                tahun: { type: 'number', example: 2024 },
                prosesProduksi: { type: 'string', example: 'Proses A' },
                dataBahanB3Id: { type: 'string', format: 'uuid', example: '111e4567-e89b-12d3-a456-426614174111' },
                jumlahB3Dihasilkan: { type: 'number', format: 'float', example: 100.12345 },
                createdAt: { type: 'string', format: 'date-time', example: '2024-10-01T00:00:00.000Z' },
                updatedAt: { type: 'string', format: 'date-time', example: '2024-10-02T00:00:00.000Z' },
                isDraft: { type: 'boolean', example: true },
                isFinalized: { type: 'boolean', example: false },
                isApproved: { type: 'boolean', example: false },
              },
            },
          },
          pagination: {
            type: 'object',
            nullable: true,
            properties: {
              totalRecords: { type: 'number', example: 1 },
              currentPage: { type: 'number', example: 1 },
              totalPages: { type: 'number', example: 1 },
            },
          },
        },
      },
    })
    @ApiResponse({
      status: 400,
      description: 'Input tidak valid.',
    })
    async searchReports(@Query() dto: SearchPelaporanB3DihasilkanDto) {
      return await this.service.searchReports(dto);
    }

    @Get('find/:id')
    @ApiOperation({ summary: 'Dapatkan satu laporan berdasarkan ID, termasuk history' })
    @ApiParam({
      name: 'id',
      type: 'string',
      description: 'ID laporan yang akan diambil',
      example: '123e4567-e89b-12d3-a456-426614174000',
    })
    @ApiResponse({
      status: 200,
      description: 'Data laporan berhasil ditemukan.',
      schema: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid', example: '123e4567-e89b-12d3-a456-426614174000' },
          tipeProduk: { type: 'string', example: 'B3' },
          companyId: { type: 'string', format: 'uuid', example: '123e4567-e89b-12d3-a456-426614174000' },
          periodId: { type: 'string', format: 'uuid', example: '321e4567-e89b-12d3-a456-426614174999' },
          bulan: { type: 'number', example: 10 },
          tahun: { type: 'number', example: 2024 },
          prosesProduksi: { type: 'string', example: 'Proses A' },
          dataBahanB3Id: { type: 'string', format: 'uuid', example: '111e4567-e89b-12d3-a456-426614174111' },
          jumlahB3Dihasilkan: { type: 'number', format: 'float', example: 100.12345 },
          createdAt: { type: 'string', format: 'date-time', example: '2024-10-01T00:00:00.000Z' },
          updatedAt: { type: 'string', format: 'date-time', example: '2024-10-02T00:00:00.000Z' },
          isDraft: { type: 'boolean', example: true },
          isFinalized: { type: 'boolean', example: false },
          isApproved: { type: 'boolean', example: false },
          history: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'string', format: 'uuid', example: 'history123' },
                statusPengajuan: { type: 'string', example: 'DISETUJUI' },
                tanggalPengajuan: { type: 'string', format: 'date-time', example: '2024-10-01T00:00:00.000Z' },
                tanggalPenyelesaian: { type: 'string', format: 'date-time', example: '2024-10-05T00:00:00.000Z' },
                catatanAdmin: { type: 'string', example: 'Laporan sudah sesuai dan disetujui.' },
                createdAt: { type: 'string', format: 'date-time', example: '2024-10-01T00:00:00.000Z' },
                updatedAt: { type: 'string', format: 'date-time', example: '2024-10-05T00:00:00.000Z' },
              },
            },
          },
        },
      },
    })
    @ApiResponse({
      status: 404,
      description: 'Laporan tidak ditemukan.',
    })
    async getReportById(@Param('id') id: string) {
      return await this.service.getReportById(id);
    }
  }
  