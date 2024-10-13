import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../services/prisma.services';
import { CreateDataBahanB3Dto } from 'src/models/createDataBahanB3Dto';
import { CreateDataPejabatDto } from 'src/models/createDataPejabatDto';
import { CreateDataTembusanDto } from 'src/models/createDataTembusanDto';
import { SearchDataBahanB3Dto } from 'src/models/searchBahanB3Dto';
import { SearchDataPejabatDto } from 'src/models/searchDataPejabatDto';
import { SearchDataTembusanDto } from 'src/models/seatchDataTembusanDto';


@Injectable()
export class DataMasterService {
  constructor(private prisma: PrismaService) {}

  // ============================================
  // Data Bahan B3 Methods
  // ============================================
  async createDataBahanB3(data: CreateDataBahanB3Dto) {
    try {
      return await this.prisma.$transaction(async (prisma) => {

        return prisma.dataBahanB3.create({ data });
      });
    } catch (error) {
      // Log the error if necessary (e.g., for debugging purposes)
      console.error('Transaction failed:', error);

      // Return a generic 400 error without exposing raw error details
      throw new BadRequestException('Failed to create Data Bahan B3. Please try again.');
    }
  }

  async updateDataBahanB3(id: string, data: CreateDataBahanB3Dto) {
    try {
      return await this.prisma.$transaction(async (prisma) => {
        const existingBahan = await prisma.dataBahanB3.findUnique({
          where: { id },
        });

        if (!existingBahan) {
          throw new BadRequestException('Data Bahan B3 does not exist');
        }

        const bahanWithSameDetails = await prisma.dataBahanB3.findFirst({
          where: {
            casNumber: data.casNumber,
            namaDagang: data.namaDagang,
            NOT: { id },
          },
        });

        if (bahanWithSameDetails) {
          throw new BadRequestException('CAS Number and Nama Dagang combination already exists');
        }

        return prisma.dataBahanB3.update({
          where: { id },
          data,
        });
      });
    } catch (error) {
      console.error('Transaction failed:', error);
      throw new BadRequestException('Failed to update Data Bahan B3. Please try again.');
    }
  }

  async deleteDataBahanB3(id: string) {
    try {
      return await this.prisma.$transaction(async (prisma) => {
        const existingBahan = await prisma.dataBahanB3.findUnique({
          where: { id },
        });

        if (!existingBahan) {
          throw new BadRequestException('Data Bahan B3 does not exist');
        }

        return prisma.dataBahanB3.delete({
          where: { id },
        });
      });
    } catch (error) {
      console.error('Transaction failed:', error);
      throw new BadRequestException('Failed to delete Data Bahan B3. Please try again.');
    }
  }

  // ============================================
  // Data Pejabat Methods
  // ============================================
  async createDataPejabat(data: CreateDataPejabatDto) {
    try {
      return await this.prisma.$transaction(async (prisma) => {
        // Cari draftSurat berdasarkan applicationId
        const draftSurat = await prisma.draftSurat.findUnique({
          where: { applicationId: data.applicationId },
        });

        // Validasi jika draftSurat tidak ditemukan
        if (!draftSurat) {
          throw new BadRequestException('Draft Surat not found for the provided Application ID.');
        }

        // Buat Data Pejabat dengan data yang disediakan
        return prisma.dataPejabat.create({
          data: {
            nip: data.nip,
            nama: data.nama,
            jabatan: data.jabatan,
            status: data.status,
            // Hubungkan pejabat ke draftSurat
            DraftSurat: {
              connect: { id: draftSurat.id }
            }
          },
        });
      });
    } catch (error) {
      console.error('Transaction failed:', error);
      throw new BadRequestException('Failed to create Pejabat. Please try again.');
    }
  }

  async updateDataPejabat(id: string, data: CreateDataPejabatDto) {
    try {
      return await this.prisma.$transaction(async (prisma) => {
        const existingPejabat = await prisma.dataPejabat.findUnique({
          where: { id },
        });

        if (!existingPejabat) {
          throw new BadRequestException('Pejabat does not exist');
        }

        const pejabatWithSameNip = await prisma.dataPejabat.findFirst({
          where: {
            nip: data.nip,
            NOT: { id },
          },
        });

        if (pejabatWithSameNip) {
          throw new BadRequestException('Pejabat with NIP already exists');
        }

        return prisma.dataPejabat.update({
          where: { id },
          data,
        });
      });
    } catch (error) {
      console.error('Transaction failed:', error);
      throw new BadRequestException('Failed to update Pejabat. Please try again.');
    }
  }

  async deleteDataPejabat(id: string) {
    try {
      return await this.prisma.$transaction(async (prisma) => {
        const existingPejabat = await prisma.dataPejabat.findUnique({
          where: { id },
        });

        if (!existingPejabat) {
          throw new BadRequestException('Pejabat does not exist');
        }

        return prisma.dataPejabat.delete({
          where: { id },
        });
      });
    } catch (error) {
      console.error('Transaction failed:', error);
      throw new BadRequestException('Failed to delete Pejabat. Please try again.');
    }
  }

  // ============================================
  // Data Tembusan Methods
  // ============================================
  async createDataTembusan(data: CreateDataTembusanDto) {
    try {
      return await this.prisma.$transaction(async (prisma) => {
        // Cari DraftSurat berdasarkan applicationId
        const draftSurat = await prisma.draftSurat.findUnique({
          where: { applicationId: data.applicationId },
        });

        // Validasi jika draftSurat tidak ditemukan
        if (!draftSurat) {
          throw new BadRequestException('Draft Surat not found for the provided Application ID.');
        }
        
        const existingTembusan = await prisma.dataTembusan.findUnique({
          where: { nama: data.nama },
        });

        if (existingTembusan) {
          throw new BadRequestException('Tembusan with this name already exists');
        }

        // Buat Data Tembusan dan hubungkan dengan DraftSurat
        return prisma.dataTembusan.create({
          data: {
            nama: data.nama,
            tipe: data.tipe,
            DraftSurat: {
              connect: { id: draftSurat.id } // Hubungkan dengan draftSurat
            }
          },
        });
      });
    } catch (error) {
      console.error('Transaction failed:', error);
      throw new BadRequestException('Failed to create Tembusan. Please try again.');
    }
  }

