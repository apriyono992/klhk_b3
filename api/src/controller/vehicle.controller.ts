import { Controller, Post, Put, Delete, Body, Param, Query, Get, HttpStatus, HttpCode } from '@nestjs/common';
import { ConnectVehiclePemohonanDto } from 'src/models/connectVehiclePemohonanDto';
import { CreateVehicleDto } from 'src/models/createVehicleDto';
import { UpdateVehicleDto } from 'src/models/updateVehicleDto';
import { ApiTags, ApiOperation, ApiBody, ApiParam, ApiResponse } from '@nestjs/swagger';
import { VehicleService } from 'src/services/vehicle.services';
import { SearchVehicleDto } from 'src/models/searchVehicleDto';
import { RemoveVehicleFromApplicationDto } from 'src/models/removeVehicleFromApplicationDto';

@ApiTags('Vehicles')
@Controller('vehicles')
export class VehicleController {
  constructor(private readonly vehicleService: VehicleService) {}

  @Post('link')
  @ApiOperation({ summary: 'Link an existing vehicle to an application' })
  @ApiBody({ type: ConnectVehiclePemohonanDto })
  @ApiResponse({
    status: 200,
    description: 'Vehicle successfully linked to the application',
    content: {
      'application/json': {
        example: {
          message: 'Vehicle successfully linked to the application',
          vehicle: {
            id: 'vehicle001',
            nomorPolisi: 'B 1234 ABC',
            tipeKendaraan: 'Truck',
            pemilik: 'PT. XYZ',
            status: 'Linked',
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid data or vehicle not found',
  })
  async linkExistingVehicleToApplication(@Body() connectVehicleDto: ConnectVehiclePemohonanDto) {
    return this.vehicleService.linkExistingVehicleToApplication(connectVehicleDto);
  }

  @Post('add-to-application')
  @ApiOperation({ summary: 'Add a new vehicle and link it to an application' })
  @ApiBody({ type: CreateVehicleDto })
  @ApiResponse({
    status: 201,
    description: 'Vehicle successfully added and linked to the application',
    content: {
      'application/json': {
        example: {
          message: 'Vehicle successfully added and linked to the application',
          vehicle: {
            id: 'vehicle002',
            nomorPolisi: 'B 5678 DEF',
            tipeKendaraan: 'Van',
            pemilik: 'PT. ABC',
            status: 'Active',
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid data or application not found',
  })
  async addNewVehicleToApplication(@Body() createVehicleDto: CreateVehicleDto) {
    return this.vehicleService.addNewVehicleToApplication(createVehicleDto);
  }

  @Post('add-to-company')
  @ApiOperation({ summary: 'Add a new vehicle and link it to a company' })
  @ApiBody({ type: CreateVehicleDto })
  @ApiResponse({
    status: 201,
    description: 'Vehicle successfully added and linked to the company',
    content: {
      'application/json': {
        example: {
          message: 'Vehicle successfully added and linked to the company',
          vehicle: {
            id: 'vehicle003',
            nomorPolisi: 'B 9101 GHI',
            tipeKendaraan: 'Bus',
            pemilik: 'PT. LMN',
            status: 'Active',
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid data or company not found',
  })
  async addNewVehicleToCompany(@Body() createVehicleDto: CreateVehicleDto) {
    return this.vehicleService.addNewVehicleToCompany(createVehicleDto);
  }

  @Delete(':vehicleId')
  @ApiOperation({ summary: 'Soft delete a vehicle' })
  @ApiParam({ name: 'vehicleId', description: 'ID of the vehicle to be soft deleted' })
  @ApiResponse({
    status: 200,
    description: 'Vehicle successfully soft deleted',
    content: {
      'application/json': {
        example: {
          message: 'Vehicle successfully soft deleted',
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Vehicle not found',
  })
  async softDeleteVehicle(@Param('vehicleId') vehicleId: string) {
    return this.vehicleService.softDeleteVehicle(vehicleId);
  }

  @Put()
  @ApiOperation({ summary: 'Update vehicle details' })
  @ApiBody({ type: UpdateVehicleDto })
  @ApiResponse({
    status: 200,
    description: 'Vehicle successfully updated',
    content: {
      'application/json': {
        example: {
          message: 'Vehicle successfully updated',
          vehicle: {
            id: 'vehicle004',
            nomorPolisi: 'B 1111 JKL',
            tipeKendaraan: 'SUV',
            pemilik: 'PT. OPQ',
            status: 'Active',
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid data or vehicle not found',
  })
  async updateVehicle(@Body() updateVehicleDto: UpdateVehicleDto) {
    return this.vehicleService.updateVehicle(updateVehicleDto);
  }

  @Get('search')
  @ApiOperation({ summary: 'Search and list vehicles with pagination and multiple filters' })
  @ApiResponse({
    status: 200,
    description: 'List of vehicles matching the search criteria',
    content: {
      'application/json': {
        example: {
          data: [
            {
              id: 'vehicle005',
              nomorPolisi: 'B 2222 MNO',
              tipeKendaraan: 'Truck',
              pemilik: 'PT. DEF',
              status: 'Active',
            },
          ],
          page: 1,
          limit: 10,
          total: 1,
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid search query parameters',
  })
  async searchVehicles(@Query() searchVehicleDto: SearchVehicleDto) {
    return this.vehicleService.searchVehicles(searchVehicleDto);
  }

  @Get(':vehicleId')
  @ApiOperation({ summary: 'Get a single vehicle by its ID' })
  @ApiParam({ name: 'vehicleId', description: 'ID of the vehicle' })
  @ApiResponse({
    status: 200,
    description: 'Vehicle details',
    content: {
      'application/json': {
        example: {
          id: 'vehicle006',
          nomorPolisi: 'B 3333 PQR',
          tipeKendaraan: 'Truck',
          pemilik: 'PT. XYZ',
          status: 'Active',
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Vehicle not found',
  })
  async getVehicleById(@Param('vehicleId') vehicleId: string) {
    return this.vehicleService.getVehicleById(vehicleId);
  }

  @Delete('/vehicle/application/remove-vehicle')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Remove a vehicle from an application' })
  @ApiBody({
    type: RemoveVehicleFromApplicationDto,
    description: 'Details of the vehicle and application',
    schema: {
      example: {
        vehicleId: '12345',
        applicationId: '67890'
      }
    }
  })
  @ApiResponse({
    status: 200,
    description: 'Vehicle removed successfully from the application.',
    schema: {
      example: { message: 'Vehicle removed successfully from the application.' }
    }
  })
  @ApiResponse({
    status: 404,
    description: 'Vehicle not found.',
    schema: {
      example: {
        statusCode: 404,
        message: 'Vehicle not found.'
      }
    }
  })
  @ApiResponse({
    status: 400,
    description: 'This vehicle is not linked to the specified application.',
    schema: {
      example: {
        statusCode: 400,
        message: 'This vehicle is not linked to the specified application.'
      }
    }
  })
  @ApiResponse({
    status: 500,
    description: 'An error occurred while removing the vehicle from the application.',
    schema: {
      example: {
        statusCode: 500,
        message: 'An error occurred while removing the vehicle from the application.'
      }
    }
  })
  async removeVehicleFromApplication(@Body() removeVehicleDto: RemoveVehicleFromApplicationDto) {
    const { vehicleId, applicationId } = removeVehicleDto;
    const result = await this.vehicleService.removeVehicleFromApplication(vehicleId, applicationId);
    return result;
  }
}
