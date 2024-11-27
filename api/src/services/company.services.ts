import { Injectable, ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from './prisma.services';
import { CreateCompanyDto } from '../models/createCompanyDto';
import { UpdateCompanyDto } from '../models/updateCompanyDto';
import { Prisma } from '@prisma/client';
import { SearchCompanyDto } from 'src/models/searchCompanyDto';
import { CreateDataSupplierDto } from 'src/models/createDataSupplierDto';
import { CreateDataCustomerDto } from 'src/models/createDataCustomerDto';
import { UpdateDataCustomerDto } from 'src/models/updateDataCustomerDto';
import { UpdateDataSupplierDto } from 'src/models/updateDataSupplierDto';
import { CreateDataTransporterDto } from 'src/models/createDataTransporterDto';
import { UpdateDataTransporterDto } from 'src/models/updateDataTransporterDto';
import { CreatePerusahaanAsalMuatDanTujuanDto } from 'src/models/createPerusahaanAsalDanTujuanB3Dto';
import { UpdatePerusahaanAsalMuatDanTujuanDto } from 'src/models/updatePerusahaanAsalDanTujuanB3Dto';
import { SearchDataSupplierDto } from 'src/models/searchDataSupplierDto';
import { SearchDataCustomerDto } from 'src/models/searchDataCustomerDto';
import { SearchDataTransporterDto } from 'src/models/searchDataTransporterDto';
import { SearchPerusahaanAsalMuatDto } from 'src/models/searchPerusahaanAsalMuatDto';
import { SearchPerusahaanTujuanBongkarDto } from 'src/models/searchPerusahaanTujuanBongkarDto';
import { UpdateDataPICDto } from 'src/models/updateDataPICDto';
import { CreateDataPICDto } from 'src/models/createDataPICDto';
import { SearchDataPICDto } from 'src/models/searchDataPICDto';

@Injectable()
export class CompanyService {
  constructor(private readonly prisma: PrismaService) {}

  // Create a new company
  async createCompany(createCompanyDto: CreateCompanyDto) {
    try {
      return await this.prisma.company.create({
        data: {
          ...createCompanyDto,
          alamatPool: createCompanyDto.alamatPool || [], // Handle alamatPool as an array
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        // Handle unique constraint violation
        throw new ConflictException('Unique constraint failed on one of the fields (name, NPWP, kodeDBKlh, nomorInduk)');
      }
      throw error;
    }
  }

  // Get a single company by ID
  async getCompany(id: string) {
    const company = await this.prisma.company.findUnique({
      where: { id },
      include: {
        applications: true, // Include related applications
        registrasi: true, // Include related registrasiB3
        vehicles: true, // Include related vehicles
        notifikasi: true, // Include related notifikasi
        PenyimpananB3: true, // Include related PenyimpananB3
        IdentitasApplication: true, // Include related IdentitasApplication
        PelaporanPengangkutan: true, // Include related PelaporanPengangkutan
        DataBahanB3Company:true,
        DataCustomer:true,
        DataSupplier:true,
        PerusahaanAsalMuat:true,
        PerusahaanTujuanBongkar:true
      }
    });

    if (!company) {
      throw new NotFoundException(`Company with ID ${id} not found`);
    }

    return company;
  }

  async getCompanies(searchDto: SearchCompanyDto) {
    const {
      page = 1,
      limit = 10,
      name,
      npwp,
      bidangUsaha,
      kodeDBKlhk,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      companyIds,
      returnAll = false,
      tipePerusahaan,
    } = searchDto;
  
    // Build the search conditions dynamically
    const where: Prisma.CompanyWhereInput = {
      ...(name && { name: { contains: name, mode: 'insensitive' } }),
      ...(npwp && { npwp: { contains: npwp, mode: 'insensitive' } }),
      ...(bidangUsaha && { bidangUsaha: { contains: bidangUsaha, mode: 'insensitive' } }),
      ...(kodeDBKlhk && { kodeDBKlhk: { contains: kodeDBKlhk, mode: 'insensitive' } }),
      ...(companyIds && companyIds.length > 0 && { id: { in: companyIds } }),
      ...(tipePerusahaan && tipePerusahaan.length > 0 && { tipePerusahaan: { hasSome: tipePerusahaan } }),
    };
  
    // Handle the returnAll flag
    if (returnAll) {
      const companies = await this.prisma.company.findMany({
        where,
        orderBy: { [sortBy]: sortOrder },
      });
      return {
        total: companies.length,
        page: 1,
        limit: companies.length,
        data: companies,
      };
    }
  
    // Pagination logic
    const skip = (page - 1) * limit;
  
    // Query companies with pagination and sorting
    const companies = await this.prisma.company.findMany({
      where,
      skip,
      take: limit,
      orderBy: { [sortBy]: sortOrder },
    });
  
    // Count the total number of companies matching the conditions
    const total = await this.prisma.company.count({
      where,
    });
  
    return {
      total,
      page,
      limit,
      data: companies,
    };
  }
  

  // Update an existing company by ID
  async updateCompany(id: string, updateCompanyDto: UpdateCompanyDto) {
    try {
      // Check if the company exists
      const company = await this.prisma.company.findUnique({
        where: { id },
      });

      if (!company) {
        throw new NotFoundException(`Company with ID ${id} not found`);
      }

      // Update the company with new data, handling alamatPool (preserve if not updated)
      return this.prisma.company.update({
        where: { id },
        data: {
          ...updateCompanyDto,
          alamatPool: updateCompanyDto.alamatPool || undefined, // Handle alamatPool update
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        // Handle unique constraint violation
        throw new ConflictException('Unique constraint failed on one of the fields (name, NPWP, kodeDBKlh, nomorInduk)');
      }
      throw error;
    }
  }

  // Delete a company by ID
  async deleteCompany(id: string) {
    // Check if the company exists
    const company = await this.prisma.company.findUnique({
      where: { id },
    });

    if (!company) {
      throw new NotFoundException(`Company with ID ${id} not found`);
    }

    // Delete the company
    return this.prisma.company.delete({
      where: { id },
    });
  }

  // Method untuk menambahkan data supplier ke company
  async addDataSupplier(companyId: string, data: CreateDataSupplierDto) {
    // Cek apakah company dengan ID yang diberikan ada
    const company = await this.prisma.company.findUnique({ where: { id: companyId } });
    if (!company) throw new NotFoundException('Company not found.');

    // Validasi input, misalnya cek apakah namaSupplier sudah digunakan oleh perusahaan yang sama
    const existingSupplier = await this.prisma.dataSupplier.findFirst({
      where: {
        companyId,
        namaSupplier: {
          contains: data.namaSupplier.trim(),
          mode: 'insensitive',
        },
      },
    });

    if (existingSupplier) {
      throw new BadRequestException('Supplier with the same name already exists for this company.');
    }

    // Membuat data supplier baru
    // Membuat data supplier baru bersama dengan data PIC
    return this.prisma.dataSupplier.create({
      data: {
        companyId,
        namaSupplier: data.namaSupplier,
        alamat: data.alamat,
        email: data.email,
        telepon: data.telepon,
        fax: data.fax,
        longitude: data.longitude,
        latitude: data.latitude,
        provinceId: data.provinceId,
        regencyId: data.regencyId,
        districtId: data.districtId,
        villageId: data.villageId,
        DataPic: {
          connect: data.dataPICIds?.map((picId) => ({ id: picId })) || [],
        },
      },
    });
  }

  // Method untuk menambahkan data customer dengan data PIC
  async addDataCustomer(companyId: string, data: CreateDataCustomerDto) {
    // Validasi companyId
    const company = await this.prisma.company.findUnique({ where: { id: companyId } });
    if (!company) throw new NotFoundException('Company not found.');

    // Cek duplikasi namaCustomer secara case-insensitive
    const existingCustomer = await this.prisma.dataCustomer.findFirst({
      where: {
        companyId,
        namaCustomer: {
          contains: data.namaCustomer.trim(),
          mode: 'insensitive',
        },
      },
    });

    if (existingCustomer) {
      throw new BadRequestException('Customer with the same name already exists for this company.');
    }

    // Membuat data customer baru bersama dengan data PIC
    return this.prisma.dataCustomer.create({
      data: {
        companyId,
        namaCustomer: data.namaCustomer,
        alamat: data.alamat,
        email: data.email,
        telepon: data.telepon,
        fax: data.fax,
        longitude: data.longitude,
        latitude: data.latitude,
        provinceId: data.provinceId,
        regencyId: data.regencyId,
        districtId: data.districtId,
        villageId: data.villageId,
        DataPic: {
          connect: data.dataPICIds?.map((picId) => ({ id: picId })) || [],
        },
      },
    });
  }

  async updateDataSupplier(supplierId: string, data: UpdateDataSupplierDto) {
    // Validate the existence of the supplier
    const existingSupplier = await this.prisma.dataSupplier.findUnique({ where: { id: supplierId } });
    if (!existingSupplier) throw new NotFoundException('Supplier not found.');
  
    // Check for duplicate `namaSupplier` (case-insensitive)
    if (data.namaSupplier && data.namaSupplier.trim().toLowerCase() !== existingSupplier.namaSupplier.toLowerCase()) {
      const duplicateSupplier = await this.prisma.dataSupplier.findFirst({
        where: {
          companyId: existingSupplier.companyId,
          namaSupplier: {
            contains: data.namaSupplier.trim(),
            mode: 'insensitive',
          },
        },
      });
  
      if (duplicateSupplier) {
        throw new BadRequestException('Supplier with the same name already exists.');
      }
    }
  
    // Update the main supplier data
    const updatedSupplier = await this.prisma.dataSupplier.update({
      where: { id: supplierId },
      data: {
        namaSupplier: data.namaSupplier,
        alamat: data.alamat,
        email: data.email,
        telepon: data.telepon,
        fax: data.fax,
        longitude: data.longitude,
        latitude: data.latitude,
        provinceId: data.provinceId,
        regencyId: data.regencyId,
        districtId: data.districtId,
        villageId: data.villageId,
      },
    });
  
    // Handle DataPIC updates if provided
    if (data.dataPICs) {
      for (const pic of data.dataPICs) {
        if (pic.id) {
          // Update existing PIC
          await this.prisma.dataPIC.update({
            where: { id: pic.id },
            data: pic,
          });
        } else {
          // Create new PIC
          await this.prisma.dataPIC.create({
            data: {
              ...pic,
              companyId: existingSupplier.companyId,
              DataSupplier: { connect: { id: supplierId } },
            },
          });
        }
      }
    }
  
    return updatedSupplier;
  }
  
  async updateDataCustomer(customerId: string, data: UpdateDataCustomerDto) {
    // Validate the existence of the customer
    const existingCustomer = await this.prisma.dataCustomer.findUnique({ where: { id: customerId } });
    if (!existingCustomer) throw new NotFoundException('Customer not found.');
  
    // Check for duplicate `namaCustomer` (case-insensitive)
    if (data.namaCustomer && data.namaCustomer.trim().toLowerCase() !== existingCustomer.namaCustomer.toLowerCase()) {
      const duplicateCustomer = await this.prisma.dataCustomer.findFirst({
        where: {
          companyId: existingCustomer.companyId,
          namaCustomer: {
            contains: data.namaCustomer.trim(),
            mode: 'insensitive',
          },
        },
      });
  
      if (duplicateCustomer) {
        throw new BadRequestException('Customer with the same name already exists.');
      }
    }
  
    // Update the main customer data
    const updatedCustomer = await this.prisma.dataCustomer.update({
      where: { id: customerId },
      data: {
        namaCustomer: data.namaCustomer,
        alamat: data.alamat,
        email: data.email,
        telepon: data.telepon,
        fax: data.fax,
        longitude: data.longitude,
        latitude: data.latitude,
        provinceId: data.provinceId,
        regencyId: data.regencyId,
        districtId: data.districtId,
        villageId: data.villageId,
      },
    });
  
    // Handle DataPIC updates if provided
    if (data.dataPICs) {
      for (const pic of data.dataPICs) {
        if (pic.id) {
          // Update existing PIC
          await this.prisma.dataPIC.update({
            where: { id: pic.id },
            data: pic,
          });
        } else {
          // Create new PIC
          await this.prisma.dataPIC.create({
            data: {
              ...pic,
              companyId: existingCustomer.companyId,
              DataCustomer: { connect: { id: customerId } },
            },
          });
        }
      }
    }
  
    return updatedCustomer;
  }
  // Create a new DataPIC
  async createDataPIC(createDataPICDto: CreateDataPICDto) {
    return this.prisma.dataPIC.create({
      data: {
        companyId: createDataPICDto.companyId,
        namaPIC: createDataPICDto.namaPIC,
        jabatan: createDataPICDto.jabatan,
        email: createDataPICDto.email,
        fax: createDataPICDto.fax,
        telepon: createDataPICDto.telepon,
        type: createDataPICDto.type,
      },
    });
  }

  async listAllDataPIC(dto: SearchDataPICDto) {
    const { type, companyIds, page, limit, sortBy, sortOrder, returnAll } = dto;
  
    // Base query with dynamic filters
    const whereCondition: Prisma.DataPICWhereInput = {
      ...(type && { type }),
      ...(companyIds && companyIds.length > 0 && { companyId: { in: companyIds } }),
    };
    // Determine sorting
    const orderBy = {};
    if (sortBy) {
      orderBy[sortBy] = sortOrder?.toLocaleLowerCase() || 'desc';
    }
  
    // Pagination logic
    const take = returnAll ? undefined : limit;
    const skip = returnAll ? undefined : (page - 1) * limit;
  
    // Query Prisma
    return this.prisma.dataPIC.findMany({
      where: whereCondition,
      include: {
        DataCustomer: true,
        DataSupplier: true,
        DataTransporter: true,
      },
      orderBy,
      take,
      skip,
    });
  }
  

  // Get a single DataPIC by ID
  async getPicByid(id: string) {
    const dataPIC = await this.prisma.dataPIC.findUnique({
      where: { id },
      include: {
        DataCustomer: true,
        DataSupplier: true,
        DataTransporter: true,
      },
    });

    if (!dataPIC) {
      throw new NotFoundException(`DataPIC with ID ${id} not found`);
    }

    return dataPIC;
  }

  // Update a DataPIC
  async updateDataPIC(id: string, updateDataPICDto: UpdateDataPICDto) {
    const dataPIC = await this.prisma.dataPIC.findUnique({
      where: { id },
    });

    if (!dataPIC) {
      throw new NotFoundException(`DataPIC with ID ${id} not found`);
    }

    await this.prisma.dataPIC.update({
      where: { id },
      data: updateDataPICDto,
    });

  }
  
  // Menghapus satu entri DataPIC berdasarkan picId
  async deleteDataPIC(picId: string) {
  // Cek apakah DataPIC dengan ID yang diberikan ada
  const existingPIC = await this.prisma.dataPIC.findUnique({ where: { id: picId } });
  if (!existingPIC) throw new NotFoundException('DataPIC not found.');

  // Hapus DataPIC
  return this.prisma.dataPIC.delete({
    where: { id: picId },
  });
}

  // Menghapus semua DataPIC terkait dengan DataSupplier berdasarkan supplierId
  async deleteAllDataPICForSupplier(supplierId: string) {
    // Cek apakah DataSupplier dengan ID yang diberikan ada
    const existingSupplier = await this.prisma.dataSupplier.findUnique({ where: { id: supplierId } });
    if (!existingSupplier) throw new NotFoundException('Supplier not found.');

    // Hapus semua DataPIC terkait dengan DataSupplier ini
    return this.prisma.dataPIC.deleteMany({
      where: {
        DataSupplier: {
          some: {
            id: supplierId,
          },
        },
      },
    });
  }

  // Menghapus semua DataPIC terkait dengan DataCustomer berdasarkan customerId
  async deleteAllDataPICForCustomer(customerId: string) {
    // Cek apakah DataCustomer dengan ID yang diberikan ada
    const existingCustomer = await this.prisma.dataCustomer.findUnique({ where: { id: customerId } });
    if (!existingCustomer) throw new NotFoundException('Customer not found.');

    // Hapus semua DataPIC terkait dengan DataCustomer ini
    return this.prisma.dataPIC.deleteMany({
      where: {
        DataCustomer: {
          some: {
            id: customerId,
          },
        },
      },
    });
  }

   // Menghapus satu DataSupplier beserta data PIC terkait
   async deleteDataSupplier(supplierId: string) {
    // Cek apakah DataSupplier dengan ID yang diberikan ada
    const existingSupplier = await this.prisma.dataSupplier.findUnique({ where: { id: supplierId } });
    if (!existingSupplier) throw new NotFoundException('Supplier not found.');

    // Hapus semua DataPIC terkait dengan DataSupplier ini
    await this.prisma.dataPIC.deleteMany({
      where: {
        DataSupplier: {
          some: {
            id: supplierId,
          },
        },
      },
    });

    // Hapus DataSupplier
    return this.prisma.dataSupplier.delete({
      where: { id: supplierId },
    });
  }

  // Menghapus satu DataCustomer beserta data PIC terkait
  async deleteDataCustomer(customerId: string) {
    // Cek apakah DataCustomer dengan ID yang diberikan ada
    const existingCustomer = await this.prisma.dataCustomer.findUnique({ where: { id: customerId } });
    if (!existingCustomer) throw new NotFoundException('Customer not found.');

    // Hapus semua DataPIC terkait dengan DataCustomer ini
    await this.prisma.dataPIC.deleteMany({
      where: {
        DataCustomer: {
          some: {
            id: customerId,
          },
        },
      },
    });

    // Hapus DataCustomer
    return this.prisma.dataCustomer.delete({
      where: { id: customerId },
    });
  }

  // Method untuk mengambil daftar DataSupplier dalam satu company
  async listDataSuppliers(companyId: string) {
    // Cek apakah company dengan ID yang diberikan ada
    const company = await this.prisma.company.findUnique({ where: { id: companyId } });
    if (!company) throw new NotFoundException('Company not found.');

    // Mengambil daftar DataSupplier
    return this.prisma.dataSupplier.findMany({
      where: { companyId },
      include: {
        DataPic: true, // Mengambil juga data PIC yang terkait
      },
    });
  }

  // Method untuk mengambil daftar DataCustomer dalam satu company
  async listDataCustomers(companyId: string) {
    // Cek apakah company dengan ID yang diberikan ada
    const company = await this.prisma.company.findUnique({ where: { id: companyId } });
    if (!company) throw new NotFoundException('Company not found.');

    // Mengambil daftar DataCustomer
    return this.prisma.dataCustomer.findMany({
      where: { companyId },
      include: {
        DataPic: true, // Mengambil juga data PIC yang terkait
      },
    });
  }

  async createTransporter(data: CreateDataTransporterDto) {
    const {
      companyId,
      namaTransporter,
      alamat,
      email,
      telepon,
      fax,
      longitude,
      latitude,
      provinceId,
      regencyId,
      districtId,
      villageId,
      dataPICIds,
    } = data;
  
    const trimmedNamaCustomer = namaTransporter.trim();
  
    // Validasi perusahaan
    const company = await this.prisma.company.findUnique({ where: { id: companyId } });
    if (!company) throw new NotFoundException('Perusahaan tidak ditemukan.');
  
    // Validasi nama customer case-insensitive
    const existingCustomer = await this.prisma.dataTransporter.findFirst({
      where: {
        companyId,
        namaTransPorter: {
          equals: trimmedNamaCustomer,
          mode: 'insensitive',
        },
      },
    });
    if (existingCustomer) {
      throw new BadRequestException('Nama customer sudah ada, harap gunakan nama yang berbeda.');
    }
  
    // Validasi DataPICId[]
    for (const picId of dataPICIds) {
      const pic = await this.prisma.dataPIC.findUnique({ where: { id: picId } });
      if (!pic) {
        throw new NotFoundException(`Data PIC dengan ID ${picId} tidak ditemukan.`);
      }
    }
  
    // Membuat data transporter baru
    const transporter = await this.prisma.dataTransporter.create({
      data: {
        namaTransPorter: trimmedNamaCustomer,
        alamat,
        email,
        telepon,
        fax,
        longitude,
        latitude,
        companyId,
        provinceId,
        regencyId,
        districtId,
        villageId,
        DataPic: {
          connect: dataPICIds.map((id) => ({ id })),
        },
      },
    });
  
    return transporter;
  }

  async updateTransporter(id: string, data: UpdateDataTransporterDto) {
    const { namaCustomer, dataPICIds } = data;
  
    const existingTransporter = await this.prisma.dataTransporter.findUnique({ where: { id } });
    if (!existingTransporter) throw new NotFoundException('Data transporter tidak ditemukan.');
  
    const trimmedNamaCustomer = namaCustomer?.trim();
  
    // Validasi nama customer case-insensitive jika diberikan
    if (trimmedNamaCustomer) {
      const duplicateCustomer = await this.prisma.dataTransporter.findFirst({
        where: {
          companyId: existingTransporter.companyId,
          namaTransPorter: {
            equals: trimmedNamaCustomer,
            mode: 'insensitive',
          },
          id: { not: id },
        },
      });
      if (duplicateCustomer) {
        throw new BadRequestException('Nama customer sudah ada, harap gunakan nama yang berbeda.');
      }
    }
  
    // Validasi DataPICId[] jika diberikan
    if (dataPICIds && dataPICIds.length > 0) {
      for (const picId of dataPICIds) {
        const pic = await this.prisma.dataPIC.findUnique({ where: { id: picId } });
        if (!pic) {
          throw new NotFoundException(`Data PIC dengan ID ${picId} tidak ditemukan.`);
        }
      }
    }
  
    // Mengupdate data transporter
    const updatedTransporter = await this.prisma.dataTransporter.update({
      where: { id },
      data: {
        namaTransPorter: trimmedNamaCustomer ?? undefined,
        alamat: data.alamat ?? undefined,
        email: data.email ?? undefined,
        telepon: data.telepon ?? undefined,
        fax: data.fax ?? undefined,
        longitude: data.longitude ?? undefined,
        latitude: data.latitude ?? undefined,
        provinceId: data.provinceId ?? undefined,
        regencyId: data.regencyId ?? undefined,
        districtId: data.districtId ?? undefined,
        villageId: data.villageId ?? undefined,
        DataPic: {
          set: dataPICIds?.map((id) => ({ id })) ?? [],
        },
      },
    });
  
    return updatedTransporter;
  }
  
  async deleteTransporter(id: string) {
    // Validasi apakah data transporter ada
    const existingTransporter = await this.prisma.dataTransporter.findUnique({
      where: { id },
      include: { DataPic: true },
    });
  
    if (!existingTransporter) {
      throw new NotFoundException('Data transporter tidak ditemukan.');
    }
  
    // Hapus relasi dengan DataPIC
    if (existingTransporter.DataPic.length > 0) {
      await this.prisma.dataTransporter.update({
        where: { id },
        data: {
          DataPic: {
            disconnect: existingTransporter.DataPic.map((pic) => ({ id: pic.id })),
          },
        },
      });
    }
  
    // Hapus data transporter
    await this.prisma.dataTransporter.delete({ where: { id } });
  
    return { message: 'Data transporter berhasil dihapus.' };
  }

  // Add a new PerusahaanAsalMuat to an existing PengangkutanDetail
  async addPerusahaanAsalMuat(data: CreatePerusahaanAsalMuatDanTujuanDto) {
  const namaPerusahaan = data.namaPerusahaan.trim();
  const detail = await this.prisma.perusahaanAsalMuat.findFirst({ where: { namaPerusahaan: {equals: namaPerusahaan , mode: 'insensitive'}, companyId: data.companyId} });
  if (detail) throw new NotFoundException('Perusahaan Asal Muat Sudah Ada.');

  return this.prisma.perusahaanAsalMuat.create({
    data:{
      company: { connect: {id: data.companyId }},
      alamat: data.alamat,
      latitude: data.latitude,
      longitude: data.longitude,
      locationType: data.locationType,
      namaPerusahaan: data.namaPerusahaan,
      province: {connect: {id: data.provinceId}},
      regency: {connect: {id: data.regencyId}},
      district: {connect: {id: data.districtId}},
      village: {connect: {id: data.villageId}}
    }
  });
  }

  // Add a new PerusahaanTujuanBongkar to an existing PengangkutanDetail
  async addPerusahaanTujuanBongkar(data: CreatePerusahaanAsalMuatDanTujuanDto) {
    const namaPerusahaan = data.namaPerusahaan.trim();
    const detail = await this.prisma.perusahaanTujuanBongkar.findFirst({ where: { namaPerusahaan: {equals: namaPerusahaan , mode: 'insensitive'}, companyId: data.companyId} });
    if (detail) throw new NotFoundException('Perusahaan Tujuan Bongkar Sudah Ada');

    return this.prisma.perusahaanTujuanBongkar.create({
      data:{
        company: { connect: {id: data.companyId }},
        alamat: data.alamat,
        latitude: data.latitude,
        longitude: data.longitude,
        namaPerusahaan: data.namaPerusahaan,
        locationType: data.locationType ?? "KANTOR",
        province: {connect: {id: data.provinceId}},
        regency: {connect: {id: data.regencyId}},
        district: {connect: {id: data.districtId}},
        village: {connect: {id: data.villageId}}
      }
    });
  }

  // Update an existing PerusahaanAsalMuat entry with conditional updates
  async updatePerusahaanAsalMuat(id: string, data: UpdatePerusahaanAsalMuatDanTujuanDto) {
      // Check if the PerusahaanAsalMuat record exists
      const asalMuat = await this.prisma.perusahaanAsalMuat.findUnique({ where: { id } });
      if (!asalMuat) throw new NotFoundException('Loading company not found.');

      // Prepare the update data object conditionally based on provided fields
      const updateData: any = {};
      if (data.companyId !== undefined) updateData.companyId = data.companyId;
      if (data.namaPerusahaan !== undefined) updateData.namaPerusahaan = data.namaPerusahaan;
      if (data.alamat !== undefined) updateData.alamat = data.alamat;
      if (data.latitude !== undefined) updateData.latitude = data.latitude;
      if (data.longitude !== undefined) updateData.longitude = data.longitude;
      if (data.locationType !== undefined) updateData.locationType = data.locationType;
      if (data.provinceId !== undefined) updateData.provinceId = data.provinceId;
      if (data.regencyId !== undefined) updateData.regencyId = data.regencyId;
      if (data.districtId !== undefined) updateData.districtId = data.districtId;
      if (data.villageId !== undefined) updateData.villageId = data.villageId;

      // Perform the update with the constructed updateData object
      return this.prisma.perusahaanAsalMuat.update({
          where: { id },
          data: updateData,
      });
  }

  // Update an existing PerusahaanTujuanBongkar entry with conditional updates
  async updatePerusahaanTujuanBongkar(id: string, data: UpdatePerusahaanAsalMuatDanTujuanDto) {
      // Check if the PerusahaanTujuanBongkar record exists
      const tujuanBongkar = await this.prisma.perusahaanTujuanBongkar.findUnique({ where: { id } });
      if (!tujuanBongkar) throw new NotFoundException('Unloading company not found.');

      // Prepare the update data object conditionally based on provided fields
      const updateData: any = {};
      if (data.companyId !== undefined) updateData.companyId = data.companyId;
      if (data.namaPerusahaan !== undefined) updateData.namaPerusahaan = data.namaPerusahaan;
      if (data.alamat !== undefined) updateData.alamat = data.alamat;
      if (data.latitude !== undefined) updateData.latitude = data.latitude;
      if (data.longitude !== undefined) updateData.longitude = data.longitude;
      if (data.locationType !== undefined) updateData.locationType = data.locationType;
      if (data.provinceId !== undefined) updateData.provinceId = data.provinceId;
      if (data.regencyId !== undefined) updateData.regencyId = data.regencyId;
      if (data.districtId !== undefined) updateData.districtId = data.districtId;
      if (data.villageId !== undefined) updateData.villageId = data.villageId;

      // Perform the update with the constructed updateData object
      return this.prisma.perusahaanTujuanBongkar.update({
          where: { id },
          data: updateData,
      });
  }

  // Delete a PerusahaanAsalMuat entry
  async deletePerusahaanAsalMuat(id: string) {
    const asalMuat = await this.prisma.perusahaanAsalMuat.findUnique({ where: { id } });
    if (!asalMuat) throw new NotFoundException('Loading company not found.');

    return this.prisma.perusahaanAsalMuat.delete({ where: { id } });
  }

  // Delete a PerusahaanTujuanBongkar entry
  async deletePerusahaanTujuanBongkar(id: string) {
    const tujuanBongkar = await this.prisma.perusahaanTujuanBongkar.findUnique({ where: { id } });
    if (!tujuanBongkar) throw new NotFoundException('Unloading company not found.');

    return this.prisma.perusahaanTujuanBongkar.delete({ where: { id } });
  }

  async searchSuppliers(dto: SearchDataSupplierDto) {
    const {
      companyId,
      namaSupplier,
      provinceId,
      regencyId,
      districtId,
      villageId,
      longitude,
      latitude,
      reportId,
      returnAll = false,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
    } = dto;
  
    const whereConditions: any = {
      ...(companyId && { companyId }),
      ...(namaSupplier && {
        namaSupplier: {
          contains: namaSupplier.trim(),
          mode: 'insensitive',
        },
      }),
      ...(provinceId && { provinceId }),
      ...(regencyId && { regencyId }),
      ...(districtId && { districtId }),
      ...(villageId && { villageId }),
      ...(longitude && { longitude }),
      ...(latitude && { latitude }),
    };
  
    // Filter berdasarkan pelaporan terkait
    if (reportId) {
      whereConditions.DataSupplierOnPelaporanPenggunaanB3 = {
        some: {
          pelaporanPenggunaanB3Id: reportId,
        },
      };
    }
  
    const suppliers = await this.prisma.dataSupplier.findMany({
      where: whereConditions,
      include: {
        province: true,
        regency: true,
        district: true,
        village: true,
        company: true,
        DataPic: true,
        DataSupplierOnPelaporanPenggunaanB3:{include:{
          pelaporanPenggunaanB3:true
        }}
      },
      orderBy: {
        [sortBy]: sortOrder.toLowerCase(),
      },
      ...(returnAll ? {} : { skip: (page - 1) * limit, take: limit }),
    });
  
    const totalRecords = returnAll
      ? suppliers.length
      : await this.prisma.dataSupplier.count({ where: whereConditions });
  
    return {
      data: suppliers,
      totalRecords,
      currentPage: returnAll ? 1 : page,
      totalPages: returnAll ? 1 : Math.ceil(totalRecords / limit),
    };
  }
  
  async getSupplierById(id: string) {
    const supplier = await this.prisma.dataSupplier.findUnique({
      where: { id },
      include: {
        company: true,
        province: true,
        regency: true,
        district: true,
        village: true,
        DataPic: true,
      },
    });
  
    if (!supplier) {
      throw new NotFoundException('Supplier tidak ditemukan.');
    }
  
    return supplier;
  }

  async searchCustomers(dto: SearchDataCustomerDto) {
    const {
      companyId,
      namaCustomer,
      provinceId,
      regencyId,
      districtId,
      villageId,
      longitude,
      latitude,
      reportId,
      returnAll = false,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
    } = dto;
  
    const whereConditions: any = {
      ...(companyId && { companyId }),
      ...(namaCustomer && {
        namaCustomer: {
          contains: namaCustomer.trim(),
          mode: 'insensitive',
        },
      }),
      ...(provinceId && { provinceId }),
      ...(regencyId && { regencyId }),
      ...(districtId && { districtId }),
      ...(villageId && { villageId }),
      ...(longitude && { longitude }),
      ...(latitude && { latitude }),
    };
  
    // Filter berdasarkan pelaporan terkait
    if (reportId) {
      whereConditions.DataCustomerOnPelaporanDistribusiBahanB3 = {
        some: {
          pelaporanBahanB3DistribusiId: reportId,
        },
      };
    }
  
    const customers = await this.prisma.dataCustomer.findMany({
      where: whereConditions,
      include: {
        company: true,
        province: true,
        regency: true,
        district: true,
        village: true,
        DataPic: true,
      },
      orderBy: {
        [sortBy]: sortOrder.toLowerCase(),
      },
      ...(returnAll ? {} : { skip: (page - 1) * limit, take: limit }),
    });
  
    const totalRecords = returnAll
      ? customers.length
      : await this.prisma.dataCustomer.count({ where: whereConditions });
  
    return {
      data: customers,
      totalRecords,
      currentPage: returnAll ? 1 : page,
      totalPages: returnAll ? 1 : Math.ceil(totalRecords / limit),
    };
  }

  async getCustomerById(id: string) {
    const customer = await this.prisma.dataCustomer.findUnique({
      where: { id },
      include: {
        company: true,
        province: true,
        regency: true,
        district: true,
        village: true,
        DataPic: true,
      },
    });
  
    if (!customer) {
      throw new NotFoundException('Customer tidak ditemukan.');
    }
  
    return customer;
  }
  
  async getTransporterById(id: string) {
    const transporter = await this.prisma.dataTransporter.findUnique({
      where: { id },
      include: {
        company: true,
        province: true,
        regency: true,
        district: true,
        village: true,
        DataPic: true,
      },
    });
  
    if (!transporter) {
      throw new NotFoundException('Transporter tidak ditemukan.');
    }
  
    return transporter;
  }

  async searchTransporters(dto: SearchDataTransporterDto) {
    const {
      companyId,
      namaTransPorter,
      provinceId,
      regencyId,
      districtId,
      villageId,
      longitude,
      latitude,
      reportId,
      returnAll = false,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
    } = dto;
  
    const whereConditions: any = {
      ...(companyId && { companyId }),
      ...(namaTransPorter && {
        namaTransPorter: {
          contains: namaTransPorter.trim(),
          mode: 'insensitive',
        },
      }),
      ...(provinceId && { provinceId }),
      ...(regencyId && { regencyId }),
      ...(districtId && { districtId }),
      ...(villageId && { villageId }),
      ...(longitude && { longitude }),
      ...(latitude && { latitude }),
    };
  
    // Filter berdasarkan pelaporan terkait
    if (reportId) {
      whereConditions.DataTransporterOnPelaporanDistribusiBahanB3 = {
        some: {
          pelaporanBahanB3DistribusiId: reportId,
        },
      };
    }
  
    const transporters = await this.prisma.dataTransporter.findMany({
      where: whereConditions,
      include: {
        company: true,
        province: true,
        regency: true,
        district: true,
        village: true,
        DataPic: true,
      },
      orderBy: {
        [sortBy]: sortOrder.toLowerCase(),
      },
      ...(returnAll ? {} : { skip: (page - 1) * limit, take: limit }),
    });
  
    const totalRecords = returnAll
      ? transporters.length
      : await this.prisma.dataTransporter.count({ where: whereConditions });
  
    return {
      data: transporters,
      totalRecords,
      currentPage: returnAll ? 1 : page,
      totalPages: returnAll ? 1 : Math.ceil(totalRecords / limit),
    };
  }
  
  async searchPerusahaanAsalMuat(dto: SearchPerusahaanAsalMuatDto) {
    const {
      companyId,
      namaPerusahaan,
      provinceId,
      regencyId,
      districtId,
      villageId,
      longitude,
      latitude,
      reportId,
      returnAll = false,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
    } = dto;
  
    const whereConditions: any = {
      ...(companyId && { companyId }),
      ...(namaPerusahaan && {
        namaPerusahaan: {
          contains: namaPerusahaan.trim(),
          mode: 'insensitive',
        },
      }),
      ...(provinceId && { provinceId }),
      ...(regencyId && { regencyId }),
      ...(districtId && { districtId }),
      ...(villageId && { villageId }),
      ...(longitude && { longitude }),
      ...(latitude && { latitude }),
    };
  
    // Filter berdasarkan pelaporan terkait
    if (reportId) {
      whereConditions.DataPerusahaanAsalMuatOnPengakutanDetail = {
        some: {
          pengakutanDetailId: reportId,
        },
      };
    }
  
    const results = await this.prisma.perusahaanAsalMuat.findMany({
      where: whereConditions,
      include: {
        company: true,
        province: true,
        regency: true,
        district: true,
        village: true,
      },
      orderBy: {
        [sortBy]: sortOrder.toLowerCase(),
      },
      ...(returnAll ? {} : { skip: (page - 1) * limit, take: limit }),
    });
  
    const totalRecords = returnAll
      ? results.length
      : await this.prisma.perusahaanAsalMuat.count({ where: whereConditions });
  
    return {
      data: results,
      totalRecords,
      currentPage: returnAll ? 1 : page,
      totalPages: returnAll ? 1 : Math.ceil(totalRecords / limit),
    };
  }
  
  async getPerusahaanAsalMuatById(id: string) {
    const perusahaan = await this.prisma.perusahaanAsalMuat.findUnique({
      where: { id },
      include: {
        company: true,
        province: true,
        regency: true,
        district: true,
        village: true,
        DataPerusahaanAsalMuatOnPengakutanDetail: {include:{
          pengangkutanDetail:{include:{
            b3Substance:{include:{
              dataBahanB3:true,
            }},
            pelaporanPengangkutan: true
          }}
        }}
      },
    });
  
    if (!perusahaan) {
      throw new NotFoundException('Perusahaan Asal Muat tidak ditemukan.');
    }
  
    return perusahaan;
  }

  async searchPerusahaanTujuanBongkar(dto: SearchPerusahaanTujuanBongkarDto) {
    const {
      companyId,
      namaPerusahaan,
      provinceId,
      regencyId,
      districtId,
      villageId,
      longitude,
      latitude,
      reportId,
      returnAll = false,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
    } = dto;
  
    const whereConditions: any = {
      ...(companyId && { companyId }),
      ...(namaPerusahaan && {
        namaPerusahaan: {
          contains: namaPerusahaan.trim(),
          mode: 'insensitive',
        },
      }),
      ...(provinceId && { provinceId }),
      ...(regencyId && { regencyId }),
      ...(districtId && { districtId }),
      ...(villageId && { villageId }),
      ...(longitude && { longitude }),
      ...(latitude && { latitude }),
    };
  
    // Filter berdasarkan pelaporan terkait
    if (reportId) {
      whereConditions.DataPerusahaanTujuanBongkarOnPengakutanDetail = {
        some: {
          pengakutanDetailId: reportId,
        },
      };
    }
  
    const results = await this.prisma.perusahaanTujuanBongkar.findMany({
      where: whereConditions,
      include: {
        company: true,
        province: true,
        regency: true,
        district: true,
        village: true,
      },
      orderBy: {
        [sortBy]: sortOrder.toLowerCase(),
      },
      ...(returnAll ? {} : { skip: (page - 1) * limit, take: limit }),
    });
  
    const totalRecords = returnAll
      ? results.length
      : await this.prisma.perusahaanTujuanBongkar.count({ where: whereConditions });
  
    return {
      data: results,
      totalRecords,
      currentPage: returnAll ? 1 : page,
      totalPages: returnAll ? 1 : Math.ceil(totalRecords / limit),
    };
  }
  
  async getPerusahaanTujuanBongkarById(id: string) {
    const perusahaan = await this.prisma.perusahaanTujuanBongkar.findUnique({
      where: { id },
      include: {
        company: true,
        province: true,
        regency: true,
        district: true,
        village: true,
        DataPerusahaanTujuanBongkarOnPengakutanDetail:{
          include:{ pengangkutanDetail: {
            include:{
              b3Substance:{include:{
                dataBahanB3:true,
              }},
              pelaporanPengangkutan: true}
          }}
        }
      },
    });
  
    if (!perusahaan) {
      throw new NotFoundException('Perusahaan Tujuan Bongkar tidak ditemukan.');
    }
  
    return perusahaan;
  }
  
}
