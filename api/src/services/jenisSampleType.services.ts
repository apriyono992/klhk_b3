import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from './prisma.services';
import { CreateJenisSampleTypeDto } from '../models/createSampleTypeDto';

@Injectable()
export class JenisSampleTypeService {
  private readonly maxRetries = 5;

  constructor(private prisma: PrismaService) {}

  // Create a new JenisSampleType
  async create(createJenisSampleTypeDto: CreateJenisSampleTypeDto) {
    try {
      return await this.prisma.jenisSampleType.create({
        data: {
          type: createJenisSampleTypeDto.type,
          deskripsi: createJenisSampleTypeDto.deskripsi ?? null  // Create type like 'JNS', 'BML'
        },
      });
    } catch (error) {
      if (error.code === 'P2002') {  // Prisma unique constraint violation (duplicate type)
        throw new BadRequestException('Conflict: Type already exists');
      }
      throw error;
    }
  }

  // Update an existing JenisSampleType by ID
  async update(id: string, updateJenisSampleTypeDto: CreateJenisSampleTypeDto) {
    try {
      // Check if the record exists
      const existingRecord = await this.prisma.jenisSampleType.findUnique({
        where: { id },
      });

      if (!existingRecord) {
        throw new NotFoundException(`JenisSampleType not found`);
      }

      // Proceed with the update
      return await this.prisma.jenisSampleType.update({
        where: { id },
        data: {
          ...updateJenisSampleTypeDto,
        },
      });
    } catch (error) {
      if (error.code === 'P2002') {  // Prisma unique constraint violation (duplicate type)
        throw new BadRequestException('Conflict: Type already exists');
      }
      throw error;
    }
  }

  // Delete a JenisSampleType by ID
  async delete(id: string) {
    try {
      // Check if the record exists before deleting
      const existingRecord = await this.prisma.jenisSampleType.findUnique({
        where: { id },
      });

      if (!existingRecord) {
        throw new NotFoundException(`JenisSampleType not found`);
      }

      // Proceed with the delete
      return await this.prisma.jenisSampleType.delete({
        where: { id },
      });
    } catch (error) {
      throw error;
    }
  }
}
