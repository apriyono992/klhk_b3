import { Controller, Get, Query } from '@nestjs/common';
import { LocationService } from '../services/location.services'; // Import the LocationService
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';

@ApiTags('Location')
@Controller('location')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  // Get all provinces
  @Get('provinces')
  @ApiOperation({ summary: 'Get all provinces' })
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
  async getVillages(@Query('districtId') districtId?: string) {
    return await this.locationService.getVillages(districtId);
  }
}
