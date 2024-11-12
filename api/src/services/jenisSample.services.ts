import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from './prisma.services';
import { CreateJenisSampleTypeDto } from '../models/createSampleTypeDto';

@Injectable()
export class JenisSampleService {
  private readonly maxRetries = 20;

  constructor(private prisma: PrismaService) {}

  // Create a new JenisSample
  async create(createJenisSampleDto: CreateJenisSampleTypeDto) {
    const { type, deskripsi } = createJenisSampleDto;
    let retries = 0;

    while (retries < this.maxRetries) {
      try {
        // Find the existing JenisSampleType or create it if it doesn't exist
        let jenisSampleType = await this.prisma.jenisSampleType.findUnique({
          where: { type },
        });

        // If JenisSampleType doesn't exist, create it
        if (!jenisSampleType) {
          jenisSampleType = await this.prisma.jenisSampleType.create({
            data: {
              type: type,
              deskripsi: deskripsi ?? undefined,  // Optionally add description
            },
          });
        }

        // Generate the next code (2-digit string)
        const nextCode = await this.generateNextCode(jenisSampleType.id);

        // Create the JenisSample
        const createdSample = await this.prisma.jenisSample.create({
          data: {
            code: nextCode,
            deskripsi: deskripsi,
            typeId: jenisSampleType.id,
          },
        });

        // Return the JNS_code as `type_code` format
        return {
          success: true,
          code: `${type}_${nextCode}`,  // Return the concatenated JNS_code
          data: createdSample,
        };

      } catch (error) {
        if (error.code === 'P2002') {  // Unique constraint violation (code + typeId)
          retries++;
          if (retries >= this.maxRetries) {
            throw new BadRequestException('Conflict: Maximum retries reached, could not create JenisSample');
          }
        } else {
          throw error;
        }
      }
    }
  }

  // Update the description of an existing JenisSample by ID
  async updateDeskripsi(id: string, updateJenisSampleDeskripsiDto: CreateJenisSampleTypeDto) {
    try {
      const existingRecord = await this.prisma.jenisSample.findUnique({
        where: { id },
      });

      if (!existingRecord) {
        throw new NotFoundException(`JenisSample not found`);
      }

      // Update only the deskripsi field
      return await this.prisma.jenisSample.update({
        where: { id },
        data: {
          deskripsi: updateJenisSampleDeskripsiDto.deskripsi ?? existingRecord.deskripsi,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  // Helper function to generate the next 2-digit code for a given typeId
  private async generateNextCode(typeId: string): Promise<string> {
    const lastSample = await this.prisma.jenisSample.findFirst({
      where: { typeId },
      orderBy: { code: 'desc' },
    });

    let nextNumber = 1;

    if (lastSample) {
      nextNumber = parseInt(lastSample.code) + 1;
    }

    return String(nextNumber).padStart(2, '0');  // Ensure 2-digit format
  }
}
