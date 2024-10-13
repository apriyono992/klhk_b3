import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from './prisma.services';
import { CreateB3PermohonanRekomDto } from 'src/models/createB3PermohonanRekomDto';
import { UpdateB3PermohonanRekomDto } from 'src/models/updateB3PermohonanRekomDto';
import { SearchBahanB3PermohonanRekomDto } from 'src/models/searchBahanB3PermohonanRekomDto';
import { Prisma } from '@prisma/client';


@Injectable()
export class BahanB3Service {
  constructor(private readonly prisma: PrismaService) {}

  // Add a new B3Substance to an application
  async createB3Substance(createB3SubstanceDto: CreateB3PermohonanRekomDto) {
    const newB3Substance = await this.prisma.b3Substance.create({
      data: createB3SubstanceDto,
    });
    return {
      message: 'B3Substance added successfully to the application',
      b3Substance: newB3Substance,
    };
  }

  // Edit an existing B3Substance
  async updateB3Substance(updateB3SubstanceDto: UpdateB3PermohonanRekomDto) {
    const updatedB3Substance = await this.prisma.b3Substance.update({
      where: { id: updateB3SubstanceDto.dataBahanB3Id },
      data: updateB3SubstanceDto,
    });

    return {
      message: 'B3Substance updated successfully',
      b3Substance: updatedB3Substance,
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
