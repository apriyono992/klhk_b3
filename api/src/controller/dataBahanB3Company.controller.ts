import { Controller, Get, Post, Patch, Body, Param, Query, UseGuards } from '@nestjs/common';
import { CreateBahanB3CompanyDto } from 'src/models/createBahanB3CompanyDto';
import { UpdateStokB3Dto } from 'src/models/updateStokB3Dto';
import { ApproveBahanB3RequestDto } from 'src/models/approveBahanB3RequestDto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam, ApiNotFoundResponse } from '@nestjs/swagger';
import { DataBahanB3CompanyService } from 'src/services/bahanB3Company.services';
import { SearchBahanB3CompanyDto } from 'src/models/searchBahanB3CompanyDto';
import { SearchStokB3PeriodeDto } from 'src/models/searchStokB3PeriodeDto';
import { JwtAuthGuard } from 'src/utils/auth.guard';
import { RolesGuard } from 'src/utils/roles.guard';

@UseGuards(JwtAuthGuard, RolesGuard)
@ApiTags('Data Bahan B3 Company')
@Controller('data-bahan-b3-company')
export class DataBahanB3CompanyController {
  constructor(private readonly service: DataBahanB3CompanyService) {}

  @Post('add-request')
  @ApiOperation({ summary: 'Create a new B3 addition request (pending approval)' })
  @ApiBody({
    type: CreateBahanB3CompanyDto,
    examples: {
      example1: {
        value: {
          companyId: '123e4567-e89b-12d3-a456-426614174000',
          dataBahanB3Id: '123e4567-e89b-12d3-a456-426614174001',
          stokB3: 100.5,
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'The B3 addition request has been created.',
    schema: {
      example: {
        id: '123e4567-e89b-12d3-a456-426614174002',
        dataBahanB3Id: '123e4567-e89b-12d3-a456-426614174001',
        requestedStokB3: 100.5,
        companyId: '123e4567-e89b-12d3-a456-426614174000',
        requestDate: '2024-11-10T12:00:00Z',
        approved: false,
      },
    },
  })
  async createB3AdditionRequest(@Body() dto: CreateBahanB3CompanyDto) {
    return this.service.createB3AdditionRequest(dto);
  }

  @Post('update-request')
  @ApiOperation({ summary: 'Create a stock update request (pending approval)' })
  @ApiBody({
    type: UpdateStokB3Dto,
    examples: {
      example1: {
        value: {
          dataBahanB3CompanyId: '123e4567-e89b-12d3-a456-426614174003',
          newStokB3: 200.75,
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'The stock update request has been created.',
    schema: {
      example: {
        id: '123e4567-e89b-12d3-a456-426614174004',
        dataBahanB3CompanyId: '123e4567-e89b-12d3-a456-426614174003',
        requestedStokB3: 200.75,
        requestDate: '2024-11-10T12:00:00Z',
        approved: false,
      },
    },
  })
  async createStokUpdateRequest(@Body() dto: UpdateStokB3Dto) {
    return this.service.createStokUpdateRequest(dto);
  }

  @Patch('approve/:requestId')
  @ApiOperation({ summary: 'Approve an addition or update request' })
  @ApiParam({
    name: 'requestId',
    description: 'The ID of the request to approve',
    example: '123e4567-e89b-12d3-a456-426614174005',
  })
  @ApiBody({
    type: ApproveBahanB3RequestDto,
    examples: {
      example1: {
        value: {
          approvedById: '123e4567-e89b-12d3-a456-426614174006',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'The request has been approved.',
    schema: {
      example: {
        id: '123e4567-e89b-12d3-a456-426614174005',
        approved: true,
        approvalId: '123e4567-e89b-12d3-a456-426614174007',
      },
    },
  })
  async approveRequest(
    @Param('requestId') requestId: string,
    @Body() dto: ApproveBahanB3RequestDto,
  ) {
    return this.service.approveRequest({ ...dto, requestId });
  }

    /**
   * List all pending requests (addition and update)
   */
    @Get('pending-requests')
    @ApiOperation({ summary: 'List all pending B3 addition and update requests' })
    @ApiResponse({
      status: 200,
      description: 'Returns the list of pending requests',
      schema: {
        example: {
          addRequests: [
            {
              id: '123e4567-e89b-12d3-a456-426614174000',
              dataBahanB3Id: '123e4567-e89b-12d3-a456-426614174001',
              requestedStokB3: 100,
              companyId: '123e4567-e89b-12d3-a456-426614174002',
              approved: false,
              dataBahanB3: {
                jenis: 'Solvent',
              },
              company: {
                name: 'Company A',
              },
            },
          ],
          updateRequests: [
            {
              id: '123e4567-e89b-12d3-a456-426614174003',
              dataBahanB3CompanyId: '123e4567-e89b-12d3-a456-426614174004',
              requestedStokB3: 150,
              approved: false,
              dataBahanB3Company: {
                stokB3: 50,
                company: {
                  name: 'Company B',
                },
                dataBahanB3: {
                  jenis: 'Chemical',
                },
              },
            },
          ],
        },
      },
    })
    async listPendingRequests() {
      return this.service.listPendingRequests();
    }
  
    /**
     * Get detailed information for a single Bahan B3 entry
     */
    @Get('detail/:dataBahanB3CompanyId')
    @ApiOperation({ summary: 'Get detailed information for a single Bahan B3 entry' })
    @ApiParam({
      name: 'dataBahanB3CompanyId',
      description: 'The ID of the Bahan B3 entry',
      example: '123e4567-e89b-12d3-a456-426614174005',
    })
    @ApiResponse({
      status: 200,
      description: 'Returns the details of the Bahan B3 entry',
      schema: {
        example: {
          id: '123e4567-e89b-12d3-a456-426614174005',
          companyId: '123e4567-e89b-12d3-a456-426614174006',
          dataBahanB3Id: '123e4567-e89b-12d3-a456-426614174007',
          stokB3: 200,
          company: {
            name: 'Company C',
          },
          dataBahanB3: {
            jenis: 'Acid',
          },
          stokHistory: [
            {
              id: '123e4567-e89b-12d3-a456-426614174008',
              previousStokB3: 150,
              newStokB3: 200,
              changeDate: '2024-11-10T12:00:00Z',
            },
          ],
        },
      },
    })
    async getBahanB3Detail(@Param('dataBahanB3CompanyId') dataBahanB3CompanyId: string) {
      return this.service.getBahanB3Detail(dataBahanB3CompanyId);
    }
  
    /**
     * Search Bahan B3 Company based on filters
     */
    @Post('search')
    @ApiOperation({ summary: 'Search Bahan B3 entries based on filters' })
    @ApiResponse({
      status: 200,
      description: 'Returns the list of matching Bahan B3 entries',
      schema: {
        example: {
          data: [
            {
              id: '123e4567-e89b-12d3-a456-426614174009',
              companyId: '123e4567-e89b-12d3-a456-426614174010',
              dataBahanB3Id: '123e4567-e89b-12d3-a456-426614174011',
              stokB3: 120,
              company: {
                name: 'Company D',
                tipePerusahaan: ['PRODUSEN'],
              },
              dataBahanB3: {
                jenis: 'Solvent',
              },
            },
          ],
          totalCount: 1,
          page: 1,
          limit: 10,
          totalPages: 1,
        },
      },
    })
    async searchBahanB3Company(@Query() dto: SearchBahanB3CompanyDto) {
      return this.service.searchBahanB3Company(dto);
    }

    @Get('search-period')
    @ApiOperation({ summary: 'Search Stok B3 Periode with date range filter' })
    @ApiResponse({
      status: 200,
      description: 'List of Stok B3 Periode based on filters.',
      schema: {
        example: {
          total: 2,
          data: [
            {
              id: 'stokPeriode-123',
              companyId: 'company-123',
              dataBahanB3Id: 'bahanB3-456',
              bulan: 11,
              tahun: 2024,
              stokB3: 150.0,
              createdAt: '2024-11-01T10:00:00.000Z',
              updatedAt: '2024-11-15T10:00:00.000Z',
              company: {
                id: 'company-123',
                name: 'Perusahaan A',
              },
              dataBahanB3: {
                id: 'bahanB3-456',
                name: 'Bahan B3 A',
              },
            },
          ],
        },
      },
    })
    @ApiNotFoundResponse({
      description: 'No Stok B3 Periode found for the given filters.',
      schema: {
        example: {
          statusCode: 404,
          message: 'No Stok B3 Periode found for the given filters.',
          error: 'Not Found',
        },
      },
    })
  async searchStokB3Periode(@Query() dto: SearchStokB3PeriodeDto) {
    const result = await this.service.searchStokB3Periode(dto);
    return result;
  }
}
