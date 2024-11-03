import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from './prisma.services';
import { CreateB3PermohonanRekomDto } from 'src/models/createB3PermohonanRekomDto';
import { UpdateB3PermohonanRekomDto } from 'src/models/updateB3PermohonanRekomDto';
import { SearchBahanB3PermohonanRekomDto } from 'src/models/searchBahanB3PermohonanRekomDto';
import { Prisma } from '@prisma/client';


@Injectable()
export class BahanB3Service {
  constructor(private readonly prisma: PrismaService) {}

  // Add a new B3Substance and related LocationDetails as one transaction
  async createB3Substance(createB3SubstanceDto: CreateB3PermohonanRekomDto) {
    const { asalMuat, tujuanBongkar, ...b3SubstanceData } = createB3SubstanceDto;
  
    // Begin transaction
    const transaction = await this.prisma.$transaction(async (prisma) => {
      // Create the B3Substance with relations using connect
      const newB3Substance = await prisma.b3Substance.create({
        data: {
          ...b3SubstanceData,
        },
      });
  
      // Prepare asalMuat locations data
      const asalMuatLocations = asalMuat.map((location) => ({
        name: location.name,
        alamat: location.alamat,
        longitude: location.longitude,
        latitude: location.latitude,
        b3SubstanceIdAsalMuat: newB3Substance.id,
        locationType: 'ASAL_MUAT',
      }));
  
      // Prepare tujuanBongkar locations data
      const tujuanBongkarLocations = tujuanBongkar.map((location) => ({
        name: location.name,
        alamat: location.alamat,
        longitude: location.longitude,
        latitude: location.latitude,
        b3SubstanceIdTujuanBongkar: newB3Substance.id,
        locationType: 'TUJUAN_BONGKAR',
      }));
  
      // Insert all locations for asalMuat and tujuanBongkar in one go
      await prisma.locationDetails.createMany({
        data: [
          ...asalMuatLocations.map(location => ({ ...location, b3SubstanceIdTujuanBongkar: null })),
          ...tujuanBongkarLocations.map(location => ({ ...location, b3SubstanceIdAsalMuat: null }))
        ],
      });
    });
  
    return {
      message: 'B3Substance added successfully to the application',
      b3Substance: transaction,
    };
  }

  // Edit an existing B3Substance
  async updateB3Substance(updateB3SubstanceDto: UpdateB3PermohonanRekomDto) {
    const { asalMuat, tujuanBongkar, dataBahanB3Id, ...b3SubstanceData } = updateB3SubstanceDto;

    // Initialize data object to include only defined properties
    const data: any = {};
    if (b3SubstanceData.b3pp74 !== undefined) data.b3pp74 = b3SubstanceData.b3pp74;
    if (b3SubstanceData.b3DiluarList !== undefined) data.b3DiluarList = b3SubstanceData.b3DiluarList;
    if (b3SubstanceData.karakteristikB3 !== undefined) data.karakteristikB3 = b3SubstanceData.karakteristikB3;
    if (b3SubstanceData.fasaB3 !== undefined) data.fasaB3 = b3SubstanceData.fasaB3;
    if (b3SubstanceData.jenisKemasan !== undefined) data.jenisKemasan = b3SubstanceData.jenisKemasan;
    if (b3SubstanceData.tujuanPenggunaan !== undefined) data.tujuanPenggunaan = b3SubstanceData.tujuanPenggunaan;

    // Begin transaction to ensure consistency
    const transaction = await this.prisma.$transaction(async (prisma) => {
      // Update the B3Substance base data
      const updatedB3Substance = await prisma.b3Substance.update({
        where: { id: dataBahanB3Id },
        data,
      });

      if(!updatedB3Substance) {
        throw new NotFoundException(`B3Substance with ID ${dataBahanB3Id} not found`);
      }

      // Update asalMuat locations if provided
      if (asalMuat) {
        await prisma.locationDetails.deleteMany({
          where: { b3SubstanceIdAsalMuat: dataBahanB3Id, locationType: 'ASAL_MUAT' },
        });
        const asalMuatLocations = asalMuat.map((location) => ({
          name: location.name,
          alamat: location.alamat,
          longitude: location.longitude,
          latitude: location.latitude,
          b3SubstanceIdAsalMuat: dataBahanB3Id,
          locationType: 'ASAL_MUAT',
        }));
        await prisma.locationDetails.createMany({ data: asalMuatLocations });
      }

      // Update tujuanBongkar locations if provided
      if (tujuanBongkar) {
        await prisma.locationDetails.deleteMany({
          where: { b3SubstanceIdTujuanBongkar: dataBahanB3Id, locationType: 'TUJUAN_BONGKAR' },
        });
        const tujuanBongkarLocations = tujuanBongkar.map((location) => ({
          name: location.name,
          alamat: location.alamat,
          longitude: location.longitude,
          latitude: location.latitude,
          b3SubstanceIdTujuanBongkar: dataBahanB3Id,
          locationType: 'TUJUAN_BONGKAR',
        }));
        await prisma.locationDetails.createMany({ data: tujuanBongkarLocations });
      }

      return updatedB3Substance;
    });

    return {
      message: 'B3Substance updated successfully',
      b3Substance: transaction,
    };
  }

