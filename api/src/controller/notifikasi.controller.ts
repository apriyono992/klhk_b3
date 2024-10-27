import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  HttpCode,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiQuery } from '@nestjs/swagger';
import { NotifikasiService } from '../services/notifikasi.services';
import { CreateNotifikasiDto } from '../models/createNotifikasiDto';
import { UpdateNotifikasiDto } from '../models/updateNotifikasiDto';
import { SearchNotifikasiDto } from '../models/searchNotifikasiDto';

@ApiTags('Notifikasi')
@Controller('notifikasi')
export class NotifikasiController {
  constructor(private readonly notifikasiService: NotifikasiService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new Notifikasi' })
  @ApiResponse({
    status: 201,
    description: 'The Notifikasi has been created successfully.',
    schema: {
      example: {
        id: '1f3c07a9-27c3-474f-9d76-c0c7a13e94e6',
        companyId: 'company-uuid',
        status: 'DITERIMA',
        tanggalDiterima: '2024-01-01T00:00:00.000Z',
        exceedsThreshold: false,
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      },
    },
  })
  @ApiBody({
    type: CreateNotifikasiDto,
    schema: {
      example: {
        companyId: 'company-uuid',
        status: 'DITERIMA',
        tanggalDiterima: '2024-01-01T00:00:00.000Z',
        exceedsThreshold: false,
      },
    },
  })
  async createNotifikasi(@Body() createNotifikasiDto: CreateNotifikasiDto) {
    return this.notifikasiService.createNotifikasi(createNotifikasiDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an existing Notifikasi' })
  @ApiResponse({
    status: 200,
    description: 'The Notifikasi has been updated successfully.',
    schema: {
      example: {
        id: '1f3c07a9-27c3-474f-9d76-c0c7a13e94e6',
        companyId: 'company-uuid',
        status: 'VERIFIKASI_ADM_TEK',
        tanggalDiterima: '2024-01-01T00:00:00.000Z',
        tanggalPerubahan: '2024-02-01T00:00:00.000Z',
        exceedsThreshold: false,
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-02-01T00:00:00.000Z',
      },
    },
  })
  @ApiParam({ name: 'id', description: 'ID of the Notifikasi to be updated' })
  @ApiBody({
    type: UpdateNotifikasiDto,
    schema: {
      example: {
        companyId: 'company-uuid',
        status: 'VERIFIKASI_ADM_TEK',
        tanggalDiterima: '2024-01-01T00:00:00.000Z',
        tanggalPerubahan: '2024-02-01T00:00:00.000Z',
        exceedsThreshold: false,
        notes: 'Status updated after verification process.',
      },
    },
  })
  async updateNotifikasi(@Param('id') id: string, @Body() updateNotifikasiDto: UpdateNotifikasiDto) {
    return this.notifikasiService.patchNotifikasi(id, updateNotifikasiDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a Notifikasi by ID' })
  @ApiResponse({
    status: 200,
    description: 'The Notifikasi has been found and returned.',
    schema: {
      example: {
        id: '1f3c07a9-27c3-474f-9d76-c0c7a13e94e6',
        companyId: 'company-uuid',
        status: 'DITERIMA',
        tanggalDiterima: '2024-01-01T00:00:00.000Z',
        exceedsThreshold: false,
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
        statusHistory: [
          {
            id: 'status-history-uuid',
            oldStatus: null,
            newStatus: 'DITERIMA',
            tanggalPerubahan: '2024-01-01T00:00:00.000Z',
          },
        ],
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Notifikasi not found.' })
  @ApiParam({ name: 'id', description: 'ID of the Notifikasi to retrieve' })
  async getNotifikasi(@Param('id') id: string) {
    const notifikasi = await this.notifikasiService.getNotifikasiById(id);
    if (!notifikasi) {
      throw new NotFoundException(`Notifikasi with ID ${id} not found`);
    }
    return notifikasi;
  }

  @Get()
  @ApiOperation({ summary: 'Search Notifikasis with pagination and filtering' })
  @ApiResponse({
    status: 200,
    description: 'The list of Notifikasis with applied filters.',
    schema: {
      example: {
        total: 2,
        page: 1,
        limit: 10,
        data: [
          {
            id: '1f3c07a9-27c3-474f-9d76-c0c7a13e94e6',
            companyId: 'company-uuid',
            status: 'DITERIMA',
            tanggalDiterima: '2024-01-01T00:00:00.000Z',
            exceedsThreshold: false,
            createdAt: '2024-01-01T00:00:00.000Z',
            updatedAt: '2024-01-01T00:00:00.000Z',
          },
          {
            id: '2b2f07a9-2ac3-9d76-b0c7a13e94f5',
            companyId: 'company-uuid',
            status: 'VERIFIKASI_ADM_TEK',
            tanggalDiterima: '2024-02-01T00:00:00.000Z',
            exceedsThreshold: false,
            createdAt: '2024-02-01T00:00:00.000Z',
            updatedAt: '2024-02-01T00:00:00.000Z',
          },
        ],
      },
    },
  })
  @ApiQuery({ name: 'page', required: false, description: 'Page number for pagination', example: 1 })
  @ApiQuery({ name: 'limit', required: false, description: 'Number of items per page', example: 10 })
  @ApiQuery({ name: 'companyIds', required: false, description: 'Filter by one or more company IDs' })
  @ApiQuery({ name: 'statuses', required: false, description: 'Filter by one or more statuses' })
  @ApiQuery({ name: 'startDate', required: false, description: 'Start date for filtering' })
  @ApiQuery({ name: 'endDate', required: false, description: 'End date for filtering' })
  async searchNotifikasi(@Query() searchNotifikasiDto: SearchNotifikasiDto) {
    return this.notifikasiService.searchNotifikasi(searchNotifikasiDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Soft delete a Notifikasi by updating its status to DIBATALKAN' })
  @ApiResponse({ status: 204, description: 'The Notifikasi has been soft deleted successfully.' })
  @ApiParam({ name: 'id', description: 'ID of the Notifikasi to soft delete' })
  async softDeleteNotifikasi(@Param('id') id: string) {
    await this.notifikasiService.softDeleteNotifikasi(id);
  }
}
