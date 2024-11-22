import { Get, Controller, Post, Patch, Delete, Param, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { CreatePelaporanPenggunaanBahanB3Dto } from 'src/models/createPelaporanPenggunaanBahanB3Dto';
import { ReviewPelaporanBahanB3Dto } from 'src/models/reviewPelaporanBahanB3Dto';
import { StatusPengajuan } from 'src/models/enums/statusPengajuanPelaporan';
import { PelaporanPenggunaanBahanB3Service } from 'src/services/pelaporanPenggunaanBahanB3.services';
import { UpdatePelaporanPenggunaanBahanB3Dto } from 'src/models/updatePelaporanPenggunaanB3Dto';
import { SearchPelaporanPenggunaanBahanB3Dto } from 'src/models/searchPelaporanPenggunaanBahanB3Dto';
import { RolesGuard } from 'src/utils/roles.guard';
import { JwtAuthGuard } from 'src/utils/auth.guard';
import { RolesAccess } from 'src/models/enums/roles';
import { Roles } from 'src/utils/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@ApiTags('Pelaporan Penggunaan Bahan B3')
@Controller('pelaporan-penggunaan-bahan-b3')
export class PelaporanPenggunaanBahanB3Controller {
  constructor(private readonly service: PelaporanPenggunaanBahanB3Service) {}

  @Roles(RolesAccess.PIC_PELAPORAN, RolesAccess.PENGELOLA, RolesAccess.SUPER_ADMIN)
  @Post()
  @ApiOperation({ summary: 'Buat draft laporan penggunaan bahan B3' })
  @ApiResponse({
    status: 201,
    description: 'Laporan draft berhasil dibuat.',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', format: 'uuid', example: 'report123' },
        companyId: { type: 'string', format: 'uuid', example: '123e4567-e89b-12d3-a456-426614174000' },
        dataBahanB3Id: { type: 'string', format: 'uuid', example: '111e4567-e89b-12d3-a456-426614174111' },
        bulan: { type: 'number', example: 10 },
        tahun: { type: 'number', example: 2024 },
        jumlahPembelianB3: { type: 'number', example: 150.5 },
        jumlahB3Digunakan: { type: 'number', example: 100.0 },
        isDraft: { type: 'boolean', example: true },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Input tidak valid.' })
  async createReport(@Body() dto: CreatePelaporanPenggunaanBahanB3Dto) {
    return await this.service.createReport(dto);
  }

  @Roles(RolesAccess.PIC_PELAPORAN, RolesAccess.PENGELOLA, RolesAccess.SUPER_ADMIN)
  @Patch('edit/:id')
  @ApiOperation({ summary: 'Update draft laporan penggunaan bahan B3' })
  @ApiParam({
    name: 'id',
    type: 'string',
    example: 'report123',
    description: 'ID laporan draft yang akan diupdate',
  })
  @ApiResponse({
    status: 200,
    description: 'Laporan draft berhasil diupdate.',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', format: 'uuid', example: 'report123' },
        dataBahanB3Id: { type: 'string', format: 'uuid', example: '111e4567-e89b-12d3-a456-426614174111' },
        bulan: { type: 'number', example: 10 },
        tahun: { type: 'number', example: 2024 },
        jumlahPembelianB3: { type: 'number', example: 150.5 },
        jumlahB3Digunakan: { type: 'number', example: 100.0 },
        isDraft: { type: 'boolean', example: true },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Laporan draft tidak ditemukan.' })
  async updateDraftReport(@Param('id') id: string, @Body() dto: UpdatePelaporanPenggunaanBahanB3Dto) {
    return await this.service.updateDraftReport(id, dto);
  }

  @Roles(RolesAccess.PIC_PELAPORAN, RolesAccess.PENGELOLA, RolesAccess.SUPER_ADMIN)
  @Delete('delete/:id')
  @ApiOperation({ summary: 'Hapus draft laporan penggunaan bahan B3' })
  @ApiParam({
    name: 'id',
    type: 'string',
    example: 'report123',
    description: 'ID laporan draft yang akan dihapus',
  })
  @ApiResponse({
    status: 200,
    description: 'Laporan draft berhasil dihapus.',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Laporan draft dan data supplier terkait berhasil dihapus.' },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Laporan draft tidak ditemukan.' })
  async deleteDraftReport(@Param('id') id: string) {
    return await this.service.deleteDraftReport(id);
  }

  @Roles(RolesAccess.PIC_PELAPORAN, RolesAccess.PENGELOLA, RolesAccess.SUPER_ADMIN)
  @Post('finalize/:companyId/:periodId')
  @ApiOperation({ summary: 'Finalisasi laporan draft penggunaan bahan B3' })
  @ApiParam({
    name: 'companyId',
    type: 'string',
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'ID perusahaan yang akan difinalisasi laporan draft-nya',
  })
  @ApiParam({
    name: 'periodId',
    type: 'string',
    example: '321e4567-e89b-12d3-a456-426614174999',
    description: 'ID periode yang akan difinalisasi laporan draft-nya',
  })
  @ApiResponse({
    status: 200,
    description: 'Laporan berhasil difinalisasi.',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Semua laporan dalam periode berhasil difinalisasi dan menunggu persetujuan admin.' },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Laporan belum lengkap.' })
  async finalizeReportsForPeriod(@Param('companyId') companyId: string, @Param('periodId') periodId: string) {
    return await this.service.finalizeReportsForPeriod(companyId, periodId);
  }

  @Roles(RolesAccess.PIC_PELAPORAN, RolesAccess.SUPER_ADMIN)
  @Post('review/:id')
  @ApiOperation({ summary: 'Review laporan penggunaan bahan B3' })
  @ApiParam({
    name: 'id',
    type: 'string',
    example: 'report123',
    description: 'ID laporan yang akan direview',
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
  @ApiResponse({ status: 404, description: 'Laporan tidak ditemukan.' })
  async reviewReport(@Param('id') id: string, @Body() dto: ReviewPelaporanBahanB3Dto) {
    return await this.service.reviewReport(id, dto.status, dto.adminNote);
  }

  @Get('search')
  @ApiOperation({ summary: 'Cari laporan penggunaan bahan B3 dengan filter' })
  @ApiResponse({
    status: 200,
    description: 'Data laporan ditemukan.',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string', format: 'uuid', example: 'report123' },
              companyId: { type: 'string', format: 'uuid', example: '123e4567-e89b-12d3-a456-426614174000' },
              dataBahanB3Id: { type: 'string', format: 'uuid', example: '111e4567-e89b-12d3-a456-426614174111' },
              bulan: { type: 'number', example: 10 },
              tahun: { type: 'number', example: 2024 },
              jumlahPembelianB3: { type: 'number', example: 150.5 },
              jumlahB3Digunakan: { type: 'number', example: 100.0 },
              isDraft: { type: 'boolean', example: true },
            },
          },
        },
        totalRecords: { type: 'number', example: 100 },
        currentPage: { type: 'number', example: 1 },
        totalPages: { type: 'number', example: 10 },
      },
    },
  })
  async searchReports(@Query() dto: SearchPelaporanPenggunaanBahanB3Dto) {
    return await this.service.searchReports(dto);
  }

  @Get('find/:id')
  @ApiOperation({ summary: 'Dapatkan laporan penggunaan bahan B3 berdasarkan ID' })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'ID laporan yang akan diambil',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Laporan ditemukan.',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', format: 'uuid', example: '123e4567-e89b-12d3-a456-426614174000' },
        companyId: { type: 'string', format: 'uuid', example: '123e4567-e89b-12d3-a456-426614174000' },
        dataBahanB3Id: { type: 'string', format: 'uuid', example: '111e4567-e89b-12d3-a456-426614174111' },
        bulan: { type: 'number', example: 10 },
        tahun: { type: 'number', example: 2024 },
        jumlahPembelianB3: { type: 'number', format: 'float', example: 150.567 },
        jumlahB3Digunakan: { type: 'number', format: 'float', example: 100.123 },
        isDraft: { type: 'boolean', example: true },
        isFinalized: { type: 'boolean', example: false },
        isApproved: { type: 'boolean', example: false },
        company: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid', example: '123e4567-e89b-12d3-a456-426614174000' },
            name: { type: 'string', example: 'PT. Contoh Perusahaan' },
            bidangUsaha: { type: 'string', example: 'Manufaktur' },
          },
        },
        period: {
          type: 'object',
          properties: {
            startDate: { type: 'string', format: 'date-time', example: '2024-01-01T00:00:00.000Z' },
            endDate: { type: 'string', format: 'date-time', example: '2024-12-31T00:00:00.000Z' },
          },
        },
        dataBahanB3: {
          type: 'object',
          properties: {
            name: { type: 'string', example: 'Asam Sulfat' },
            kodeB3: { type: 'string', example: 'B3-123' },
          },
        },
        DataSupplierOnPelaporanPenggunaanB3: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              dataSupplier: {
                type: 'object',
                properties: {
                  namaSupplier: { type: 'string', example: 'PT. Supplier Bahan Kimia' },
                  alamat: { type: 'string', example: 'Jl. Supplier No. 2, Bandung' },
                },
              },
            },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Laporan tidak ditemukan.' })
  async getReportById(@Param('id') id: string) {
    return await this.service.getReportById(id);
  }
}
