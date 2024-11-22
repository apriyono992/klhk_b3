import { Controller, Post, Put, Body, Param, UseFilters, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JenisSampleService } from '../services/jenisSample.services';
import { CreateJenisSampleTypeDto } from '../models/createSampleTypeDto';
import { ValidationFilter } from 'src/utils/response.filter';
import { JwtAuthGuard } from 'src/utils/auth.guard';
import { RolesGuard } from 'src/utils/roles.guard';

@UseGuards(JwtAuthGuard, RolesGuard)
@ApiTags('Jenis Sample')  // Swagger tag for grouping endpoints
@Controller('jenis-sample')
@UseFilters(ValidationFilter)  
export class JenisSampleController {
  constructor(private readonly jenisSampleService: JenisSampleService) {}

  // Create a new JenisSample
  @Post()
  @ApiOperation({ summary: 'Create a new sample with a type and description' })
  @ApiResponse({
    status: 201,
    description: 'Sample created successfully.',
    schema: {
      example: {
        id: 'sample123',
        type: 'Water',
        description: 'Sample of water for environmental testing',
        createdAt: '2024-10-19T10:00:00Z',
        updatedAt: '2024-10-19T10:00:00Z',
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Bad request or conflict.' })
  async create(@Body() createJenisSampleDto: CreateJenisSampleTypeDto) {
    return await this.jenisSampleService.create(createJenisSampleDto);
  }

  // Update the description of an existing JenisSample by ID
  @Put(':id')
  @ApiOperation({ summary: 'Update the description of a sample by ID' })
  @ApiResponse({
    status: 200,
    description: 'Sample description updated successfully.',
    schema: {
      example: {
        id: 'sample123',
        type: 'Soil',
        description: 'Updated description of the soil sample',
        createdAt: '2024-10-19T10:00:00Z',
        updatedAt: '2024-10-19T11:00:00Z',
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Sample not found.' })
  async updateDeskripsi(
    @Param('id') id: string,
    @Body() updateJenisSampleDeskripsiDto: CreateJenisSampleTypeDto,
  ) {
    return await this.jenisSampleService.updateDeskripsi(id, updateJenisSampleDeskripsiDto);
  }

  // Get a JenisSample by ID
  @Get(':id')
  @ApiOperation({ summary: 'Get a sample by ID' })
  @ApiResponse({
    status: 200,
    description: 'Sample data retrieved successfully.',
    schema: {
      example: {
        id: 'sample123',
        type: 'Air',
        description: 'Sample air untuk uji kualitas lingkungan',
        createdAt: '2024-10-19T10:00:00Z',
        updatedAt: '2024-10-19T10:00:00Z',
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Sample not found.' })
  async getById(@Param('id') id: string) {
    return await this.jenisSampleService.getById(id);
  }

  // Get all JenisSamples
  @Get()
  @ApiOperation({ summary: 'Get all samples' })
  @ApiResponse({
    status: 200,
    description: 'All samples retrieved successfully.',
    schema: {
      example: [
        {
          id: 'sample123',
          type: 'Air',
          description: 'Sample air untuk uji kualitas lingkungan',
          createdAt: '2024-10-19T10:00:00Z',
          updatedAt: '2024-10-19T10:00:00Z',
        },
        {
          id: 'sample456',
          type: 'Tanah',
          description: 'Sample tanah untuk uji kontaminasi logam berat',
          createdAt: '2024-11-01T09:00:00Z',
          updatedAt: '2024-11-01T09:00:00Z',
        },
      ],
    },
  })
  async getAll() {
    return await this.jenisSampleService.getAll();
  }
}
