import { Controller, Post, Put, Body, Param, UseFilters } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JenisSampleService } from '../services/jenisSample.services';
import { CreateJenisSampleTypeDto } from '../models/createSampleTypeDto';
import { ValidationFilter } from 'src/utils/response.filter';

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
}
