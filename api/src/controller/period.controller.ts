import {
    Controller,
    Post,
    Body,
    Get,
    Param,
    Patch,
    BadRequestException,
    NotFoundException,
    Query,
    UseGuards,
  } from '@nestjs/common';
  import {
    ApiTags,
    ApiResponse,
    ApiOperation,
    ApiBadRequestResponse,
    ApiNotFoundResponse,
    ApiQuery,
  } from '@nestjs/swagger';
  import { CreatePeriodDto } from 'src/models/createPeriodDto';
  import { Period } from '@prisma/client';
import { PeriodService } from 'src/services/period.services';
import { PaginationDto } from 'src/models/paginationDto';
import { SearchApplicationsWithPaginationDto } from 'src/models/searchApplicationsWithPaginationDto';
import { SearchRegistrationsWithPaginationDto } from 'src/models/searchRegistrationsWithPaginationDto';
import { SearchCompaniesReportWithPaginationDto } from 'src/models/searchCompaniesReportWithPaginationDto';
import { JenisPelaporan } from 'src/models/enums/jenisPelaporan';
import { RolesGuard } from 'src/utils/roles.guard';
import { JwtAuthGuard } from 'src/utils/auth.guard';
import { RolesAccess } from 'src/models/enums/roles';
import { Roles } from 'src/utils/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
  @ApiTags('Period')
  @Controller('period')
  export class PeriodController {
    constructor(private readonly periodService: PeriodService) {}
  
    @Roles(RolesAccess.PIC_PELAPORAN, RolesAccess.SUPER_ADMIN)
    @Post('create')
    @ApiOperation({ summary: 'Create a new reporting period' })
    @ApiResponse({
      status: 201,
      description: 'The period has been successfully created.',
      schema: {
        example: {
          id: '1234-5678-9101',
          name: 'Q1 2024',
          startDate: '2024-01-01T00:00:00.000Z',
          endDate: '2024-03-31T23:59:59.000Z',
          finalizationDeadline: '2024-04-10T23:59:59.000Z',
          isActive: true,
        },
      },
    })
    @ApiBadRequestResponse({
      description: 'Invalid input data or date validation failed.',
      schema: {
        example: {
          statusCode: 400,
          message: 'Start date must be before end date.',
          error: 'Bad Request',
        },
      },
    })
    async createPeriod(@Body() data: CreatePeriodDto): Promise<Period> {
      return this.periodService.createPeriod(data);
    }
  
    @Roles(RolesAccess.PIC_PELAPORAN, RolesAccess.SUPER_ADMIN)
    @Patch('set-active/:id')
    @ApiOperation({ summary: 'Set an existing period as active' })
    @ApiResponse({
      status: 200,
      description: 'The period has been set as active.',
      schema: {
        example: {
          id: '1234-5678-9101',
          name: 'Q1 2024',
          startDate: '2024-01-01T00:00:00.000Z',
          endDate: '2024-03-31T23:59:59.000Z',
          finalizationDeadline: '2024-04-10T23:59:59.000Z',
          isActive: true,
        },
      },
    })
    @ApiNotFoundResponse({
      description: 'Period not found.',
      schema: {
        example: {
          statusCode: 404,
          message: 'Period not found.',
          error: 'Not Found',
        },
      },
    })
    async setActivePeriod(@Param('id') periodId: string): Promise<Period> {
      return this.periodService.setActivePeriod(periodId);
    }
  
    @Get('active')
    @ApiOperation({ summary: 'Get the currently active period' })
    @ApiResponse({
      status: 200,
      description: 'The active period has been retrieved.',
      schema: {
        example: {
          id: '1234-5678-9101',
          name: 'Q1 2024',
          startDate: '2024-01-01T00:00:00.000Z',
          endDate: '2024-03-31T23:59:59.000Z',
          finalizationDeadline: '2024-04-10T23:59:59.000Z',
          isActive: true,
        },
      },
    })
    @ApiNotFoundResponse({
      description: 'No active period found.',
      schema: {
        example: {
          statusCode: 404,
          message: 'No active period found.',
          error: 'Not Found',
        },
      },
    })
    async getActivePeriod(): Promise<Period> {
      return this.periodService.getActivePeriod();
    }

    @Get('report-active')
    @ApiOperation({ summary: 'Get the currently active report period' })
    @ApiResponse({
      status: 200,
      description: 'The reprot active period has been retrieved.',
      schema: {
        example: {
          id: '1234-5678-9101',
          name: 'Q1 2024',
          startDate: '2024-01-01T00:00:00.000Z',
          endDate: '2024-03-31T23:59:59.000Z',
          finalizationDeadline: '2024-04-10T23:59:59.000Z',
          isActive: true,
        },
      },
    })
    @ApiNotFoundResponse({
      description: 'No active period found.',
      schema: {
        example: {
          statusCode: 404,
          message: 'No active period found.',
          error: 'Not Found',
        },
      },
    })
    async getReportActive(): Promise<Period> {
      return this.periodService.getReportActivePeriod();
    }
  
    @Get('all')
    @ApiOperation({ summary: 'Get a list of all periods' })
    @ApiResponse({
      status: 200,
      description: 'List of all periods.',
      schema: {
        example: [
          {
            id: '1234-5678-9101',
            name: 'Q1 2024',
            startDate: '2024-01-01T00:00:00.000Z',
            endDate: '2024-03-31T23:59:59.000Z',
            finalizationDeadline: '2024-04-10T23:59:59.000Z',
            isActive: false,
          },
          {
            id: '2345-6789-1011',
            name: 'Q2 2024',
            startDate: '2024-04-01T00:00:00.000Z',
            endDate: '2024-06-30T23:59:59.000Z',
            finalizationDeadline: '2024-07-10T23:59:59.000Z',
            isActive: true,
          },
        ],
      },
    })
    async getAllPeriods(): Promise<Period[]> {
      return this.periodService.getAllPeriods();
    }
  
    @Get('reports/:id')
    @ApiOperation({ summary: 'Get all reports under a specific period' })
    @ApiResponse({
      status: 200,
      description: 'List of reports under the specified period.',
      schema: {
        example: [
          {
            id: 'report-123',
            applicationId: 'app-456',
            vehicleId: 'vehicle-789',
            periodId: '1234-5678-9101',
            pengangkutanDetails: [
              {
                id: 'detail-1',
                description: 'Detail 1',
              },
            ],
          },
        ],
      },
    })
    @ApiNotFoundResponse({
      description: 'Period not found.',
      schema: {
        example: {
          statusCode: 404,
          message: 'Period not found.',
          error: 'Not Found',
        },
      },
    })
    async getReportsByPeriod(@Param('id') periodId: string) {
      return this.periodService.getReportsByPeriod(periodId);
    }

    @Get('reported-unreported/companies')
    @ApiOperation({ summary: 'Get list of unreported-reported companies' })
    @ApiQuery({ name: 'periodId', required: true, type: String })
    @ApiQuery({ name: 'isReported', required: false, type: Boolean })
    @ApiResponse({ status: 200, description: 'List of unreported companies.' })
    @ApiBadRequestResponse({ description: 'Invalid query parameters.' })
    async getUnreportedCompanies(
      @Query('periodId') periodId: string,
      @Query('isReported') isReported?: boolean
    ) {
      if (!periodId) {
        throw new BadRequestException('Parameter periodId is required.');
      }
      return this.periodService.getCompanies(periodId, isReported);
    }

    @Get('reported-unreported/registrations')
    @ApiOperation({ summary: 'Get list of unreported registrations' })
    @ApiResponse({
      status: 200,
      description: 'List of unreported registrations.',
      schema: {
        example: {
          total: 3,
          data: [
            {
              id: 'reg-123',
              companyId: 'comp-456',
              registrasi: { id: 'reg-123', name: 'Registrasi B3' },
              sudahDilaporkan: false,
            },
          ],
        },
      },
    })
    async getUnreportedRegistrations(
      @Query('periodId') periodId: string,
      @Query('isReported') isReported?: boolean,
    ) {
      return this.periodService.getRegistrations(periodId, isReported);
    }

    @Get('reported-unreported/applications')
    @ApiOperation({ summary: 'Get list of unreported applications' })
    @ApiResponse({
      status: 200,
      description: 'List of unreported applications.',
      schema: {
        example: {
          total: 5,
          data: [
            {
              id: 'app-123',
              companyId: 'comp-456',
              application: { id: 'app-123', name: 'Pengangkutan B3' },
              sudahDilaporkan: false,
            },
          ],
        },
      },
    })
    async getUnreportedApplications(
      @Query('periodId') periodId: string,
      @Query('isReported') isReported?: boolean,
    ) {
      return this.periodService.getApplications(periodId, isReported);
    }

    @Get('search/companies')
    @ApiOperation({ summary: 'Search companies based on filters and reporting status' })
    @ApiQuery({ name: 'periodId', required: false, type: String })
    @ApiQuery({ name: 'companyIds', required: false, type: [String] })
    @ApiQuery({ name: 'jenisLaporan', required: false, enum: JenisPelaporan })
    @ApiQuery({ name: 'isReported', required: false, type: Boolean })
    @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
    @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
    @ApiQuery({ name: 'sortOrder', required: false, type: String, example: 'desc' })
    @ApiQuery({ name: 'sortBy', required: false, type: String, example: 'createdAt' })
    @ApiResponse({
      status: 200,
      description: 'List of companies based on filters and reporting status.',
      schema: {
        example: {
          total: 2,
          data: [
            {
              id: '123',
              companyId: '456',
              company: { id: '456', name: 'Perusahaan A' },
              jenisLaporan: 'PENGGUNAAN_BAHAN_B3',
              sudahDilaporkan: false,
            },
          ],
        },
      },
    })
    @ApiBadRequestResponse({ description: 'Invalid query parameters.' })
    async searchCompanies(
      @Query() query: SearchCompaniesReportWithPaginationDto
    ) {
      const { periodId, companyIds, jenisLaporan, isReported, page, limit, sortOrder, sortBy } = query;
      return this.periodService.searchCompanies(query);
    }
  
    @Get('search/registrations')
    @ApiOperation({ summary: 'Search registrations based on filters and reporting status' })
    @ApiQuery({ name: 'periodId', required: false, type: String })
    @ApiQuery({ name: 'companyIds', required: false, type: [String] })
    @ApiQuery({ name: 'isReported', required: false, type: Boolean })
    @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
    @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
    @ApiQuery({ name: 'sortOrder', required: false, type: String, example: 'desc' })
    @ApiQuery({ name: 'sortBy', required: false, type: String, example: 'createdAt' })
    @ApiResponse({
      status: 200,
      description: 'List of registrations based on filters and reporting status.',
      schema: {
        example: {
          total: 3,
          data: [
            {
              id: 'reg-123',
              companyId: 'comp-456',
              registrasi: { id: 'reg-123', name: 'Registrasi B3' },
              sudahDilaporkan: false,
            },
          ],
        },
      },
    })
    @ApiBadRequestResponse({ description: 'Invalid query parameters.' })
    async searchRegistrations(
      @Query() query: SearchRegistrationsWithPaginationDto
    ) {
      const { periodId, companyIds, isReported, page, limit, sortOrder, sortBy } = query;
      return this.periodService.searchRegistrations(query
      );
    }
    
  
    @Get('search/applications')
    @ApiOperation({ summary: 'Search applications based on filters and reporting status' })
    @ApiQuery({ name: 'periodId', required: false, type: String })
    @ApiQuery({ name: 'companyIds', required: false, type: [String] })
    @ApiQuery({ name: 'vehicleIds', required: false, type: [String] })
    @ApiQuery({ name: 'isReported', required: false, type: Boolean })
    @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
    @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
    @ApiQuery({ name: 'sortOrder', required: false, type: String, example: 'desc' })
    @ApiQuery({ name: 'sortBy', required: false, type: String, example: 'createdAt' })
    @ApiResponse({
      status: 200,
      description: 'List of applications based on filters and reporting status.',
      schema: {
        example: {
          total: 5,
          data: [
            {
              id: 'app-123',
              companyId: 'comp-456',
              application: { id: 'app-123', name: 'Pengangkutan B3' },
              vehicleId: 'vehicle-789',
              sudahDilaporkan: false,
            },
          ],
        },
      },
    })
    @ApiBadRequestResponse({ description: 'Invalid query parameters.' })
    async searchApplications(
      @Query() query: SearchApplicationsWithPaginationDto
    ) {
      const { periodId, companyIds, vehicleIds, isReported, page, limit, sortOrder, sortBy } = query;
      return this.periodService.searchApplications(
        query
      );
    }


    @Get('find/:id')
    @ApiOperation({ summary: 'Get the currently active period' })
    @ApiResponse({
      status: 200,
      description: 'The active period has been retrieved.',
      schema: {
        example: {
          id: '1234-5678-9101',
          name: 'Q1 2024',
          startDate: '2024-01-01T00:00:00.000Z',
          endDate: '2024-03-31T23:59:59.000Z',
          finalizationDeadline: '2024-04-10T23:59:59.000Z',
          isActive: true,
        },
      },
    })
    @ApiNotFoundResponse({
      description: 'No active period found.',
      schema: {
        example: {
          statusCode: 404,
          message: 'No active period found.',
          error: 'Not Found',
        },
      },
    })
    async getPeriod(@Param('id') periodId: string,): Promise<Period> {
      return this.periodService.getPeriod(periodId);
    }

    @Get('report-actives')
    @ApiOperation({ summary: 'Get the currently active period' })
    @ApiResponse({
      status: 200,
      description: 'The active period has been retrieved.',
      schema: {
        example: {
          id: '1234-5678-9101',
          name: 'Q1 2024',
          startDate: '2024-01-01T00:00:00.000Z',
          endDate: '2024-03-31T23:59:59.000Z',
          finalizationDeadline: '2024-04-10T23:59:59.000Z',
          isActive: true,
        },
      },
    })
    @ApiNotFoundResponse({
      description: 'No active period found.',
      schema: {
        example: {
          statusCode: 404,
          message: 'No active period found.',
          error: 'Not Found',
        },
      },
    })
    async getReportsActive() {
      return this.periodService.getAllReportActivePeriod();
    }
  }
  