import { Controller, Get, Post, Put, Delete, Param, Body, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { CompanyService } from '../services/company.services';
import { CreateCompanyDto } from '../models/CreateCompanyDto';
import { UpdateCompanyDto } from '../models/updateCompanyDto';
import { SearchCompanyDto } from '../models/searchCompanyDto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiQuery, ApiParam } from '@nestjs/swagger';

@ApiTags('Company')
@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new company' })
  @ApiBody({
    description: 'Create company request body',
    schema: {
      example: {
        name: 'PT Example Company',
        penanggungJawab: 'John Doe',
        alamatKantor: 'Jl. Merdeka No. 1, Jakarta',
        telpKantor: '+62 21 5551234',
        faxKantor: '+62 21 5555678',
        emailKantor: 'info@example.com',
        npwp: '123456789012345',
        alamatPool: ['Jl. Merdeka No. 1', 'Jl. Soekarno Hatta No. 10'],
        bidangUsaha: 'Manufacturing',
        kodeDBKlh: 'KLH123',
        nomorInduk: '4567890',
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'The company has been successfully created.',
    schema: {
      example: {
        id: '1a2b3c4d5e6f7g8h9i0j',
        name: 'PT Example Company',
        penanggungJawab: 'John Doe',
        alamatKantor: 'Jl. Merdeka No. 1, Jakarta',
        telpKantor: '+62 21 5551234',
        faxKantor: '+62 21 5555678',
        emailKantor: 'info@example.com',
        npwp: '123456789012345',
        alamatPool: ['Jl. Merdeka No. 1', 'Jl. Soekarno Hatta No. 10'],
        bidangUsaha: 'Manufacturing',
        kodeDBKlh: 'KLH123',
        nomorInduk: '4567890',
        createdAt: '2024-10-01T12:34:56.789Z',
        updatedAt: '2024-10-01T12:34:56.789Z',
      },
    },
  })
  @ApiResponse({ status: 409, description: 'Unique constraint violation.' })
  async createCompany(@Body() createCompanyDto: CreateCompanyDto) {
    return this.companyService.createCompany(createCompanyDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single company by ID' })
  @ApiParam({ name: 'id', type: String, description: 'Company ID' })
  @ApiResponse({
    status: 200,
    description: 'Return a company object.',
    schema: {
      example: {
        id: '1a2b3c4d5e6f7g8h9i0j',
        name: 'PT Example Company',
        npwp: '123456789012345',
        alamatPool: ['Jl. Merdeka No. 1', 'Jl. Soekarno Hatta No. 10'],
        bidangUsaha: 'Manufacturing',
        kodeDBKlhk: 'KLH123',
        nomorInduk: '4567890',
        createdAt: '2024-10-01T12:34:56.789Z',
        updatedAt: '2024-10-01T12:34:56.789Z',
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Company not found.' })
  async getCompany(@Param('id') id: string) {
    return this.companyService.getCompany(id);
  }

  @Get()
  @ApiOperation({ summary: 'Get a list of companies with optional search and pagination' })
  @ApiQuery({ name: 'page', type: Number, required: false, description: 'Page number for pagination', example: 1 })
  @ApiQuery({ name: 'limit', type: Number, required: false, description: 'Limit of results per page', example: 10 })
  @ApiQuery({ name: 'name', type: String, required: false, description: 'Search by company name' })
  @ApiQuery({ name: 'npwp', type: String, required: false, description: 'Search by company NPWP' })
  @ApiQuery({ name: 'bidangUsaha', type: String, required: false, description: 'Search by business field (bidang usaha)' })
  @ApiQuery({ name: 'kodeDBKlhk', type: String, required: false, description: 'Search by company kodeDBKlhk' })
  @ApiQuery({ name: 'sortBy', type: String, required: false, description: 'Field to sort by', example: 'createdAt' })
  @ApiQuery({ name: 'sortOrder', type: String, required: false, description: 'Sort order (asc/desc)', example: 'desc' })
  @ApiResponse({
    status: 200,
    description: 'Return a list of companies with pagination.',
    schema: {
      example: {
        total: 1,
        page: 1,
        limit: 10,
        data: [
          {
            id: '1a2b3c4d5e6f7g8h9i0j',
            name: 'PT Example Company',
            npwp: '123456789012345',
            alamatPool: ['Jl. Merdeka No. 1', 'Jl. Soekarno Hatta No. 10'],
            bidangUsaha: 'Manufacturing',
            kodeDBKlhk: 'KLH123',
            nomorInduk: '4567890',
            createdAt: '2024-10-01T12:34:56.789Z',
            updatedAt: '2024-10-01T12:34:56.789Z',
          },
        ],
      },
    },
  })
  async getCompanies(@Query() searchDto: SearchCompanyDto) {
    return this.companyService.getCompanies(searchDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an existing company by ID' })
  @ApiParam({ name: 'id', type: String, description: 'Company ID' })
  @ApiBody({
    description: 'Update company request body',
    schema: {
      example: {
        name: 'PT Updated Company',
        npwp: '987654321098765',
        alamatPool: ['Jl. Merdeka No. 2', 'Jl. Sudirman No. 11'],
        bidangUsaha: 'Retail',
        kodeDBKlhk: 'KLH456',
        nomorInduk: '5678901',
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'The company has been successfully updated.',
    schema: {
      example: {
        id: '1a2b3c4d5e6f7g8h9i0j',
        name: 'PT Updated Company',
        npwp: '987654321098765',
        alamatPool: ['Jl. Merdeka No. 2', 'Jl. Sudirman No. 11'],
        bidangUsaha: 'Retail',
        kodeDBKlhk: 'KLH456',
        nomorInduk: '5678901',
        createdAt: '2024-10-01T12:34:56.789Z',
        updatedAt: '2024-10-02T14:23:45.123Z',
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Company not found.' })
  @ApiResponse({ status: 409, description: 'Unique constraint violation.' })
  async updateCompany(@Param('id') id: string, @Body() updateCompanyDto: UpdateCompanyDto) {
    return this.companyService.updateCompany(id, updateCompanyDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a company by ID' })
  @ApiParam({ name: 'id', type: String, description: 'Company ID' })
  @ApiResponse({ status: 204, description: 'The company has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Company not found.' })
  async deleteCompany(@Param('id') id: string) {
    return this.companyService.deleteCompany(id);
  }
}
