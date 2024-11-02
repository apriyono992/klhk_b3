import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags, ApiQuery } from '@nestjs/swagger';
import { PengangkutanStatistikService } from 'src/services/pelaporanPengakutanStatistik.services';

@ApiTags('Pengangkutan Statistik')
@Controller('pengangkutan-statistik')
export class PengangkutanStatistikController {
  constructor(private readonly statistikService: PengangkutanStatistikService) {}

  @Get('top-b3-substances')
  @ApiOperation({ summary: 'Get top B3 substances transported within a time range' })
  @ApiQuery({ name: 'startDate', description: 'Start date of the range', example: '2024-01-01' })
  @ApiQuery({ name: 'endDate', description: 'End date of the range', example: '2024-12-31' })
  @ApiQuery({ name: 'limit', description: 'Limit the number of results', example: 5, required: false })
  @ApiQuery({ name: 'applicationId', description: 'Filter by Application ID', required: false })
  @ApiQuery({ name: 'perusahaanId', description: 'Filter by Company ID', required: false })
  @ApiResponse({
    status: 200,
    description: 'Top B3 substances retrieved successfully.',
    schema: {
      example: [
        { namaB3: 'Asam Sulfat', jumlahB3: 1500 },
        { namaB3: 'Amonium Nitrat', jumlahB3: 1200 }
      ]
    }
  })
  async getB3Substances(
    @Query('startDate') startDate: Date,
    @Query('endDate') endDate: Date,
    @Query('limit') limit: number = 10,
    @Query('applicationId') applicationId?: string,
    @Query('perusahaanId') perusahaanId?: string
  ) {
    return this.statistikService.getB3Substances(startDate, endDate, limit, applicationId, perusahaanId);
  }

  @Get('top-companies-by-routes')
  @ApiOperation({ summary: 'Get top companies by number of routes' })
  @ApiQuery({ name: 'limit', description: 'Limit the number of results', example: 5, required: false })
  @ApiResponse({
    status: 200,
    description: 'Top companies by routes retrieved successfully.',
    schema: {
      example: [
        { namaPerusahaan: 'PT Asal Muat', jumlahRute: 20 },
        { namaPerusahaan: 'PT Tujuan Bongkar', jumlahRute: 15 }
      ]
    }
  })
  async getTopCompaniesByRoutes(@Query('limit') limit: number = 10) {
    return this.statistikService.getTopCompaniesByRoutes(limit);
  }

  @Get('companies-by-b3-substance')
  @ApiOperation({ summary: 'Get companies that reported a specific B3 substance' })
  @ApiQuery({ name: 'b3SubstanceId', description: 'ID of the B3 substance', example: 'b3e45679-1234-4abc-9def-5678abcdef12' })
  @ApiResponse({
    status: 200,
    description: 'Companies by B3 substance retrieved successfully.',
    schema: {
      example: [
        { id: 'c1b2c3d4-5678-1234-9abc-def567890456', name: 'PT Transportasi B3', alamatKantor: 'Jl. Industri No. 10, Jakarta' }
      ]
    }
  })
  async getCompaniesByB3Substance(@Query('b3SubstanceId') b3SubstanceId: string) {
    return this.statistikService.getCompaniesByB3Substance(b3SubstanceId);
  }

  @Get('total-laporan')
  @ApiOperation({ summary: 'Get total number of reports within a time range' })
  @ApiQuery({ name: 'startDate', description: 'Start date of the range', example: '2024-01-01' })
  @ApiQuery({ name: 'endDate', description: 'End date of the range', example: '2024-12-31' })
  @ApiResponse({
    status: 200,
    description: 'Total number of reports retrieved successfully.',
    schema: { example: { totalLaporan: 50 } }
  })
  async getTotalLaporan(@Query('startDate') startDate: Date, @Query('endDate') endDate: Date) {
    return this.statistikService.getTotalLaporan(startDate, endDate);
  }

  @Get('rekomendasi-belum-dilaporkan')
  @ApiOperation({ summary: 'Get recommendations within a range that have not been reported' })
  @ApiQuery({ name: 'startDate', description: 'Start date of the range', example: '2024-01-01' })
  @ApiQuery({ name: 'endDate', description: 'End date of the range', example: '2024-12-31' })
  @ApiResponse({
    status: 200,
    description: 'Unreported recommendations retrieved successfully.',
    schema: {
      example: [
        { id: 'r1b2c3d4-5678-1234-9abc-def567890123', namaPerusahaan: 'PT Industri', tanggalPermohonan: '2024-05-01T12:00:00Z' }
      ]
    }
  })
  async getRekomendasiBelumDilaporkan(@Query('startDate') startDate: Date, @Query('endDate') endDate: Date) {
    return this.statistikService.getRekomendasiBelumDilaporkan(startDate, endDate);
  }

  @Get('b3-transport-graph-data')
  @ApiOperation({ summary: 'Get data for B3 transport graph' })
  @ApiQuery({ name: 'startDate', description: 'Start date of the range', example: '2024-01-01' })
  @ApiQuery({ name: 'endDate', description: 'End date of the range', example: '2024-12-31' })
  @ApiResponse({
    status: 200,
    description: 'Graph data for B3 transport retrieved successfully.',
    schema: {
      example: {
        labels: ['Asam Sulfat', 'Amonium Nitrat'],
        data: [1500, 1200]
      }
    }
  })
  async getB3TransportGraphData(@Query('startDate') startDate: Date, @Query('endDate') endDate: Date) {
    return this.statistikService.getB3TransportGraphData(startDate, endDate);
  }

  @Get('total-shipments-by-location')
  @ApiOperation({ summary: 'Get total shipments by origin and destination locations' })
  @ApiQuery({ name: 'startDate', description: 'Start date of the range', example: '2024-01-01' })
  @ApiQuery({ name: 'endDate', description: 'End date of the range', example: '2024-12-31' })
  @ApiResponse({
    status: 200,
    description: 'Total shipments by location retrieved successfully.',
    schema: {
      example: {
        asalMuat: [
          { lokasi: 'Jl. Industri No. 1, Jakarta', totalPengiriman: 30 }
        ],
        tujuanBongkar: [
          { lokasi: 'Jl. Logistik No. 5, Surabaya', totalPengiriman: 25 }
        ]
      }
    }
  })
  async getTotalShipmentsByLocation(@Query('startDate') startDate: Date, @Query('endDate') endDate: Date) {
    return this.statistikService.getTotalShipmentsByLocation(startDate, endDate);
  }
}
