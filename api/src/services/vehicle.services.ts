import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from './prisma.services';
import { ConnectVehiclePemohonanDto } from 'src/models/connectVehiclePemohonanDto';
import { CreateVehicleDto } from 'src/models/createVehicleDto';
import { UpdateVehicleDto } from 'src/models/updateVehicleDto';
import { SearchVehicleDto } from 'src/models/searchVehicleDto';
import { Prisma } from '@prisma/client';
import { checkForExistingVehicle } from 'src/utils/helpers';

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
    // Check for existing vehicle
    const existingVehicle = await checkForExistingVehicle(this.prisma,createVehicleDto);

    if (existingVehicle) {
        // If the vehicle exists and is deleted, reactivate it
        if (existingVehicle.deletedAt) {
            const reactivatedVehicle = await this.prisma.vehicle.update({
                where: { id: existingVehicle.id },
                data: {
                    deletedAt: null, // Set deletedAt to null to reactivate
                    kepemilikan: createVehicleDto.kepemilikan,
                    modelKendaraan: createVehicleDto.modelKendaraan,
                    tahunPembuatan: createVehicleDto.tahunPembuatan,
                    companyId: createVehicleDto.companyId,
                },
            });

            // Link the vehicle to the application
            await this.prisma.applicationOnVehicle.create({
                data: {
                    applicationId: createVehicleDto.applicationId,
                    vehicleId: reactivatedVehicle.id,
                },
            });

            return {
                message: 'Vehicle reactivated and linked to the application successfully',
                vehicle: reactivatedVehicle,
            };
        } else {
            throw new BadRequestException('A vehicle with the same identifiers already exists and is active.');
        }
    }

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

  async removeVehicleFromApplication(vehicleId: string, applicationId: string) {
    try {
        const result = await this.prisma.$transaction(async (prisma) => {
            // Ensure the vehicle exists and check if the application is linked to the vehicle
            const vehicle = await prisma.vehicle.findUnique({
                where: { id: vehicleId },
                include: {
                    applications: true, // Include applications to check the relationship
                },
            });

            // Check if vehicle exists
            if (!vehicle) {
                throw new NotFoundException('Vehicle not found.');
            }

            // Check if the application is linked to the vehicle
            const applicationLinkExists = await prisma.applicationOnVehicle.findUnique({
                where: {
                    applicationId_vehicleId: {
                        applicationId: applicationId,
                        vehicleId: vehicleId,
                    },
                },
            });

            if (!applicationLinkExists) {
                throw new BadRequestException('This vehicle is not linked to the specified application.');
            }

            // Remove the application link from the vehicle
            await prisma.applicationOnVehicle.delete({
                where: {
                    applicationId_vehicleId: {
                        applicationId: applicationId,
                        vehicleId: vehicleId, // Include vehicleId as part of the compound unique key
                    },
                },
            });

            return { message: 'Vehicle removed successfully from the application.' };
        });

        return result;

    } catch (error) {
        // Handle known exceptions
        if (error instanceof NotFoundException || error instanceof BadRequestException) {
            throw error; // Re-throw known exceptions
        } else {
            throw new InternalServerErrorException('An error occurred while removing the vehicle from the application.');
        }
    }
  }

  // Add a new vehicle to a company
  async addNewVehicleToCompany(createVehicleDto: CreateVehicleDto) {
    // Check for existing vehicle
    const existingVehicle = await checkForExistingVehicle(this.prisma,createVehicleDto);

    if (existingVehicle) {
        // If the vehicle exists and is deleted, reactivate it
        if (existingVehicle.deletedAt) {
            const reactivatedVehicle = await this.prisma.vehicle.update({
                where: { id: existingVehicle.id },
                data: {
                    deletedAt: null, // Set deletedAt to null to reactivate
                    kepemilikan: createVehicleDto.kepemilikan,
                    modelKendaraan: createVehicleDto.modelKendaraan,
                    tahunPembuatan: createVehicleDto.tahunPembuatan,
                    companyId: createVehicleDto.companyId,
                },
            });

            return {
                message: 'Vehicle reactivated successfully for the company',
                vehicle: reactivatedVehicle,
            };
        } else {
            throw new BadRequestException('A vehicle with the same identifiers already exists and is active.');
        }
    }

    // Create the new vehicle and link it to the company
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
    // Check if the vehicle exists
    const vehicle = await this.prisma.vehicle.findUnique({
        where: { id: vehicleId },
    });

    if (!vehicle) {
        throw new NotFoundException(`Vehicle with ID ${vehicleId} not found`);
    }

    // Check if the vehicle is linked to any applications
    const applicationLinkExists = await this.prisma.applicationOnVehicle.findFirst({
        where: { vehicleId: vehicleId },
    });

    if (applicationLinkExists) {
        throw new BadRequestException('Vehicle cannot be deleted as it is linked to one or more applications.');
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
    // Ensure vehicleId is provided
    if (!updateVehicleDto.vehicleId) {
        throw new BadRequestException('Vehicle ID must be provided.');
    }

    try {
        // Find the vehicle to ensure it exists and check if it is deleted
        const vehicleExists = await this.prisma.vehicle.findUnique({
            where: { id: updateVehicleDto.vehicleId },
        });

        if (!vehicleExists) {
            throw new NotFoundException('Vehicle not found.');
        }

        // Check if the vehicle is marked as deleted
        if (vehicleExists.deletedAt) {
            throw new BadRequestException('Cannot update vehicle as it is marked as deleted.');
        }

        // Prepare the data to update using simple if statements
        const dataToUpdate: any = {}; // Create an object to hold the update data

        if (updateVehicleDto.noPolisi !== undefined) {
            dataToUpdate.noPolisi = updateVehicleDto.noPolisi;
        }
        if (updateVehicleDto.modelKendaraan !== undefined) {
            dataToUpdate.modelKendaraan = updateVehicleDto.modelKendaraan;
        }
        if (updateVehicleDto.tahunPembuatan !== undefined) {
            dataToUpdate.tahunPembuatan = updateVehicleDto.tahunPembuatan;
        }
        if (updateVehicleDto.nomorRangka !== undefined) {
            dataToUpdate.nomorRangka = updateVehicleDto.nomorRangka;
        }
        if (updateVehicleDto.nomorMesin !== undefined) {
            dataToUpdate.nomorMesin = updateVehicleDto.nomorMesin;
        }
        if (updateVehicleDto.kepemilikan !== undefined) {
            dataToUpdate.kepemilikan = updateVehicleDto.kepemilikan;
        }

        // Update vehicle details
        const updatedVehicle = await this.prisma.vehicle.update({
            where: { id: updateVehicleDto.vehicleId },
            data: dataToUpdate,
        });

        return {
            message: 'Vehicle updated successfully',
            vehicle: updatedVehicle,
        };
    } catch (error) {
        // Handle Prisma errors or other unexpected errors
        if (error instanceof NotFoundException || error instanceof BadRequestException) {
            throw error; // Re-throw known exceptions
        } else {
            throw new BadRequestException('An error occurred while updating the vehicle.');
        }
    }
  }

  // Search and list vehicles with pagination and multiple filters
  async searchVehicles(searchVehicleDto: SearchVehicleDto) {
      const {
          page,
          limit,
          sortBy,
          sortOrder,
          noPolisi,
          modelKendaraan,
          kepemilikan,
          applicationId,
          companyId,
          includeDeleted, // New property to include or exclude deleted vehicles
      } = searchVehicleDto;

      // Construct the Prisma `where` filter
      const where: Prisma.VehicleWhereInput = {
          ...(noPolisi && { noPolisi: { in: noPolisi, mode: Prisma.QueryMode.insensitive } }),
          ...(modelKendaraan && { modelKendaraan: { contains: modelKendaraan, mode: Prisma.QueryMode.insensitive } }),
          ...(kepemilikan && { kepemilikan: { contains: kepemilikan, mode: Prisma.QueryMode.insensitive } }),
          ...(applicationId && { applications: { some: { applicationId } } }),
          ...(companyId && { companyId }), // Filter by companyId
          // Include deleted or not based on the new property
          ...(includeDeleted === undefined && { deletedAt: null }), // Default to not include deleted vehicles
          ...(includeDeleted === true && { deletedAt: { not: null } }), // Include deleted vehicles (deletedAt is not null)
          ...(includeDeleted === false && { deletedAt: null }), // Exclude deleted vehicles (deletedAt is null)
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
