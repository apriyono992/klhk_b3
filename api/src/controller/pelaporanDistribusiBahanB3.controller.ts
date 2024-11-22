import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { CreatePelaporanBahanB3DistribusiDto } from 'src/models/createPelaporanBahanB3DistribusiDto';
import { RolesAccess } from 'src/models/enums/roles';
import { ReviewPelaporanBahanB3Dto } from 'src/models/reviewPelaporanBahanB3Dto';
import { SearchPelaporanBahanB3DistribusiDto } from 'src/models/searchPelaporanBahanB3DistribusiDto';
import { UpdatePelaporanBahanB3DistribusiDto } from 'src/models/updatePelaporanBahanB3DistribusiDto';
import { PelaporanDistribusiBahanB3Service } from 'src/services/pelaporanDistribusiBahanB3.services';
import { JwtAuthGuard } from 'src/utils/auth.guard';
import { RolesGuard } from 'src/utils/roles.guard';
import { Roles } from 'src/utils/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@ApiTags('Pelaporan Bahan B3 Distribusi')
@Controller('pelaporan-bahan-b3-distribusi')
export class PelaporanBahanB3DistribusiController {
  constructor(private readonly service: PelaporanDistribusiBahanB3Service) {}

  @Get('search')
  @ApiOperation({ summary: 'Cari laporan distribusi bahan B3 berdasarkan filter' })
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
              companyId: { type: 'string', format: 'uuid', example: '123e4567-e89b-12d3-a456-426614174000' },
              periodId: { type: 'string', format: 'uuid', example: '321e4567-e89b-12d3-a456-426614174999' },
              bulan: { type: 'number', example: 10 },
              tahun: { type: 'number', example: 2024 },
              dataBahanB3Id: { type: 'string', format: 'uuid', example: '111e4567-e89b-12d3-a456-426614174111' },
              jumlahB3Distribusi: { type: 'number', format: 'float', example: 200.123 },
              isDraft: { type: 'boolean', example: true },
              isFinalized: { type: 'boolean', example: false },
              isApproved: { type: 'boolean', example: false },
              company: {
                type: 'object',
                properties: {
                  name: { type: 'string', example: 'PT. Contoh Perusahaan' },
                  bidangUsaha: { type: 'string', example: 'Manufaktur' },
                  longitude: { type: 'number', example: 106.827183 },
                  latitude: { type: 'number', example: -6.175394 },
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
                  name: { type: 'string', example: 'Bahan Berbahaya' },
                },
              },
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
  async searchReports(@Query() dto: SearchPelaporanBahanB3DistribusiDto) {
    return await this.service.searchReports(dto);
  }

