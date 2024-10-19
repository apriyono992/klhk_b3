import { Controller, Get, Query } from '@nestjs/common';
import { LocationService } from '../services/location.services'; // Import the LocationService
import { ApiTags, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';

@ApiTags('Location')
@Controller('location')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  // Get all provinces
  @Get('provinces')
  @ApiOperation({ summary: 'Get all provinces' })
  @ApiResponse({
    status: 200,
    description: 'Provinces retrieved successfully.',
    schema: {
      example: [
        { id: 'prov1', name: 'Province A' },
        { id: 'prov2', name: 'Province B' },
      ],
    },
  })
  async getProvinces() {
    return await this.locationService.getProvinces();
  }

  // Get all regencies, optionally filtered by provinceId
  @Get('cities')
  @ApiOperation({ summary: 'Get all cities, optionally filtered by provinceId' })
  @ApiQuery({
    name: 'provinceId',
    required: false,
    description: 'Filter regencies by provinceId',
  })
  @ApiResponse({
    status: 200,
    description: 'Cities retrieved successfully.',
    schema: {
      example: [
        { id: 'city1', name: 'City A', provinceId: 'prov1' },
        { id: 'city2', name: 'City B', provinceId: 'prov2' },
      ],
    },
  })
  async getRegencies(@Query('provinceId') provinceId?: string) {
    return await this.locationService.getRegencies(provinceId);
  }

  // Get all districts, optionally filtered by regencyId
  @Get('districts')
  @ApiOperation({ summary: 'Get all districts, optionally filtered by regencyId' })
  @ApiQuery({
    name: 'regencyId',
    required: false,
    description: 'Filter districts by regencyId',
  })
  @ApiResponse({
    status: 200,
    description: 'Districts retrieved successfully.',
    schema: {
      example: [
        { id: 'dist1', name: 'District A', regencyId: 'city1' },
        { id: 'dist2', name: 'District B', regencyId: 'city2' },
      ],
    },
  })
  async getDistricts(@Query('regencyId') regencyId?: string) {
    return await this.locationService.getDistricts(regencyId);
  }

  // Get all villages, optionally filtered by districtId
  @Get('villages')
  @ApiOperation({ summary: 'Get all villages, optionally filtered by districtId' })
  @ApiQuery({
    name: 'districtId',
    required: false,
    description: 'Filter villages by districtId',
  })
  @ApiResponse({
    status: 200,
    description: 'Villages retrieved successfully.',
    schema: {
      example: [
        { id: 'village1', name: 'Village A', districtId: 'dist1' },
        { id: 'village2', name: 'Village B', districtId: 'dist2' },
      ],
    },
  })
  async getVillages(@Query('districtId') districtId?: string) {
    return await this.locationService.getVillages(districtId);
  }
}
