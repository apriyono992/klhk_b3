import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from './prisma.services';
import { CreateBahanB3CompanyDto } from 'src/models/createBahanB3CompanyDto';
import { ApproveBahanB3RequestDto } from 'src/models/approveBahanB3RequestDto';
import { UpdateStokB3Dto } from 'src/models/updateStokB3Dto';
import { SearchBahanB3CompanyDto } from 'src/models/searchBahanB3CompanyDto';
import { PaginationDto } from 'src/models/paginationDto';
import { SearchStokB3PeriodeDto } from 'src/models/searchStokB3PeriodeDto';
import { SearchPendingRequestStokBahanB3Dto } from 'src/models/searchPendingRequestStokBahanB3Dto';


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
        companyId: dto.companyId,
        requestDate: new Date(),
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
        notes: dto.notes,
        requestDate: new Date(),
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
        const requestDate = new Date(createRequest.requestDate);

        // Mendapatkan bulan dan tahun
        const bulan = requestDate.getMonth() + 1; // getMonth() menghasilkan angka 0-11, tambahkan 1 untuk mendapatkan 1-12
        const tahun = requestDate.getFullYear();
        // 2. Log histori stok
        const stokPeriode = await tx.stokB3Periode.create({
          data: {
            companyId : createRequest.companyId,
            dataBahanB3Id: createRequest.dataBahanB3Id,
            stokB3: createRequest.requestedStokB3,
            bulan: bulan,
            tahun: tahun
          },
        });

        // 2. Log histori stok
        await tx.stokB3PeriodeHistory.create({
          data: {
            newStokB3: createRequest.requestedStokB3,
            previousStokB3: 0,
            stokB3PeriodeId: stokPeriode.id,
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
        return tx.stokB3AddRequest.update({
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

        // 2. Ambil data stok B3 yang ada
        const existingEntryPeriode = await tx.stokB3Periode.findFirst({
          where: { companyId: existingEntry.companyId, dataBahanB3Id: existingEntry.dataBahanB3Id, 
            bulan: updateRequest.requestDate.getMonth() + 1, tahun: updateRequest.requestDate.getFullYear() },
        });

        if (!existingEntry) throw new NotFoundException('DataBahanB3Company entry not found');

        // 3. Hitung stok baru
        const newStokB3 = existingEntry.stokB3 + updateRequest.requestedStokB3;
        // 3. Hitung stok baru
        const newStokB3Periode = existingEntryPeriode?.stokB3 ?? 0  + updateRequest.requestedStokB3;

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
            previousStokB3: existingEntry.stokB3 ?? 0,
            newStokB3: newStokB3,
          },
        });
        let stokPeriode;
        if (!existingEntryPeriode){
          const requestDate = new Date(createRequest.requestDate);

          // Mendapatkan bulan dan tahun
          const bulan = requestDate.getMonth() + 1; // getMonth() menghasilkan angka 0-11, tambahkan 1 untuk mendapatkan 1-12
          const tahun = requestDate.getFullYear();
          await tx.stokB3Periode.create({
            data: {
              companyId : existingEntry.companyId,
              dataBahanB3Id: existingEntry.dataBahanB3Id,
              stokB3: newStokB3Periode ?? 0,
              bulan: bulan,
              tahun: tahun
            },
          });
        }else{
          // 2. Log histori stok
        stokPeriode = await tx.stokB3Periode.update({
          where: { id: existingEntryPeriode.id },
          data: {
            stokB3: newStokB3Periode ?? 0,
          },
        });
        }
        
        

        // 2. Log histori stok
        await tx.stokB3PeriodeHistory.create({
          data: {
            newStokB3: newStokB3Periode ?? 0,
            previousStokB3: existingEntryPeriode.stokB3 ?? 0,
            stokB3PeriodeId: stokPeriode.id,
            changeDate: new Date(),
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
        updateRequests: true,
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
      companyIds,
      stokB3Min,
      stokB3Max,
      tipePerusahaan,
      includeAll = true,
    } = dto;
  
    const skip = (page - 1) * limit;
  
    // Build the Prisma query filters
    const filters: any = {
      dataBahanB3: jenisBahanB3 ? { jenis: jenisBahanB3 } : undefined,
      companyId: (companyIds && companyIds.length > 0 && { id: { in: companyIds } }),
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
    const { companyId, dataBahanB3Id, startDate, endDate, sortOrder, sortBy, returnAll = true, limit = 10, page=1 } = filter;

  // Konversi startDate dan endDate ke objek Date
  const startDates = new Date(startDate);
  const endDates = new Date(endDate);

  // Mendapatkan bulan dan tahun untuk startDate
  const bulanStart = startDates.getMonth() + 1; // getMonth() menghasilkan angka 0-11
  const tahunStart = startDates.getFullYear();

  // Mendapatkan bulan dan tahun untuk endDate
  const bulanEnd = endDates.getMonth() + 1; // getMonth() menghasilkan angka 0-11
  const tahunEnd = endDates.getFullYear();

  const queryOptions = {
    where: {
      companyId: {
        in: companyId || undefined, // Gunakan 'in' untuk mencocokkan array
      },
      dataBahanB3Id: dataBahanB3Id || undefined,
      AND: [
        {
          OR: [
            // Jika startDate dan endDate berada dalam tahun yang sama
            {
              tahun: tahunStart,
              bulan: { gte: bulanStart, lte: bulanEnd },
            },
            // Jika rentang mencakup tahun yang berbeda
            {
              tahun: { gte: tahunStart, lte: tahunEnd },
              OR: [
                { tahun: tahunStart, bulan: { gte: bulanStart } }, // Awal rentang
                { tahun: tahunEnd, bulan: { lte: bulanEnd } },     // Akhir rentang
              ],
            },
          ],
        },
      ],
    },
    orderBy: { [sortBy]: sortOrder || 'asc' },
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

  async searchPendingRequests(filterDto: SearchPendingRequestStokBahanB3Dto) {
    const { companyIds, statusApproval, dataBahanB3Ids, page, limit, sortBy, sortOrder, returnAll = true } = filterDto;
  
    // Query for addRequests
    const addRequests = await this.prisma.stokB3AddRequest.findMany({
      where: {
        ...(companyIds ? { companyId: { in: companyIds } } : {}),
        ...(statusApproval !== undefined ? { approved: statusApproval } : {}),
        ...(dataBahanB3Ids ? { dataBahanB3Id: { in: dataBahanB3Ids } } : {}),
      },
      include: {
        dataBahanB3: true,
        company: true,
      },
      ...(returnAll
        ? {}
        : { skip: (page - 1) * limit, take: limit, orderBy: { [sortBy]: sortOrder.toLowerCase() } }),
    });
  
    // Query for updateRequests
    const updateRequests = await this.prisma.stokB3UpdateRequest.findMany({
      where: {
        ...(companyIds ? { dataBahanB3Company: { companyId: { in: companyIds } } } : {}),
        ...(statusApproval !== undefined ? { approved: statusApproval } : {}),
        ...(dataBahanB3Ids ? { dataBahanB3Company: { dataBahanB3Id: { in: dataBahanB3Ids } } } : {}),
      },
      include: {
        dataBahanB3Company: {
          include: {
            company: true,
            dataBahanB3: true,
          },
        },
      },
      ...(returnAll
        ? {}
        : { skip: (page - 1) * limit, take: limit, orderBy: { [sortBy]: sortOrder.toLowerCase() } }),
    });
  
    // Combine and add flag
    const combinedRequests = [
      ...addRequests.map((request) => ({
        ...request,
        requestDate: request.requestDate,
        type: 'create', // Add flag for create
      })),
      ...updateRequests.map((request) => ({
        id: request.id,
        dataBahanB3Id: request.dataBahanB3Company.dataBahanB3Id,
        requestedStokB3: request.requestedStokB3,
        companyId: request.dataBahanB3Company.companyId,
        approved: request.approved,
        dataBahanB3: request.dataBahanB3Company.dataBahanB3,
        company: request.dataBahanB3Company.company,
        requestDate:request.requestDate,
        type: 'update', // Add flag for update
      })),
    ];
  
    return combinedRequests;
  }
  
}