  async updateDataTembusan(id: string, data: CreateDataTembusanDto) {
    try {
      return await this.prisma.$transaction(async (prisma) => {
        const existingTembusan = await prisma.dataTembusan.findUnique({
          where: { id },
        });

        if (!existingTembusan) {
          throw new BadRequestException('Tembusan does not exist');
        }

        const tembusanWithSameNama = await prisma.dataTembusan.findFirst({
          where: {
            nama: data.nama,
            NOT: { id },
          },
        });

        if (tembusanWithSameNama) {
          throw new BadRequestException('Tembusan with this name already exists');
        }

        return prisma.dataTembusan.update({
          where: { id },
          data,
        });
      });
    } catch (error) {
      console.error('Transaction failed:', error);
      throw new BadRequestException('Failed to update Tembusan. Please try again.');
    }
  }

  async deleteDataTembusan(id: string) {
    try {
      return await this.prisma.$transaction(async (prisma) => {
        const existingTembusan = await prisma.dataTembusan.findUnique({
          where: { id },
        });

        if (!existingTembusan) {
          throw new BadRequestException('Tembusan does not exist');
        }

        return prisma.dataTembusan.delete({
          where: { id },
        });
      });
    } catch (error) {
      console.error('Transaction failed:', error);
      throw new BadRequestException('Failed to delete Tembusan. Please try again.');
    }
  }

  async searchDataBahanB3(query: SearchDataBahanB3Dto) {
    const { page, limit, sortOrder, sortBy, casNumber, namaDagang, namaBahanKimia, tipeBahan } = query;

    const whereClause: any = {};  // Construct a dynamic filter

    // Filter by multiple CAS numbers (if provided)
    if (casNumber && casNumber.length > 0) {
      whereClause.casNumber = { in: casNumber };
    }

    // Filter by multiple trade names (if provided)
    if (namaDagang && namaDagang.length > 0) {
      whereClause.namaDagang = { in: namaDagang };
    }

    // Filter by single Nama Bahan Kimia (if provided)
    if (namaBahanKimia) {
      whereClause.namaBahanKimia = namaBahanKimia;
    }

    // Filter by multiple Tipe Bahan (if provided)
    if (tipeBahan && tipeBahan.length > 0) {
      whereClause.tipeBahan = { in: tipeBahan };
    }

    const data = await this.prisma.dataBahanB3.findMany({
      where: whereClause,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: {
        [sortBy]: sortOrder,
      },
    });

    const total = await this.prisma.dataBahanB3.count({ where: whereClause });

    return {
      data,
      page,
      limit,
      total,
    };
  }

  async getDataBahanB3ById(id: string) {
    const data = await this.prisma.dataBahanB3.findUnique({ where: { id } });
    if (!data) throw new NotFoundException(`Data Bahan B3 with ID ${id} not found.`);
    return data;
  }

  async searchDataPejabat(query: SearchDataPejabatDto) {
    const { page, limit, sortOrder, sortBy, nip, nama, jabatan, status } = query;

    const whereClause: any = {};  // Construct a dynamic filter

    // Filter by multiple NIP (if provided)
    if (nip && nip.length > 0) {
      whereClause.nip = { in: nip };
    }

    // Filter by multiple Nama Pejabat (if provided)
    if (nama && nama.length > 0) {
      whereClause.nama = { in: nama };
    }

    // Filter by multiple Jabatan (if provided)
    if (jabatan && jabatan.length > 0) {
      whereClause.jabatan = { in: jabatan };
    }

    // Filter by multiple Status (if provided)
    if (status && status.length > 0) {
      whereClause.status = { in: status };
    }

    const data = await this.prisma.dataPejabat.findMany({
      where: whereClause,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: {
        [sortBy]: sortOrder,
      },
    });

    const total = await this.prisma.dataPejabat.count({ where: whereClause });

    return {
      data,
      page,
      limit,
      total,
    };
  }

  async getDataPejabatById(id: string) {
    const data = await this.prisma.dataPejabat.findUnique({ where: { id } });
    if (!data) throw new NotFoundException(`Data Pejabat with ID ${id} not found.`);
    return data;
  }

  async searchDataTembusan(query: SearchDataTembusanDto) {
    const { page, limit, sortOrder, sortBy, nama, tipe } = query;

    const whereClause: any = {};  // Construct a dynamic filter

    // Filter by multiple Nama Tembusan (if provided)
    if (nama && nama.length > 0) {
      whereClause.nama = { in: nama };
    }

    // Filter by multiple Tipe Tembusan (if provided)
    if (tipe && tipe.length > 0) {
      whereClause.tipe = { in: tipe };
    }

    const data = await this.prisma.dataTembusan.findMany({
      where: whereClause,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: {
        [sortBy]: sortOrder,
      },
    });

    const total = await this.prisma.dataTembusan.count({ where: whereClause });

    return {
      data,
      page,
      limit,
      total,
    };
  }

  async getDataTembusanById(id: string) {
    const data = await this.prisma.dataTembusan.findUnique({ where: { id } });
    if (!data) throw new NotFoundException(`Data Tembusan with ID ${id} not found.`);
    return data;
  }
}
