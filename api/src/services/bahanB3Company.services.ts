import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from './prisma.services';
import { CreateBahanB3CompanyDto } from 'src/models/createBahanB3CompanyDto';
import { ApproveBahanB3RequestDto } from 'src/models/approveBahanB3RequestDto';
import { UpdateStokB3Dto } from 'src/models/updateStokB3Dto';
import { SearchBahanB3CompanyDto } from 'src/models/searchBahanB3CompanyDto';
import { PaginationDto } from 'src/models/paginationDto';
import { SearchStokB3PeriodeDto } from 'src/models/searchStokB3PeriodeDto';


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
      // Cek apakah ini permintaan penambahan stok baru
      const createRequest = await tx.stokB3AddRequest.findUnique({
        where: { id: dto.requestId },
      });

      if (createRequest) {
        // Ini adalah permintaan penambahan B3 baru

        // 1. Buat entri B3 baru di dataBahanB3Company
        const newEntry = await tx.dataBahanB3Company.create({
          data: {
            companyId: createRequest.companyId,
            dataBahanB3Id: createRequest.dataBahanB3Id,
            stokB3: createRequest.requestedStokB3,
          },
        });

        // 2. Log histori stok
        await tx.stokB3History.create({
          data: {
            dataBahanB3CompanyId: newEntry.id,
            previousStokB3: 0,
            newStokB3: createRequest.requestedStokB3,
          },
        });

        // 3. Buat entri approval
        const approval = await tx.approval.create({
          data: {
            approvedById: dto.approvedById,
            approvedAt: new Date(),
          },
        });

        // 4. Tandai permintaan sebagai disetujui
        return tx.stokB3UpdateRequest.update({
          where: { id: dto.requestId },
          data: {
            approved: true,
            approvalId: approval.id,
          },
        });
      } else {
        // Cek apakah ini permintaan pembaruan stok
        const updateRequest = await tx.stokB3UpdateRequest.findUnique({
          where: { id: dto.requestId },
        });

        if (!updateRequest) throw new NotFoundException('Request not found');
        if (updateRequest.approved) throw new BadRequestException('Request already approved');

        // 1. Buat entri approval
        const approval = await tx.approval.create({
          data: {
            approvedById: dto.approvedById,
            approvedAt: new Date(),
          },
        });

        // 2. Ambil data stok B3 yang ada
        const existingEntry = await tx.dataBahanB3Company.findUnique({
          where: { id: updateRequest.dataBahanB3CompanyId },
        });

        if (!existingEntry) throw new NotFoundException('DataBahanB3Company entry not found');

        // 3. Hitung stok baru
        const newStokB3 = existingEntry.stokB3 + updateRequest.requestedStokB3;

        // Validasi agar stok tidak menjadi negatif
        if (newStokB3 < 0) {
          throw new BadRequestException('Stok tidak boleh negatif setelah pengurangan');
        }

        // 4. Perbarui nilai stok
        const updatedEntry = await tx.dataBahanB3Company.update({
          where: { id: existingEntry.id },
          data: { stokB3: newStokB3 },
        });

        // 5. Log histori perubahan stok
        await tx.stokB3History.create({
          data: {
            dataBahanB3CompanyId: updatedEntry.id,
            previousStokB3: existingEntry.stokB3,
            newStokB3: newStokB3,
          },
        });

        // 6. Tandai permintaan sebagai disetujui
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
      include: {
        dataBahanB3: true,
        company: true,
      },
    });

    const updateRequests = await this.prisma.stokB3UpdateRequest.findMany({
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

  // Method untuk mencari stok B3 pada StokB3Periode dengan date range
  async searchStokB3Periode(
    filter : SearchStokB3PeriodeDto 
  ) {
    const { companyId, dataBahanB3Id, startDate, endDate, page, limit, returnAll, sortOrder, sortBy } = filter;
    const queryOptions = {
      where: {
        companyId: companyId || undefined,
        dataBahanB3Id: dataBahanB3Id || undefined,
        AND: [
          startDate ? { createdAt: { gte: startDate } } : {},
          endDate ? { createdAt: { lte: endDate } } : {},
        ],
      },
      orderBy: { [sortBy]: sortOrder },
    };

    if (returnAll) {
      const data = await this.prisma.stokB3Periode.findMany({
        ...queryOptions,
        include: {
          company: true,
          dataBahanB3: true,
        },
      });
      return { total: data.length, data };
    }

    const total = await this.prisma.stokB3Periode.count({
      where: queryOptions.where,
    });

    const data = await this.prisma.stokB3Periode.findMany({
      ...queryOptions,
      include: {
        company: true,
        dataBahanB3: true,
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    return { total, data };
  }
}
