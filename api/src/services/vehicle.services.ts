import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from './prisma.services';
import { ConnectVehiclePemohonanDto } from 'src/models/connectVehiclePemohonanDto';
import { CreateVehicleDto } from 'src/models/createVehicleDto';
import { UpdateVehicleDto } from 'src/models/updateVehicleDto';
import { SearchVehicleDto } from 'src/models/searchVehicleDto';
import { Prisma } from '@prisma/client';

@Injectable()
export class VehicleService {
  constructor(private readonly prisma: PrismaService) {}

  // Link an existing vehicle to an application
  async linkExistingVehicleToApplication(connectVehicleDto: ConnectVehiclePemohonanDto) {
    // Ensure the application exists
    const application = await this.prisma.application.findUnique({
      where: { id: connectVehicleDto.applicationId },
    });

    // Ensure the vehicle exists
    const existingVehicle = await this.prisma.vehicle.findUnique({
      where: { id: connectVehicleDto.vehicleId },
    });

    // Link the existing vehicle to the application
    await this.prisma.applicationOnVehicle.create({
      data: {
        applicationId: application.id,
        vehicleId: existingVehicle.id,
      },
    });

    return {
      message: 'Existing vehicle linked to the application successfully',
      vehicle: existingVehicle,
    };
  }

  // Add a new vehicle and link it to an application
  async addNewVehicleToApplication(createVehicleDto: CreateVehicleDto) {

    // Ensure the application exists before adding vehicles
    const application = await this.prisma.application.findUnique({
      where: { id: createVehicleDto.applicationId },
    });

    // Create the new vehicle and link it to the application
    const newVehicle = await this.prisma.vehicle.create({
      data: {
        kepemilikan: createVehicleDto.kepemilikan,
        modelKendaraan: createVehicleDto.modelKendaraan,
        nomorMesin: createVehicleDto.nomorMesin,
        nomorRangka: createVehicleDto.nomorRangka,
        noPolisi: createVehicleDto.noPolisi,
        tahunPembuatan: createVehicleDto.tahunPembuatan,
        companyId: createVehicleDto.companyId,
        applications: {
          create: {
            applicationId: application.id,
          },
        },
      },
    });

    return {
      message: 'New vehicle added successfully to the application',
      vehicle: newVehicle,
    };
  }

    // Add a new vehicle and link it to an application
    async addNewVehicleToCompany(createVehicleDto: CreateVehicleDto) {
        // Create the new vehicle and link it to the application
        const newVehicle = await this.prisma.vehicle.create({
            data: {
              kepemilikan: createVehicleDto.kepemilikan,
              modelKendaraan: createVehicleDto.modelKendaraan,
              nomorMesin: createVehicleDto.nomorMesin,
              nomorRangka: createVehicleDto.nomorRangka,
              noPolisi: createVehicleDto.noPolisi,
              tahunPembuatan: createVehicleDto.tahunPembuatan,
              companyId: createVehicleDto.companyId,
            },
          });
    
        return {
          message: 'New vehicle added successfully to the company',
          vehicle: newVehicle,
        };
      }

  // Soft delete a vehicle (set deletedAt timestamp)
  async softDeleteVehicle(vehicleId: string) {
    const vehicle = await this.prisma.vehicle.findUnique({
      where: { id: vehicleId },
    });
    if (!vehicle) {
      throw new NotFoundException(`Vehicle with ID ${vehicleId} not found`);
    }

    // Soft delete by setting deletedAt to the current time
    await this.prisma.vehicle.update({
      where: { id: vehicleId },
      data: {
        deletedAt: new Date(),
      },
    });

    return {
      message: 'Vehicle soft deleted successfully',
    };
  }

  // Edit or update vehicle details
  async updateVehicle(updateVehicleDto: UpdateVehicleDto) {
    // Update vehicle details
    const updatedVehicle = await this.prisma.vehicle.update({
      where: { id: updateVehicleDto.vehicleId },
      data: {
        ...updateVehicleDto,
      },
    });

    return {
      message: 'Vehicle updated successfully',
      vehicle: updatedVehicle,
    };
  }

  // Search and list vehicles with pagination and multiple filters
  async searchVehicles(searchVehicleDto: SearchVehicleDto) {
    const { page, limit, sortBy, sortOrder, noPolisi, modelKendaraan, kepemilikan, applicationId, companyId } = searchVehicleDto;

    // Construct the Prisma `where` filter
    const where: Prisma.VehicleWhereInput = {
      ...(noPolisi && { noPolisi: { in: noPolisi, mode: Prisma.QueryMode.insensitive } }), // Correct Prisma.QueryMode usage
      ...(modelKendaraan && { modelKendaraan: { contains: modelKendaraan, mode: Prisma.QueryMode.insensitive } }),
      ...(kepemilikan && { kepemilikan: { contains: kepemilikan, mode: Prisma.QueryMode.insensitive } }),
      ...(applicationId && { applications: { some: { applicationId } } }),
      ...(companyId && { companyId }), // Filter by companyId
    };

    const [vehicles, total] = await Promise.all([
      this.prisma.vehicle.findMany({
        where,
        orderBy: { [sortBy]: sortOrder },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          applications: true, // Include the application relationship
          company: true, // Include the company relationship
        },
      }),
      this.prisma.vehicle.count({ where }),
    ]);

    return {
      total,
      page,
      limit,
      vehicles,
    };
  }

  // Get a single vehicle by ID
  async getVehicleById(vehicleId: string) {
    const vehicle = await this.prisma.vehicle.findUnique({
      where: { id: vehicleId },
      include: {
        applications: true,
        company: true,
      },
    });

    if (!vehicle) {
      throw new NotFoundException(`Vehicle with ID ${vehicleId} not found`);
    }
    return vehicle;
  }
}
