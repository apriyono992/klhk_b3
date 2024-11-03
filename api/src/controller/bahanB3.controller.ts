import { Controller, Post, Put, Delete, Get, Param, Body, Query } from '@nestjs/common';
import { CreateB3PermohonanRekomDto } from 'src/models/createB3PermohonanRekomDto';
import { UpdateB3PermohonanRekomDto } from 'src/models/updateB3PermohonanRekomDto';
import { SearchBahanB3PermohonanRekomDto } from 'src/models/searchBahanB3PermohonanRekomDto';
import { ApiTags, ApiOperation, ApiBody, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { BahanB3Service } from 'src/services/bahanB3.services';

@ApiTags('B3Substance')
@Controller('b3-substance')
export class BahanB3Controller {
  constructor(private readonly bahanB3Service: BahanB3Service) {}

  @Post()
  @ApiOperation({ summary: 'Create a new B3Substance' })
  @ApiBody({
    type: CreateB3PermohonanRekomDto,
    schema: {
      example: {
        dataBahanB3Id: '123456',
        applicationId: 'app123',
        b3pp74: true,
        b3DiluarList: false,
        karakteristikB3: 'Corrosive',
        fasaB3: 'Solid',
        jenisKemasan: 'Drum',
        asalMuat: [
          {
            name: 'Jakarta',
            alamat: 'Jl. Sudirman',
            longitude: 106.8272,
            latitude: -6.1751,
          },
        ],
        tujuanBongkar: [
          {
            name: 'Surabaya',
            alamat: 'Jl. Tunjungan',
            longitude: 112.7378,
            latitude: -7.2575,
          },
        ],
        tujuanPenggunaan: 'Industrial',
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'B3Substance added successfully to the application',
    schema: {
      example: {
        message: 'B3Substance added successfully to the application',
        b3Substance: {
          id: '123456',
          applicationId: 'app123',
          karakteristikB3: 'Corrosive',
          fasaB3: 'Solid',
          jenisKemasan: 'Drum',
          asalMuat: [
            {
              name: 'Jakarta',
              alamat: 'Jl. Sudirman',
              longitude: 106.8272,
              latitude: -6.1751,
            },
          ],
          tujuanBongkar: [
            {
              name: 'Surabaya',
              alamat: 'Jl. Tunjungan',
              longitude: 112.7378,
              latitude: -7.2575,
            },
          ],
          tujuanPenggunaan: 'Industrial',
          createdAt: '2024-10-19T10:00:00Z',
          updatedAt: '2024-10-19T10:00:00Z',
        },
      },
    },
  })
  async createB3Substance(@Body() createB3SubstanceDto: CreateB3PermohonanRekomDto) {
    return this.bahanB3Service.createB3Substance(createB3SubstanceDto);
  }


  @Put()
  @ApiOperation({ summary: 'Update an existing B3Substance' })
  @ApiBody({
    type: UpdateB3PermohonanRekomDto,
    schema: {
      example: {
        dataBahanB3Id: '123456',
        b3pp74: true,
        b3DiluarList: false,
        karakteristikB3: 'Flammable',
        fasaB3: 'Liquid',
        jenisKemasan: 'Canister',
        asalMuat: [
          {
            name: 'Bandung',
            alamat: 'Jl. Soekarno Hatta',
            longitude: 107.6191,
            latitude: -6.9175,
          },
        ],
        tujuanBongkar: [
          {
            name: 'Medan',
            alamat: 'Jl. Medan Merdeka',
            longitude: 98.6722,
            latitude: 3.5952,
          },
        ],
        tujuanPenggunaan: 'Research',
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'B3Substance updated successfully',
    schema: {
      example: {
        message: 'B3Substance updated successfully',
        b3Substance: {
          id: '123456',
          applicationId: 'app123',
          karakteristikB3: 'Flammable',
          fasaB3: 'Liquid',
          jenisKemasan: 'Canister',
          asalMuat: [
            {
              name: 'Bandung',
              alamat: 'Jl. Soekarno Hatta',
              longitude: 107.6191,
              latitude: -6.9175,
            },
          ],
          tujuanBongkar: [
            {
              name: 'Medan',
              alamat: 'Jl. Medan Merdeka',
              longitude: 98.6722,
              latitude: 3.5952,
            },
          ],
          tujuanPenggunaan: 'Research',
          createdAt: '2024-10-19T10:00:00Z',
          updatedAt: '2024-10-20T10:00:00Z',
        },
      },
    },
  })
  async updateB3Substance( @Body() updateB3SubstanceDto: UpdateB3PermohonanRekomDto) {
    return this.bahanB3Service.updateB3Substance(updateB3SubstanceDto);
  }
  

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a B3Substance' })
  @ApiParam({ name: 'id', description: 'ID of the B3Substance to delete' })
  @ApiResponse({
    status: 200,
    description: 'B3Substance deleted successfully',
    schema: {
      example: {
        message: 'B3Substance deleted successfully',
      },
    },
  })
  async deleteB3Substance(@Param('id') id: string) {
    return this.bahanB3Service.deleteB3Substance(id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single B3Substance by ID' })
  @ApiParam({ name: 'id', description: 'ID of the B3Substance to retrieve' })
  @ApiResponse({
    status: 200,
    description: 'Details of the B3Substance',
    schema: {
      example: {
        id: '123456',
        applicationId: 'app123',
        karakteristikB3: 'Toxic',
        fasaB3: 'Gas',
        jenisKemasan: 'Cylinder',
        asalMuat: 'Semarang',
        tujuanBongkar: 'Makassar',
        tujuanPenggunaan: 'Medical',
        createdAt: '2024-10-19T10:00:00Z',
        updatedAt: '2024-10-19T10:00:00Z',
      },
    },
  })
  async getB3SubstanceById(@Param('id') id: string) {
    return this.bahanB3Service.getB3SubstanceById(id);
  }

  @Get('search')
  @ApiOperation({ summary: 'Search and list B3Substances with filtering options' })
  @ApiQuery({ name: 'page', description: 'Page number', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', description: 'Number of items per page', required: false, type: Number, example: 10 })
  @ApiQuery({ name: 'sortBy', description: 'Sort by field', required: false, type: String, example: 'createdAt' })
  @ApiQuery({ name: 'sortOrder', description: 'Sort order', required: false, type: String, example: 'desc' })
  @ApiQuery({ name: 'karakteristikB3', description: 'Filter by characteristics of the B3', required: false, type: [String] })
  @ApiQuery({ name: 'fasaB3', description: 'Filter by phase of the B3', required: false, type: [String] })
  @ApiQuery({ name: 'jenisKemasan', description: 'Filter by packaging type', required: false, type: [String] })
  @ApiQuery({ name: 'asalMuat', description: 'Filter by origin of the B3', required: false, type: [String] })
  @ApiQuery({ name: 'tujuanBongkar', description: 'Filter by destination of the B3', required: false, type: [String] })
  @ApiQuery({ name: 'tujuanPenggunaan', description: 'Filter by purpose of the B3', required: false, type: [String] })
  @ApiQuery({ name: 'b3pp74', description: 'Filter by whether the B3 is listed in PP 74/2001', required: false, type: Boolean })
  @ApiQuery({ name: 'b3DiluarList', description: 'Filter by whether the B3 is outside the list of PP 74/2001', required: false, type: Boolean })
  @ApiQuery({ name: 'applicationId', description: 'Filter by application ID', required: false, type: String })
  @ApiResponse({
    status: 200,
    description: 'Search results with pagination',
    schema: {
      example: {
        total: 5,
        page: 1,
        limit: 10,
        b3Substances: [
          {
            id: '123456',
            applicationId: 'app123',
            karakteristikB3: 'Corrosive',
            fasaB3: 'Solid',
            jenisKemasan: 'Drum',
            asalMuat: 'Jakarta',
            tujuanBongkar: 'Surabaya',
            tujuanPenggunaan: 'Industrial',
            createdAt: '2024-10-19T10:00:00Z',
            updatedAt: '2024-10-19T10:00:00Z',
          },
          // Additional substance data...
        ],
      },
    },
  })
  async searchB3Substances(@Query() searchDto: SearchBahanB3PermohonanRekomDto) {
    return this.bahanB3Service.searchB3Substances(searchDto);
  }
}
