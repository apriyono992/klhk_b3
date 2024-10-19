import { Controller, Post, Put, Delete, Body, Param, UseFilters } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JenisSampleTypeService } from '../services/jenisSampleType.services';
import { CreateJenisSampleTypeDto } from '../models/createSampleTypeDto';
import { ValidationFilter } from 'src/utils/response.filter';

@ApiTags('Jenis Sample Type')
@Controller('jenis-sample-type')
@UseFilters(ValidationFilter)  
export class JenisSampleTypeController {
  constructor(private readonly jenisSampleTypeService: JenisSampleTypeService) {}

  // Create a new JenisSampleType
  @Post()
  @ApiOperation({ summary: 'Create a new sample type' })
  @ApiResponse({
    status: 201,
    description: 'The sample type has been successfully created.',
    schema: {
      example: {
        id: 'type123',
        type: 'Water',
        deskripsi: 'Type for water samples',
        createdAt: '2024-10-19T10:00:00Z',
        updatedAt: '2024-10-19T10:00:00Z',
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Bad Request: Type already exists.' })
  async create(@Body() createJenisSampleTypeDto: CreateJenisSampleTypeDto) {
    return await this.jenisSampleTypeService.create(createJenisSampleTypeDto);
  }

  // Update an existing JenisSampleType by ID
  @Put(':id')
  @ApiOperation({ summary: 'Update an existing sample type' })
  @ApiResponse({
    status: 200,
    description: 'The sample type has been successfully updated.',
    schema: {
      example: {
        id: 'type123',
        type: 'Soil',
        deskripsi: 'Updated description for soil samples',
        createdAt: '2024-10-19T10:00:00Z',
        updatedAt: '2024-10-19T11:00:00Z',
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Bad Request: Type already exists.' })
  @ApiResponse({ status: 404, description: 'Not Found: The sample type does not exist.' })
  async update(
    @Param('id') id: string,
    @Body() updateJenisSampleTypeDto: CreateJenisSampleTypeDto,
  ) {
    return await this.jenisSampleTypeService.update(id, updateJenisSampleTypeDto);
  }

  // Delete a JenisSampleType by ID
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a sample type by ID' })
  @ApiResponse({
    status: 200,
    description: 'The sample type has been successfully deleted.',
    schema: {
      example: {
        message: 'Sample type deleted successfully.',
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Not Found: The sample type does not exist.' })
  async delete(@Param('id') id: string) {
    return await this.jenisSampleTypeService.delete(id);
  }
}
