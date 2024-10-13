import { Controller, Post, Put, Delete, Body, Param, Query, Get } from '@nestjs/common';
import { ConnectVehiclePemohonanDto } from 'src/models/connectVehiclePemohonanDto';
import { CreateVehicleDto } from 'src/models/createVehicleDto';
import { UpdateVehicleDto } from 'src/models/updateVehicleDto';
import { ApiTags, ApiOperation, ApiBody, ApiParam } from '@nestjs/swagger';
import { VehicleService } from 'src/services/vehicle.services';
import { SearchVehicleDto } from 'src/models/searchVehicleDto';

@ApiTags('Vehicles')
@Controller('vehicles')
export class VehicleController {
  constructor(private readonly vehicleService: VehicleService) {}

  @Post('link')
  @ApiOperation({ summary: 'Link an existing vehicle to an application' })
  @ApiBody({ type: ConnectVehiclePemohonanDto })
  async linkExistingVehicleToApplication(@Body() connectVehicleDto: ConnectVehiclePemohonanDto) {
    return this.vehicleService.linkExistingVehicleToApplication(connectVehicleDto);
  }

  @Post('add-to-application')
  @ApiOperation({ summary: 'Add a new vehicle and link it to an application' })
  @ApiBody({ type: CreateVehicleDto })
  async addNewVehicleToApplication(@Body() createVehicleDto: CreateVehicleDto) {
    return this.vehicleService.addNewVehicleToApplication(createVehicleDto);
  }

  @Post('add-to-company')
  @ApiOperation({ summary: 'Add a new vehicle and link it to a company' })
  @ApiBody({ type: CreateVehicleDto })
  async addNewVehicleToCompany(@Body() createVehicleDto: CreateVehicleDto) {
    return this.vehicleService.addNewVehicleToCompany(createVehicleDto);
  }

  @Delete(':vehicleId')
  @ApiOperation({ summary: 'Soft delete a vehicle' })
  @ApiParam({ name: 'vehicleId', description: 'ID of the vehicle to be soft deleted' })
  async softDeleteVehicle(@Param('vehicleId') vehicleId: string) {
    return this.vehicleService.softDeleteVehicle(vehicleId);
  }

  @Put()
  @ApiOperation({ summary: 'Update vehicle details' })
  @ApiBody({ type: UpdateVehicleDto })
  async updateVehicle(@Body() updateVehicleDto: UpdateVehicleDto) {
    return this.vehicleService.updateVehicle(updateVehicleDto);
  }

  @Get('search')
  @ApiOperation({ summary: 'Search and list vehicles with pagination and multiple filters' })
  async searchVehicles(@Query() searchVehicleDto: SearchVehicleDto) {
    return this.vehicleService.searchVehicles(searchVehicleDto);
  }

  @Get(':vehicleId')
  @ApiOperation({ summary: 'Get a single vehicle by its ID' })
  async getVehicleById(@Param('vehicleId') vehicleId: string) {
    return this.vehicleService.getVehicleById(vehicleId);
  }
}