  @Get('find/:id')
  @ApiOperation({ summary: 'Dapatkan satu laporan distribusi berdasarkan ID' })
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
        companyId: { type: 'string', format: 'uuid', example: '123e4567-e89b-12d3-a456-426614174000' },
        periodId: { type: 'string', format: 'uuid', example: '321e4567-e89b-12d3-a456-426614174999' },
        bulan: { type: 'number', example: 10 },
        tahun: { type: 'number', example: 2024 },
        dataBahanB3Id: { type: 'string', format: 'uuid', example: '111e4567-e89b-12d3-a456-426614174111' },
        jumlahB3Distribusi: { type: 'number', format: 'float', example: 200.123 },
        isDraft: { type: 'boolean', example: true },
        isFinalized: { type: 'boolean', example: false },
        isApproved: { type: 'boolean', example: false },
        company: {
          type: 'object',
          properties: {
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
            name: { type: 'string', example: 'Bahan Berbahaya' },
          },
        },
        DataCustomerOnPelaporanDistribusiBahanB3: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              dataCustomer: {
                type: 'object',
                properties: {
                  id: { type: 'string', format: 'uuid', example: 'customerId123' },
                  namaCustomer: { type: 'string', example: 'PT. Pelanggan' },
                  alamat: { type: 'string', example: 'Jl. Pelanggan No. 1' },
                  email: { type: 'string', example: 'customer@example.com' },
                  telepon: { type: 'string', example: '08123456789' },
                },
              },
            },
          },
        },
        DataTransporterOnPelaporanDistribusiBahanB3: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              dataTransporter: {
                type: 'object',
                properties: {
                  id: { type: 'string', format: 'uuid', example: 'transporterId123' },
                  namaTransporter: { type: 'string', example: 'PT. Transporter' },
                  alamat: { type: 'string', example: 'Jl. Transporter No. 1' },
                  email: { type: 'string', example: 'transporter@example.com' },
                  telepon: { type: 'string', example: '08129876543' },
                },
              },
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

  @Roles(RolesAccess.PIC_PELAPORAN, RolesAccess.PENGELOLA, RolesAccess.SUPER_ADMIN)
  @Post()
  @ApiOperation({ summary: 'Buat laporan distribusi bahan B3' })
  @ApiResponse({
    status: 201,
    description: 'Laporan draft berhasil dibuat.',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', format: 'uuid', example: 'report123' },
        companyId: { type: 'string', format: 'uuid', example: '123e4567-e89b-12d3-a456-426614174000' },
        periodId: { type: 'string', format: 'uuid', example: '321e4567-e89b-12d3-a456-426614174999' },
        bulan: { type: 'number', example: 10 },
        tahun: { type: 'number', example: 2024 },
        dataBahanB3Id: { type: 'string', format: 'uuid', example: '111e4567-e89b-12d3-a456-426614174111' },
        jumlahB3Distribusi: { type: 'number', format: 'float', example: 150.567 },
        isDraft: { type: 'boolean', example: true },
        isFinalized: { type: 'boolean', example: false },
        isApproved: { type: 'boolean', example: false },
        dataCustomers: {
          type: 'array',
          items: { type: 'string', format: 'uuid', example: 'customerId123' },
        },
        dataTransporters: {
          type: 'array',
          items: { type: 'string', format: 'uuid', example: 'transporterId123' },
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Input tidak valid.',
  })
  async createReport(@Body() dto: CreatePelaporanBahanB3DistribusiDto) {
    return await this.service.createReport(dto);
  }

  @Roles(RolesAccess.PIC_PELAPORAN, RolesAccess.PENGELOLA, RolesAccess.SUPER_ADMIN)
  @Patch('update/:id')
  @ApiOperation({ summary: 'Update laporan draft distribusi bahan B3' })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'ID laporan draft yang akan diupdate',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Laporan draft berhasil diupdate.',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', format: 'uuid', example: 'report123' },
        dataBahanB3Id: { type: 'string', format: 'uuid', example: '111e4567-e89b-12d3-a456-426614174111' },
        bulan: { type: 'number', example: 11 },
        tahun: { type: 'number', example: 2024 },
        jumlahB3Distribusi: { type: 'number', format: 'float', example: 300.456 },
        isDraft: { type: 'boolean', example: true },
        isFinalized: { type: 'boolean', example: false },
        isApproved: { type: 'boolean', example: false },
        dataCustomers: {
          type: 'array',
          items: { type: 'string', format: 'uuid', example: 'customerId123' },
        },
        dataTransporters: {
          type: 'array',
          items: { type: 'string', format: 'uuid', example: 'transporterId123' },
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Laporan draft tidak ditemukan.',
  })
  async updateDraftReport(@Param('id') id: string, @Body() dto: UpdatePelaporanBahanB3DistribusiDto) {
    return await this.service.updateDraftReport(id, dto);
  }

  @Roles(RolesAccess.PIC_PELAPORAN, RolesAccess.PENGELOLA, RolesAccess.SUPER_ADMIN)
  @Post('finalize/:companyId/:periodId')
  @ApiOperation({ summary: 'Finalisasi laporan draft untuk periode tertentu' })
  @ApiParam({
    name: 'companyId',
    type: 'string',
    description: 'ID perusahaan yang akan difinalisasi laporan draft-nya',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiParam({
    name: 'periodId',
    type: 'string',
    description: 'ID periode yang akan difinalisasi laporan draft-nya',
    example: '321e4567-e89b-12d3-a456-426614174999',
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
  @ApiResponse({
    status: 400,
    description: 'Laporan belum lengkap. Bulan yang belum dilaporkan: Bulan 5 Tahun 2024, Bulan 6 Tahun 2024.',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: { type: 'string', example: 'Laporan belum lengkap. Bulan yang belum dilaporkan: Bulan 5 Tahun 2024, Bulan 6 Tahun 2024.' },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Periode tidak ditemukan.',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 404 },
        message: { type: 'string', example: 'Periode tidak ditemukan.' },
      },
    },
  })
  async finalizeReportsForPeriod(@Param('companyId') companyId: string, @Param('periodId') periodId: string) {
    return await this.service.finalizeReportsForPeriod(companyId, periodId);
  }

  @Roles(RolesAccess.PIC_PELAPORAN, RolesAccess.SUPER_ADMIN)
  @Post('review/:id')
  @ApiOperation({ summary: 'Review laporan distribusi bahan B3' })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'ID laporan yang akan direview',
    example: '123e4567-e89b-12d3-a456-426614174000',
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
    description: 'Laporan tidak ditemukan.',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 404 },
        message: { type: 'string', example: 'Laporan tidak ditemukan.' },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Status pengajuan tidak valid.',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: { type: 'string', example: 'Status pengajuan tidak valid.' },
      },
    },
  })
  async reviewReport(@Param('id') id: string, @Body() dto: ReviewPelaporanBahanB3Dto) {
    return await this.service.reviewReport(id, dto);
  }
}