  // Soft delete a B3Substance (delete it logically)
  async deleteB3Substance(id: string) {
    const existingB3Substance = await this.prisma.b3Substance.findUnique({
      where: { id },
    });

    if (!existingB3Substance) {
      throw new NotFoundException(`B3Substance with ID ${id} not found`);
    }

    await this.prisma.b3Substance.delete({
      where: { id },
    });

    return {
      message: 'B3Substance deleted successfully',
    };
  }

  // Get a single B3Substance by ID
  async getB3SubstanceById(id: string) {
    const b3Substance = await this.prisma.b3Substance.findUnique({
      where: { id },
    });

    if (!b3Substance) {
      throw new NotFoundException(`B3Substance with ID ${id} not found`);
    }

    return b3Substance; 
  }

  // Search and list B3Substances with filtering options
  async searchB3Substances(searchDto: SearchBahanB3PermohonanRekomDto) {
    const {
      page,
      limit,
      sortBy,
      sortOrder,
      karakteristikB3,
      fasaB3,
      jenisKemasan,
      asalMuat,
      tujuanBongkar,
      tujuanPenggunaan,
      b3pp74,
      b3DiluarList,
      applicationId
    } = searchDto;

    const where: Prisma.B3SubstanceWhereInput = {
      applicationId,
      ...(karakteristikB3 && { karakteristikB3: { in: karakteristikB3, mode: Prisma.QueryMode.insensitive } }),
      ...(fasaB3 && { fasaB3: { in: fasaB3, mode: Prisma.QueryMode.insensitive } }),
      ...(jenisKemasan && { jenisKemasan: { in: jenisKemasan, mode: Prisma.QueryMode.insensitive } }),
      ...(asalMuat && { asalMuat: { in: asalMuat, mode: Prisma.QueryMode.insensitive } }),
      ...(tujuanBongkar && { tujuanBongkar: { in: tujuanBongkar, mode: Prisma.QueryMode.insensitive } }),
      ...(tujuanPenggunaan && { tujuanPenggunaan: { in: tujuanPenggunaan, mode: Prisma.QueryMode.insensitive } }),
      ...(b3pp74 !== undefined && { b3pp74 }),
      ...(b3DiluarList !== undefined && { b3DiluarList }),
    };

    const [b3Substances, total] = await Promise.all([
      this.prisma.b3Substance.findMany({
        where,
        orderBy: { [sortBy]: sortOrder },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.b3Substance.count({ where }),
    ]);

    return {
      total,
      page,
      limit,
      b3Substances,
    };
  }
}
