import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from './prisma.services';
import { CreateBahanB3CompanyDto } from 'src/models/createBahanB3CompanyDto';
import { ApproveBahanB3RequestDto } from 'src/models/approveBahanB3RequestDto';
import { UpdateStokB3Dto } from 'src/models/updateStokB3Dto';
import { SearchBahanB3CompanyDto } from 'src/models/searchBahanB3CompanyDto';


@Injectable()
export class DataBahanB3CompanyService {
  constructor(private readonly prisma: PrismaService) {}

  // Create a new B3 addition request (pending approval)
  async createB3AdditionRequest(dto: CreateBahanB3CompanyDto) {
    const existingEntry = await this.prisma.dataBahanB3Company.findFirst({
      where: {
        companyId: dto.companyId,
        dataBahanB3Id: dto.dataBahanB3Id,
      },
    });

    if (existingEntry) throw new BadRequestException('B3 entry already exists for this company');

    // Create a pending addition request
    return this.prisma.stokB3AddRequest.create({
      data: {
        dataBahanB3Id: dto.dataBahanB3Id,
        requestedStokB3: dto.stokB3,
        companyId: dto.companyId
      },
    });
  }

  // Create a stock update request (pending approval)
  async createStokUpdateRequest(dto: UpdateStokB3Dto) {
    const existingB3 = await this.prisma.dataBahanB3Company.findUnique({
      where: { id: dto.dataBahanB3CompanyId },
    });

    if (!existingB3) throw new NotFoundException('B3 entry not found');

    // Create a pending stock update request
    return this.prisma.stokB3UpdateRequest.create({
      data: {
        dataBahanB3CompanyId: dto.dataBahanB3CompanyId,
        requestedStokB3: dto.newStokB3,
      },
    });
  }

  // Approve addition or update request
  async approveRequest(dto: ApproveBahanB3RequestDto) {
    return this.prisma.$transaction(async (tx) => {
      // Check if it's a new B3 addition request
      const createRequest = await tx.stokB3AddRequest.findUnique({
        where: { id: dto.requestId },
      });
  
      if (createRequest) {
        // This is a new B3 addition request
  
        // 1. Create the new B3 entry
        const newEntry = await tx.dataBahanB3Company.create({
          data: {
            companyId: createRequest.companyId,
            dataBahanB3Id: createRequest.dataBahanB3Id,
            stokB3: createRequest.requestedStokB3,
          },
        });
  
        // 2. Log the history
        await tx.stokB3History.create({
          data: {
            dataBahanB3CompanyId: newEntry.id,
            previousStokB3: 0,
            newStokB3: createRequest.requestedStokB3,
          },
        });
  
        // 3. Create an approval entry
        const approval = await tx.approval.create({
          data: {
            approvedById: dto.approvedById,
            approvedAt: new Date(),
          },
        });
  
        // 4. Mark the request as approved
        return tx.stokB3UpdateRequest.update({
          where: { id: dto.requestId },
          data: {
            approved: true,
            approvalId: approval.id,
          },
        });
      } else {
        // Check if it's a stock update request
        const updateRequest = await tx.stokB3UpdateRequest.findUnique({
          where: { id: dto.requestId },
        });
  
        if (!updateRequest) throw new NotFoundException('Request not found');
        if (updateRequest.approved) throw new BadRequestException('Request already approved');
  
        // 1. Create an approval entry
        const approval = await tx.approval.create({
          data: {
            approvedById: dto.approvedById,
            approvedAt: new Date(),
          },
        });
  
        // 2. Fetch the existing B3 entry
        const existingEntry = await tx.dataBahanB3Company.findUnique({
          where: { id: updateRequest.dataBahanB3CompanyId },
        });
  
        if (!existingEntry) throw new NotFoundException('DataBahanB3Company entry not found');
  
        // 3. Update the stock value
        const updatedEntry = await tx.dataBahanB3Company.update({
          where: { id: existingEntry.id },
          data: { stokB3: updateRequest.requestedStokB3 },
        });
  
        // 4. Log the history
        await tx.stokB3History.create({
          data: {
            dataBahanB3CompanyId: updatedEntry.id,
            previousStokB3: existingEntry.stokB3,
            newStokB3: updateRequest.requestedStokB3,
          },
        });
  
        // 5. Mark the request as approved
        return tx.stokB3UpdateRequest.update({
          where: { id: dto.requestId },
          data: {
            approved: true,
            approvalId: approval.id,
          },
        });
      }
    });
  } 

  // List pending requests (addition and update)
  async listPendingRequests() {
    const addRequests = await this.prisma.stokB3AddRequest.findMany({
      where: { approved: false },
      include: {
        dataBahanB3: true,
        company: true,
      },
    });

    const updateRequests = await this.prisma.stokB3UpdateRequest.findMany({
      where: { approved: false },
      include: {
        dataBahanB3Company: {
          include: {
            company: true,
            dataBahanB3: true,
          },
        },
      },
    });

    return {
      addRequests,
      updateRequests,
    };
  }

  // Get detailed information for a single Bahan B3 entry
  async getBahanB3Detail(dataBahanB3CompanyId: string) {
    const detail = await this.prisma.dataBahanB3Company.findUnique({
      where: { id: dataBahanB3CompanyId },
      include: {
        company: true,
        dataBahanB3: true,
        stokHistory: true,
      },
    });

    if (!detail) throw new NotFoundException('Bahan B3 entry not found');
    return detail;
  }


  async searchBahanB3Company(dto: SearchBahanB3CompanyDto) {
    const {
      page,
      limit,
      sortBy,
      sortOrder,
      jenisBahanB3,
      companyId,
      stokB3Min,
      stokB3Max,
      tipePerusahaan,
      includeAll,
    } = dto;
  
    const skip = (page - 1) * limit;
  
    // Build the Prisma query filters
    const filters: any = {
      dataBahanB3: jenisBahanB3 ? { jenis: jenisBahanB3 } : undefined,
      companyId: companyId || undefined,
      stokB3: {
        gte: stokB3Min || undefined,
        lte: stokB3Max || undefined,
      },
      company: tipePerusahaan
        ? { tipePerusahaan: { hasSome: tipePerusahaan } }
        : undefined,
    };
  
    // Build the include object based on includeAll flag
    const include = includeAll
      ? {
          company: true,
          dataBahanB3: true,
          stokHistory: true,
        }
      : {
          company: true,
          dataBahanB3: true,
        };
  
    // Execute the search query
    const results = await this.prisma.dataBahanB3Company.findMany({
      where: filters,
      include,
      skip,
      take: limit,
      orderBy: {
        [sortBy]: sortOrder,
      },
    });
  
    // Get the total count for pagination
    const totalCount = await this.prisma.dataBahanB3Company.count({
      where: filters,
    });
  
    // Return the paginated response
    return {
      data: results,
      totalCount,
      page,
      limit,
      totalPages: Math.ceil(totalCount / limit),
    };
  }
}
