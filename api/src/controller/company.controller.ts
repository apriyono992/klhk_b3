import { Controller, Get, Post, Put, Delete, Param, Body, Query, HttpCode, HttpStatus, UseGuards,  } from '@nestjs/common';
import { CompanyService } from '../services/company.services';
import { CreateCompanyDto } from '../models/createCompanyDto';
import { UpdateCompanyDto } from '../models/updateCompanyDto';
import { SearchCompanyDto } from '../models/searchCompanyDto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiQuery, ApiParam, ApiNotFoundResponse, ApiBadRequestResponse } from '@nestjs/swagger';
import { UpdateDataSupplierDto } from 'src/models/updateDataSupplierDto';
import { CreateDataSupplierDto } from 'src/models/createDataSupplierDto';
import { UpdatePerusahaanAsalMuatDanTujuanDto } from 'src/models/updatePerusahaanAsalDanTujuanB3Dto';
import { CreatePerusahaanAsalMuatDanTujuanDto } from 'src/models/createPerusahaanAsalDanTujuanB3Dto';
import { UpdateDataTransporterDto } from 'src/models/updateDataTransporterDto';
import { CreateDataTransporterDto } from 'src/models/createDataTransporterDto';
import { SearchDataSupplierDto } from 'src/models/searchDataSupplierDto';
import { SearchDataCustomerDto } from 'src/models/searchDataCustomerDto';
import { SearchDataTransporterDto } from 'src/models/searchDataTransporterDto';
import { SearchPerusahaanAsalMuatDto } from 'src/models/searchPerusahaanAsalMuatDto';
import { SearchPerusahaanTujuanBongkarDto } from 'src/models/searchPerusahaanTujuanBongkarDto';
import { JwtAuthGuard } from 'src/utils/auth.guard';
import { RolesGuard } from 'src/utils/roles.guard';
import { RolesAccess } from 'src/models/enums/roles';
import { Roles } from 'src/utils/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@ApiTags('Company')
@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Post()
  @Roles(RolesAccess.SUPER_ADMIN, RolesAccess.PIC_REGISTRASI, RolesAccess.PIC_REKOMENDASI, RolesAccess.PIC_NOTIFIKASI, RolesAccess.PENGELOLA)   
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new company' })
  @ApiBody({
    description: 'Create company request body',
    schema: {
      example: {
        name: 'PT Example Company',
        penanggungJawab: 'John Doe',
        alamatKantor: 'Jl. Merdeka No. 1, Jakarta',
        telpKantor: '+62 21 5551234',
        faxKantor: '+62 21 5555678',
        emailKantor: 'info@example.com',
        npwp: '123456789012345',
        alamatPool: ['Jl. Merdeka No. 1', 'Jl. Soekarno Hatta No. 10'],
        bidangUsaha: 'Manufacturing',
        kodeDBKlh: 'KLH123',
        nomorInduk: '4567890',
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'The company has been successfully created.',
    schema: {
      example: {
        id: '1a2b3c4d5e6f7g8h9i0j',
        name: 'PT Example Company',
        penanggungJawab: 'John Doe',
        alamatKantor: 'Jl. Merdeka No. 1, Jakarta',
        telpKantor: '+62 21 5551234',
        faxKantor: '+62 21 5555678',
        emailKantor: 'info@example.com',
        npwp: '123456789012345',
        alamatPool: ['Jl. Merdeka No. 1', 'Jl. Soekarno Hatta No. 10'],
        bidangUsaha: 'Manufacturing',
        kodeDBKlh: 'KLH123',
        nomorInduk: '4567890',
        createdAt: '2024-10-01T12:34:56.789Z',
        updatedAt: '2024-10-01T12:34:56.789Z',
      },
    },
  })
  @ApiResponse({ status: 409, description: 'Unique constraint violation.' })
  async createCompany(@Body() createCompanyDto: CreateCompanyDto) {
    return this.companyService.createCompany(createCompanyDto);
  }

  @Get('find/:id')
  @ApiOperation({ summary: 'Get a single company by ID' })
  @ApiParam({ name: 'id', type: String, description: 'Company ID' })
  @ApiResponse({
    status: 200,
    description: 'Return a company object.',
    schema: {
      example: {
        id: '1a2b3c4d5e6f7g8h9i0j',
        name: 'PT Example Company',
        npwp: '123456789012345',
        alamatPool: ['Jl. Merdeka No. 1', 'Jl. Soekarno Hatta No. 10'],
        bidangUsaha: 'Manufacturing',
        kodeDBKlhk: 'KLH123',
        nomorInduk: '4567890',
        createdAt: '2024-10-01T12:34:56.789Z',
        updatedAt: '2024-10-01T12:34:56.789Z',
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Company not found.' })
  async getCompany(@Param('id') id: string) {
    return this.companyService.getCompany(id);
  }

  @Get('search-company')
  @ApiOperation({ summary: 'Get a list of companies with optional search and pagination' })
  @ApiQuery({ name: 'page', type: Number, required: false, description: 'Page number for pagination', example: 1 })
  @ApiQuery({ name: 'limit', type: Number, required: false, description: 'Limit of results per page', example: 10 })
  @ApiQuery({ name: 'name', type: String, required: false, description: 'Search by company name' })
  @ApiQuery({ name: 'npwp', type: String, required: false, description: 'Search by company NPWP' })
  @ApiQuery({ name: 'bidangUsaha', type: String, required: false, description: 'Search by business field (bidang usaha)' })
  @ApiQuery({ name: 'kodeDBKlhk', type: String, required: false, description: 'Search by company kodeDBKlhk' })
  @ApiQuery({ name: 'sortBy', type: String, required: false, description: 'Field to sort by', example: 'createdAt' })
  @ApiQuery({ name: 'sortOrder', type: String, required: false, description: 'Sort order (asc/desc)', example: 'desc' })
  @ApiResponse({
    status: 200,
    description: 'Return a list of companies with pagination.',
    schema: {
      example: {
        total: 1,
        page: 1,
        limit: 10,
        data: [
          {
            id: '1a2b3c4d5e6f7g8h9i0j',
            name: 'PT Example Company',
            npwp: '123456789012345',
            alamatPool: ['Jl. Merdeka No. 1', 'Jl. Soekarno Hatta No. 10'],
            bidangUsaha: 'Manufacturing',
            kodeDBKlhk: 'KLH123',
            nomorInduk: '4567890',
            createdAt: '2024-10-01T12:34:56.789Z',
            updatedAt: '2024-10-01T12:34:56.789Z',
          },
        ],
      },
    },
  })
  async getCompanies(@Query() searchDto: SearchCompanyDto) {
    return this.companyService.getCompanies(searchDto);
  }

  @Put('update-company/:id')
  @Roles(RolesAccess.SUPER_ADMIN, RolesAccess.PIC_REGISTRASI, RolesAccess.PIC_REKOMENDASI, RolesAccess.PIC_NOTIFIKASI, RolesAccess.PENGELOLA)   
  @ApiOperation({ summary: 'Update an existing company by ID' })
  @ApiParam({ name: 'id', type: String, description: 'Company ID' })
  @ApiBody({
    description: 'Update company request body',
    schema: {
      example: {
        name: 'PT Updated Company',
        npwp: '987654321098765',
        alamatPool: ['Jl. Merdeka No. 2', 'Jl. Sudirman No. 11'],
        bidangUsaha: 'Retail',
        kodeDBKlhk: 'KLH456',
        nomorInduk: '5678901',
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'The company has been successfully updated.',
    schema: {
      example: {
        id: '1a2b3c4d5e6f7g8h9i0j',
        name: 'PT Updated Company',
        npwp: '987654321098765',
        alamatPool: ['Jl. Merdeka No. 2', 'Jl. Sudirman No. 11'],
        bidangUsaha: 'Retail',
        kodeDBKlhk: 'KLH456',
        nomorInduk: '5678901',
        createdAt: '2024-10-01T12:34:56.789Z',
        updatedAt: '2024-10-02T14:23:45.123Z',
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Company not found.' })
  @ApiResponse({ status: 409, description: 'Unique constraint violation.' })
  async updateCompany(@Param('id') id: string, @Body() updateCompanyDto: UpdateCompanyDto) {
    return this.companyService.updateCompany(id, updateCompanyDto);
  }

  @Delete(':id')
  @Roles(RolesAccess.SUPER_ADMIN)   
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a company by ID' })
  @ApiParam({ name: 'id', type: String, description: 'Company ID' })
  @ApiResponse({ status: 204, description: 'The company has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Company not found.' })
  async deleteCompany(@Param('id') id: string) {
    return this.companyService.deleteCompany(id);
  }

  // Endpoint untuk menambah DataSupplier
  @Post('data-supplier/:companyId')
  @Roles(RolesAccess.SUPER_ADMIN, RolesAccess.PIC_REGISTRASI, RolesAccess.PIC_REKOMENDASI, RolesAccess.PENGELOLA)   
  @ApiOperation({ summary: 'Add new DataSupplier' })
  @ApiParam({ name: 'companyId', description: 'ID of the company' })
  @ApiBody({
    type: CreateDataSupplierDto,
    examples: {
      example1: {
        summary: 'Example Request',
        value: {
          namaSupplier: 'PT. Supplier XYZ',
          alamat: 'Jl. Sudirman No. 1',
          email: 'contact@supplierxyz.com',
          telepon: '081234567890',
          fax: '021-12345678',
          longitude: 106.84513,
          latitude: -6.20876,
          provinceId: '123',
          regencyId: '456',
          districtId: '789',
          villageId: '101',
          dataPICs: [
            {
              namaPIC: 'John Doe',
              jabatan: 'Manager',
              email: 'john.doe@supplierxyz.com',
              telepon: '081234567891',
              fax: '021-12345679',
            },
          ],
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'DataSupplier created successfully.',
    schema: {
      example: {
        id: 'supplier-id-123',
        companyId: 'company-id-456',
        namaSupplier: 'PT. Supplier XYZ',
        alamat: 'Jl. Sudirman No. 1',
        email: 'contact@supplierxyz.com',
        telepon: '081234567890',
        fax: '021-12345678',
        longitude: 106.84513,
        latitude: -6.20876,
        provinceId: '123',
        regencyId: '456',
        districtId: '789',
        villageId: '101',
        createdAt: '2024-11-11T10:00:00Z',
        updatedAt: '2024-11-11T10:00:00Z',
        dataPICs: [
          {
            id: 'pic-id-789',
            namaPIC: 'John Doe',
            jabatan: 'Manager',
            email: 'john.doe@supplierxyz.com',
            telepon: '081234567891',
            fax: '021-12345679',
          },
        ],
      },
    },
  })
  async addDataSupplier(@Param('companyId') companyId: string, @Body() data: CreateDataSupplierDto) {
    return this.companyService.addDataSupplier(companyId, data);
  }

  // Endpoint untuk mengupdate DataSupplier
  @Put('supplier/:supplierId')
  @Roles(RolesAccess.SUPER_ADMIN, RolesAccess.PIC_REGISTRASI, RolesAccess.PIC_REKOMENDASI, RolesAccess.PENGELOLA)   
  @ApiOperation({ summary: 'Update DataSupplier' })
  @ApiParam({ name: 'supplierId', description: 'ID of the supplier' })
  @ApiBody({
    type: UpdateDataSupplierDto,
    examples: {
      example1: {
        summary: 'Example Request',
        value: {
          namaSupplier: 'PT. Supplier Baru',
          alamat: 'Jl. Gatot Subroto No. 2',
          email: 'newcontact@supplierxyz.com',
          telepon: '081234567892',
          fax: '021-12345680',
          longitude: 106.84514,
          latitude: -6.20877,
          provinceId: '124',
          regencyId: '457',
          districtId: '790',
          villageId: '102',
          dataPICs: [
            {
              id: 'pic-id-789',
              namaPIC: 'Jane Doe',
              jabatan: 'Supervisor',
              email: 'jane.doe@supplierxyz.com',
              telepon: '081234567893',
            },
          ],
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'DataSupplier updated successfully.',
    schema: {
      example: {
        id: 'supplier-id-123',
        companyId: 'company-id-456',
        namaSupplier: 'PT. Supplier Baru',
        alamat: 'Jl. Gatot Subroto No. 2',
        email: 'newcontact@supplierxyz.com',
        telepon: '081234567892',
        fax: '021-12345680',
        longitude: 106.84514,
        latitude: -6.20877,
        provinceId: '124',
        regencyId: '457',
        districtId: '790',
        villageId: '102',
        updatedAt: '2024-11-11T12:00:00Z',
        dataPICs: [
          {
            id: 'pic-id-789',
            namaPIC: 'Jane Doe',
            jabatan: 'Supervisor',
            email: 'jane.doe@supplierxyz.com',
            telepon: '081234567893',
          },
        ],
      },
    },
  })
  async updateDataSupplier(@Param('supplierId') supplierId: string, @Body() data: UpdateDataSupplierDto) {
    return this.companyService.updateDataSupplier(supplierId, data);
  }

  // Endpoint untuk menghapus DataSupplier
  @Delete('supplier/:supplierId')
  @Roles(RolesAccess.SUPER_ADMIN, RolesAccess.PIC_REGISTRASI, RolesAccess.PIC_REKOMENDASI, RolesAccess.PENGELOLA)   
  @ApiOperation({ summary: 'Delete DataSupplier' })
  @ApiParam({ name: 'supplierId', description: 'ID of the supplier' })
  @ApiResponse({
    status: 200,
    description: 'DataSupplier deleted successfully.',
    schema: {
      example: {
        message: 'DataSupplier deleted successfully.',
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Supplier not found.' })
  async deleteDataSupplier(@Param('supplierId') supplierId: string) {
    await this.companyService.deleteDataSupplier(supplierId);
    return { message: 'DataSupplier deleted successfully.' };
  }

   // Endpoint untuk mengambil daftar DataSupplier dalam satu company
   @Get('data-suppliers/:companyId')
   @ApiOperation({ summary: 'List all DataSuppliers for a company' })
   @ApiParam({ name: 'companyId', description: 'ID of the company' })
   @ApiResponse({
     status: 200,
     description: 'List of DataSuppliers retrieved successfully.',
     schema: {
       example: [
         {
           id: 'supplier-id-123',
           companyId: 'company-id-456',
           namaSupplier: 'PT. Supplier XYZ',
           alamat: 'Jl. Sudirman No. 1',
           email: 'contact@supplierxyz.com',
           telepon: '081234567890',
           fax: '021-12345678',
           longitude: 106.84513,
           latitude: -6.20876,
           provinceId: '123',
           regencyId: '456',
           districtId: '789',
           villageId: '101',
           dataPICs: [
             {
               id: 'pic-id-789',
               namaPIC: 'John Doe',
               jabatan: 'Manager',
               email: 'john.doe@supplierxyz.com',
               telepon: '081234567891',
               fax: '021-12345679',
             },
           ],
         },
       ],
     },
   })
   async listDataSuppliers(@Param('companyId') companyId: string) {
     return this.companyService.listDataSuppliers(companyId);
   }
 
   // Endpoint untuk mengambil daftar DataCustomer dalam satu company
   @Get('data-customers/:companyId')
   @ApiOperation({ summary: 'List all DataCustomers for a company' })
   @ApiParam({ name: 'companyId', description: 'ID of the company' })
   @ApiResponse({
     status: 200,
     description: 'List of DataCustomers retrieved successfully.',
     schema: {
       example: [
         {
           id: 'customer-id-123',
           companyId: 'company-id-456',
           namaCustomer: 'PT. Customer ABC',
           alamat: 'Jl. Thamrin No. 5',
           email: 'info@customerabc.com',
           telepon: '081234567890',
           fax: '021-12345678',
           longitude: 106.84513,
           latitude: -6.20876,
           provinceId: '123',
           regencyId: '456',
           districtId: '789',
           villageId: '101',
           dataPICs: [
             {
               id: 'pic-id-890',
               namaPIC: 'Jane Doe',
               jabatan: 'Director',
               email: 'jane.doe@customerabc.com',
               telepon: '081234567891',
               fax: '021-12345680',
             },
           ],
         },
       ],
     },
   })
   async listDataCustomers(@Param('companyId') companyId: string) {
     return this.companyService.listDataCustomers(companyId);
   }

   @Post('asal-muat')
   @Roles(RolesAccess.SUPER_ADMIN, RolesAccess.PIC_REGISTRASI, RolesAccess.PIC_REKOMENDASI, RolesAccess.PENGELOLA)   
   @ApiOperation({ summary: 'Add a new Perusahaan Asal Muat' })
   @ApiResponse({
     status: 201,
     description: 'Perusahaan Asal Muat has been successfully added.',
     schema: {
       example: {
         id: 'asal-1234',
         namaPerusahaan: 'PT ABC',
         alamat: 'Jl. Sudirman No.1',
         latitude: -6.200000,
         longitude: 106.816666,
         locationType: 'WAREHOUSE',
         provinceId: 'prov-001',
         regencyId: 'reg-001',
         districtId: 'dist-001',
         villageId: 'vill-001',
       },
     },
   })
   @ApiNotFoundResponse({
     description: 'Perusahaan Asal Muat Not Found.',
   })
   async addPerusahaanAsalMuat(@Body() data: CreatePerusahaanAsalMuatDanTujuanDto) {
     return this.companyService.addPerusahaanAsalMuat(data);
   }
 
   @Post('tujuan-bongkar')
   @Roles(RolesAccess.SUPER_ADMIN, RolesAccess.PIC_REGISTRASI, RolesAccess.PIC_REKOMENDASI, RolesAccess.PENGELOLA)   
   @ApiOperation({ summary: 'Add a new Perusahaan Tujuan Bongkar' })
   @ApiResponse({
     status: 201,
     description: 'Perusahaan Tujuan Bongkar has been successfully added.',
     schema: {
       example: {
         id: 'tujuan-1234',
         namaPerusahaan: 'PT XYZ',
         alamat: 'Jl. Thamrin No.2',
         latitude: -6.200000,
         longitude: 106.816666,
         provinceId: 'prov-002',
         regencyId: 'reg-002',
         districtId: 'dist-002',
         villageId: 'vill-002',
       },
     },
   })
   @ApiNotFoundResponse({
     description: 'Perusahaan Tujuan Bongkar Not Found.',
   })
   async addPerusahaanTujuanBongkar(@Body() data: CreatePerusahaanAsalMuatDanTujuanDto) {
     return this.companyService.addPerusahaanTujuanBongkar(data);
   }
 
   @Post('asal-muat/:id')
   @Roles(RolesAccess.SUPER_ADMIN, RolesAccess.PIC_REGISTRASI, RolesAccess.PIC_REKOMENDASI, RolesAccess.PENGELOLA)   
   @ApiOperation({ summary: 'Update an existing Perusahaan Asal Muat' })
   @ApiResponse({
     status: 200,
     description: 'Perusahaan Asal Muat has been successfully updated.',
   })
   @ApiNotFoundResponse({
     description: 'Loading company not found.',
   })
   async updatePerusahaanAsalMuat(
     @Param('id') id: string,
     @Body() data: UpdatePerusahaanAsalMuatDanTujuanDto,
   ) {
     return this.companyService.updatePerusahaanAsalMuat(id, data);
   }
 
   @Post('tujuan-bongkar/:id')
   @Roles(RolesAccess.SUPER_ADMIN, RolesAccess.PIC_REGISTRASI, RolesAccess.PIC_REKOMENDASI, RolesAccess.PENGELOLA)   
   @ApiOperation({ summary: 'Update an existing Perusahaan Tujuan Bongkar' })
   @ApiResponse({
     status: 200,
     description: 'Perusahaan Tujuan Bongkar has been successfully updated.',
   })
   @ApiNotFoundResponse({
     description: 'Unloading company not found.',
   })
   async updatePerusahaanTujuanBongkar(
     @Param('id') id: string,
     @Body() data: UpdatePerusahaanAsalMuatDanTujuanDto,
   ) {
     return this.companyService.updatePerusahaanTujuanBongkar(id, data);
   }
 
   @Delete('asal-muat/:id')
   @Roles(RolesAccess.SUPER_ADMIN, RolesAccess.PIC_REGISTRASI, RolesAccess.PIC_REKOMENDASI, RolesAccess.PENGELOLA)   
   @ApiOperation({ summary: 'Delete an existing Perusahaan Asal Muat' })
   @ApiResponse({
     status: 200,
     description: 'Perusahaan Asal Muat has been successfully deleted.',
   })
   @ApiNotFoundResponse({
     description: 'Loading company not found.',
   })
   async deletePerusahaanAsalMuat(@Param('id') id: string) {
     return this.companyService.deletePerusahaanAsalMuat(id);
   }
 
   @Delete('tujuan-bongkar/:id')
   @Roles(RolesAccess.SUPER_ADMIN, RolesAccess.PIC_REGISTRASI, RolesAccess.PIC_REKOMENDASI, RolesAccess.PENGELOLA)   
   @ApiOperation({ summary: 'Delete an existing Perusahaan Tujuan Bongkar' })
   @ApiResponse({
     status: 200,
     description: 'Perusahaan Tujuan Bongkar has been successfully deleted.',
   })
   @ApiNotFoundResponse({
     description: 'Unloading company not found.',
   })
   async deletePerusahaanTujuanBongkar(@Param('id') id: string) {
     return this.companyService.deletePerusahaanTujuanBongkar(id);
   }

   @Post('create-transporter')
   @Roles(RolesAccess.SUPER_ADMIN, RolesAccess.PIC_REGISTRASI, RolesAccess.PIC_REKOMENDASI, RolesAccess.PENGELOLA)   
   @ApiOperation({ summary: 'Create a new transporter' })
   @ApiResponse({
     status: 201,
     description: 'Transporter has been successfully created.',
     schema: {
       example: {
         id: 'trans-1234',
         namaTransPorter: 'PT Transporter ABC',
         alamat: 'Jl. Transporter No.1',
         email: 'contact@transporterabc.com',
         telepon: '08123456789',
         fax: '0211234567',
         longitude: 106.816666,
         latitude: -6.200000,
         companyId: 'comp-001',
         provinceId: 'prov-001',
         regencyId: 'reg-001',
         districtId: 'dist-001',
         villageId: 'vill-001',
         DataPic: [{ id: 'pic-001' }, { id: 'pic-002' }],
       },
     },
   })
   @ApiBadRequestResponse({
     description: 'Nama customer sudah ada, harap gunakan nama yang berbeda.',
   })
   @ApiNotFoundResponse({
     description: 'Perusahaan tidak ditemukan atau Data PIC tidak ditemukan.',
   })
   async createTransporter(@Body() data: CreateDataTransporterDto) {
     return this.companyService.createTransporter(data);
   }
 
   @Post('update-transporter/:id')
   @Roles(RolesAccess.SUPER_ADMIN, RolesAccess.PIC_REGISTRASI, RolesAccess.PIC_REKOMENDASI, RolesAccess.PENGELOLA)   
   @ApiOperation({ summary: 'Update an existing transporter' })
   @ApiResponse({
     status: 200,
     description: 'Transporter has been successfully updated.',
     schema: {
       example: {
         id: 'trans-1234',
         namaTransPorter: 'PT Transporter ABC Updated',
         alamat: 'Jl. Updated No.1',
         email: 'updated@transporterabc.com',
         telepon: '08123456789',
         fax: '0211234567',
         longitude: 106.816666,
         latitude: -6.200000,
         companyId: 'comp-001',
         provinceId: 'prov-001',
         regencyId: 'reg-001',
         districtId: 'dist-001',
         villageId: 'vill-001',
         DataPic: [{ id: 'pic-001' }, { id: 'pic-003' }],
       },
     },
   })
   @ApiBadRequestResponse({
     description: 'Nama customer sudah ada, harap gunakan nama yang berbeda.',
   })
   @ApiNotFoundResponse({
     description: 'Data transporter tidak ditemukan atau Data PIC tidak ditemukan.',
   })
   async updateTransporter(
     @Param('id') id: string,
     @Body() data: UpdateDataTransporterDto,
   ) {
     return this.companyService.updateTransporter(id, data);
   }
 
   @Delete('delete-transporter/:id')
   @Roles(RolesAccess.SUPER_ADMIN, RolesAccess.PIC_REGISTRASI, RolesAccess.PIC_REKOMENDASI, RolesAccess.PENGELOLA)   
   @ApiOperation({ summary: 'Delete an existing transporter' })
   @ApiResponse({
     status: 200,
     description: 'Transporter has been successfully deleted.',
     schema: {
       example: {
         message: 'Data transporter berhasil dihapus.',
       },
     },
   })
   @ApiNotFoundResponse({
     description: 'Data transporter tidak ditemukan.',
   })
   async deleteTransporter(@Param('id') id: string) {
     return this.companyService.deleteTransporter(id);
   }

   @Get('data-supplier/:id')
    @ApiOperation({ summary: 'Dapatkan data supplier berdasarkan ID' })
    @ApiParam({
      name: 'id',
      type: 'string',
      description: 'ID dari data supplier yang akan diambil',
      example: '123e4567-e89b-12d3-a456-426614174000',
    })
    @ApiResponse({
      status: 200,
      description: 'Data supplier berhasil ditemukan.',
      schema: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid', example: '123e4567-e89b-12d3-a456-426614174000' },
          namaSupplier: { type: 'string', example: 'PT. Supplier Bahan Kimia' },
          alamat: { type: 'string', example: 'Jl. Supplier No. 2, Bandung' },
          email: { type: 'string', example: 'contact@supplier.com' },
          telepon: { type: 'string', example: '02287654321' },
          fax: { type: 'string', example: '02287654322' },
          longitude: { type: 'number', example: 107.6191 },
          latitude: { type: 'number', example: -6.9175 },
          company: {
            type: 'object',
            properties: {
              id: { type: 'string', format: 'uuid', example: 'companyId123' },
              name: { type: 'string', example: 'PT. Contoh Perusahaan' },
            },
          },
          province: { type: 'object', properties: { name: { type: 'string', example: 'Jawa Barat' } } },
          regency: { type: 'object', properties: { name: { type: 'string', example: 'Bandung' } } },
          district: { type: 'object', properties: { name: { type: 'string', example: 'Cicendo' } } },
          village: { type: 'object', properties: { name: { type: 'string', example: 'Pasir Kaliki' } } },
          DataPic: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'string', format: 'uuid', example: 'picId123' },
                name: { type: 'string', example: 'John Doe' },
                email: { type: 'string', example: 'john.doe@example.com' },
              },
            },
          },
        },
      },
    })
    @ApiResponse({ status: 404, description: 'Supplier tidak ditemukan.' })
    async getSupplierById(@Param('id') id: string) {
      return await this.companyService.getSupplierById(id);
    }

    @Get('search-supplier')
    @ApiOperation({ summary: 'Cari data supplier dengan filter, termasuk opsi untuk mengembalikan semua data' })
    @ApiResponse({
      status: 200,
      description: 'Data supplier ditemukan.',
      schema: {
        type: 'object',
        properties: {
          data: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'string', format: 'uuid', example: 'supplier123' },
                namaSupplier: { type: 'string', example: 'PT. Supplier Bahan Kimia' },
                alamat: { type: 'string', example: 'Jl. Supplier No. 2, Bandung' },
                email: { type: 'string', example: 'contact@supplier.com' },
                telepon: { type: 'string', example: '02287654321' },
                longitude: { type: 'number', example: 107.6191 },
                latitude: { type: 'number', example: -6.9175 },
                company: { type: 'object', properties: { name: { type: 'string', example: 'PT. Contoh Perusahaan' } } },
                province: { type: 'object', properties: { name: { type: 'string', example: 'Jawa Barat' } } },
                regency: { type: 'object', properties: { name: { type: 'string', example: 'Bandung' } } },
                district: { type: 'object', properties: { name: { type: 'string', example: 'Cicendo' } } },
                village: { type: 'object', properties: { name: { type: 'string', example: 'Pasir Kaliki' } } },
              },
            },
          },
          totalRecords: { type: 'number', example: 100 },
          currentPage: { type: 'number', example: 1 },
          totalPages: { type: 'number', example: 10 },
        },
      },
    })
    async searchSuppliers(@Query() dto: SearchDataSupplierDto) {
      return await this.companyService.searchSuppliers(dto);
    }

    @Get('data-customer/:id')
    @ApiOperation({ summary: 'Dapatkan data customer berdasarkan ID' })
    @ApiParam({
      name: 'id',
      type: 'string',
      description: 'ID dari data customer yang akan diambil',
      example: '123e4567-e89b-12d3-a456-426614174000',
    })
    @ApiResponse({
      status: 200,
      description: 'Data customer berhasil ditemukan.',
      schema: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid', example: '123e4567-e89b-12d3-a456-426614174000' },
          namaCustomer: { type: 'string', example: 'PT. Pelanggan Kimia' },
          alamat: { type: 'string', example: 'Jl. Pelanggan No. 2, Bandung' },
          email: { type: 'string', example: 'contact@pelanggan.com' },
          telepon: { type: 'string', example: '02287654321' },
          fax: { type: 'string', example: '02287654322' },
          longitude: { type: 'number', example: 107.6191 },
          latitude: { type: 'number', example: -6.9175 },
          company: {
            type: 'object',
            properties: {
              id: { type: 'string', format: 'uuid', example: 'companyId123' },
              name: { type: 'string', example: 'PT. Contoh Perusahaan' },
            },
          },
          province: { type: 'object', properties: { name: { type: 'string', example: 'Jawa Barat' } } },
          regency: { type: 'object', properties: { name: { type: 'string', example: 'Bandung' } } },
          district: { type: 'object', properties: { name: { type: 'string', example: 'Cicendo' } } },
          village: { type: 'object', properties: { name: { type: 'string', example: 'Pasir Kaliki' } } },
          DataPic: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'string', format: 'uuid', example: 'picId123' },
                name: { type: 'string', example: 'John Doe' },
                email: { type: 'string', example: 'john.doe@example.com' },
              },
            },
          },
        },
      },
    })
    @ApiResponse({ status: 404, description: 'Customer tidak ditemukan.' })
    async getCustomerById(@Param('id') id: string) {
      return await this.companyService.getCustomerById(id);
    }

    @Get('search-customer')
    @ApiOperation({ summary: 'Cari data customer dengan filter, termasuk berdasarkan pelaporan terkait' })
    @ApiResponse({
      status: 200,
      description: 'Data customer ditemukan.',
      schema: {
        type: 'object',
        properties: {
          data: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'string', format: 'uuid', example: 'customer123' },
                namaCustomer: { type: 'string', example: 'PT. Pelanggan Kimia' },
                alamat: { type: 'string', example: 'Jl. Pelanggan No. 2, Bandung' },
                email: { type: 'string', example: 'contact@pelanggan.com' },
                telepon: { type: 'string', example: '02287654321' },
                longitude: { type: 'number', example: 107.6191 },
                latitude: { type: 'number', example: -6.9175 },
                company: { type: 'object', properties: { name: { type: 'string', example: 'PT. Contoh Perusahaan' } } },
                province: { type: 'object', properties: { name: { type: 'string', example: 'Jawa Barat' } } },
                regency: { type: 'object', properties: { name: { type: 'string', example: 'Bandung' } } },
                district: { type: 'object', properties: { name: { type: 'string', example: 'Cicendo' } } },
                village: { type: 'object', properties: { name: { type: 'string', example: 'Pasir Kaliki' } } },
              },
            },
          },
          totalRecords: { type: 'number', example: 100 },
          currentPage: { type: 'number', example: 1 },
          totalPages: { type: 'number', example: 10 },
        },
      },
    })
    async searchCustomers(@Query() dto: SearchDataCustomerDto) {
      return await this.companyService.searchCustomers(dto);
    }

    @Get('data-transporter/:id')
    @ApiOperation({ summary: 'Dapatkan data transporter berdasarkan ID' })
    @ApiParam({
      name: 'id',
      type: 'string',
      description: 'ID dari data transporter yang akan diambil',
      example: '123e4567-e89b-12d3-a456-426614174000',
    })
    @ApiResponse({ status: 200, description: 'Data transporter berhasil ditemukan.' })
    @ApiResponse({ status: 404, description: 'Transporter tidak ditemukan.' })
    async getTransporterById(@Param('id') id: string) {
      return await this.companyService.getTransporterById(id);
    }

    @Get('search-data-transporter')
    @ApiOperation({ summary: 'Cari data transporter dengan filter, termasuk berdasarkan pelaporan terkait' })
    @ApiResponse({
      status: 200,
      description: 'Data transporter ditemukan.',
      schema: {
        type: 'object',
        properties: {
          data: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'string', format: 'uuid', example: 'transporter123' },
                namaTransPorter: { type: 'string', example: 'PT. Transporter Kimia' },
                alamat: { type: 'string', example: 'Jl. Transporter No. 2, Bandung' },
                email: { type: 'string', example: 'contact@transporter.com' },
                telepon: { type: 'string', example: '02287654321' },
                longitude: { type: 'number', example: 107.6191 },
                latitude: { type: 'number', example: -6.9175 },
                company: { type: 'object', properties: { name: { type: 'string', example: 'PT. Contoh Perusahaan' } } },
                province: { type: 'object', properties: { name: { type: 'string', example: 'Jawa Barat' } } },
                regency: { type: 'object', properties: { name: { type: 'string', example: 'Bandung' } } },
                district: { type: 'object', properties: { name: { type: 'string', example: 'Cicendo' } } },
                village: { type: 'object', properties: { name: { type: 'string', example: 'Pasir Kaliki' } } },
              },
            },
          },
          totalRecords: { type: 'number', example: 100 },
          currentPage: { type: 'number', example: 1 },
          totalPages: { type: 'number', example: 10 },
        },
      },
    })
    async searchTransporters(@Query() dto: SearchDataTransporterDto) {
      return await this.companyService.searchTransporters(dto);
    }

    @Get('search-perusahaan-asal-muat')
    @ApiOperation({ summary: 'Cari data perusahaan asal muat dengan filter, termasuk berdasarkan pelaporan terkait' })
    @ApiQuery({ name: 'companyId', type: 'string', required: false, example: '123e4567-e89b-12d3-a456-426614174000', description: 'ID perusahaan' })
    @ApiQuery({ name: 'namaPerusahaan', type: 'string', required: false, example: 'PT. Muatan Kimia', description: 'Nama perusahaan asal muat' })
    @ApiQuery({ name: 'provinceId', type: 'string', required: false, example: 'province123', description: 'ID provinsi' })
    @ApiQuery({ name: 'regencyId', type: 'string', required: false, example: 'regency123', description: 'ID kabupaten/kota' })
    @ApiQuery({ name: 'districtId', type: 'string', required: false, example: 'district123', description: 'ID kecamatan' })
    @ApiQuery({ name: 'villageId', type: 'string', required: false, example: 'village123', description: 'ID desa/kelurahan' })
    @ApiQuery({ name: 'longitude', type: 'number', required: false, example: 107.6191, description: 'Longitude lokasi' })
    @ApiQuery({ name: 'latitude', type: 'number', required: false, example: -6.9175, description: 'Latitude lokasi' })
    @ApiQuery({ name: 'reportId', type: 'string', required: false, example: 'report123', description: 'ID pelaporan terkait' })
    @ApiQuery({ name: 'page', type: 'number', required: false, example: 1, description: 'Nomor halaman' })
    @ApiQuery({ name: 'limit', type: 'number', required: false, example: 10, description: 'Jumlah item per halaman' })
    @ApiResponse({
      status: 200,
      description: 'Data perusahaan asal muat ditemukan.',
      schema: {
        type: 'object',
        properties: {
          data: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'string', example: 'perusahaan123' },
                namaPerusahaan: { type: 'string', example: 'PT. Muatan Kimia' },
                alamat: { type: 'string', example: 'Jl. Muatan No. 2, Bandung' },
                longitude: { type: 'number', example: 107.6191 },
                latitude: { type: 'number', example: -6.9175 },
                locationType: { type: 'string', example: 'Gudang' },
                company: { type: 'object', properties: { id: { type: 'string' }, name: { type: 'string', example: 'PT. Contoh Perusahaan' } } },
                province: { type: 'object', properties: { name: { type: 'string', example: 'Jawa Barat' } } },
                regency: { type: 'object', properties: { name: { type: 'string', example: 'Bandung' } } },
                district: { type: 'object', properties: { name: { type: 'string', example: 'Cicendo' } } },
                village: { type: 'object', properties: { name: { type: 'string', example: 'Pasir Kaliki' } } },
              },
            },
          },
          totalRecords: { type: 'number', example: 50 },
          currentPage: { type: 'number', example: 1 },
          totalPages: { type: 'number', example: 5 },
        },
      },
    })
    @ApiResponse({ status: 404, description: 'Data perusahaan asal muat tidak ditemukan.' })
    async searchPerusahaanAsalMuat(@Query() dto: SearchPerusahaanAsalMuatDto) {
      return await this.companyService.searchPerusahaanAsalMuat(dto);
    }

    @Get('perusahaan-asal-muat/:id')
    @ApiOperation({ summary: 'Dapatkan data perusahaan asal muat berdasarkan ID' })
    @ApiParam({
      name: 'id',
      type: 'string',
      description: 'ID dari data perusahaan asal muat yang akan diambil',
      example: '123e4567-e89b-12d3-a456-426614174000',
    })
    @ApiResponse({
      status: 200,
      description: 'Data perusahaan asal muat berhasil ditemukan.',
      schema: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'perusahaan123' },
          namaPerusahaan: { type: 'string', example: 'PT. Muatan Kimia' },
          alamat: { type: 'string', example: 'Jl. Muatan No. 2, Bandung' },
          longitude: { type: 'number', example: 107.6191 },
          latitude: { type: 'number', example: -6.9175 },
          locationType: { type: 'string', example: 'Gudang' },
          company: { type: 'object', properties: { id: { type: 'string' }, name: { type: 'string', example: 'PT. Contoh Perusahaan' } } },
          province: { type: 'object', properties: { name: { type: 'string', example: 'Jawa Barat' } } },
          regency: { type: 'object', properties: { name: { type: 'string', example: 'Bandung' } } },
          district: { type: 'object', properties: { name: { type: 'string', example: 'Cicendo' } } },
          village: { type: 'object', properties: { name: { type: 'string', example: 'Pasir Kaliki' } } },
        },
      },
    })
    @ApiResponse({ status: 404, description: 'Perusahaan Asal Muat tidak ditemukan.' })
    async getPerusahaanAsalMuatById(@Param('id') id: string) {
      return await this.companyService.getPerusahaanAsalMuatById(id);
    }

    @Get('perusahaan-tujuan-bongkar/:id')
    @ApiOperation({ summary: 'Dapatkan data perusahaan tujuan bongkar berdasarkan ID' })
    @ApiParam({
      name: 'id',
      type: 'string',
      description: 'ID dari data perusahaan tujuan bongkar yang akan diambil',
      example: '123e4567-e89b-12d3-a456-426614174000',
    })
    @ApiResponse({
      status: 200,
      description: 'Data perusahaan tujuan bongkar berhasil ditemukan.',
      schema: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'perusahaan123' },
          namaPerusahaan: { type: 'string', example: 'PT. Bongkar Muatan' },
          alamat: { type: 'string', example: 'Jl. Bongkar No. 2, Jakarta' },
          latitude: { type: 'number', example: -6.9175 },
          longitude: { type: 'number', example: 107.6191 },
          company: {
            type: 'object',
            properties: {
              id: { type: 'string', example: 'companyId123' },
              name: { type: 'string', example: 'PT. Contoh Perusahaan' },
            },
          },
          province: {
            type: 'object',
            properties: {
              id: { type: 'string', example: 'provinceId123' },
              name: { type: 'string', example: 'DKI Jakarta' },
            },
          },
          regency: {
            type: 'object',
            properties: {
              id: { type: 'string', example: 'regencyId123' },
              name: { type: 'string', example: 'Jakarta Pusat' },
            },
          },
          district: {
            type: 'object',
            properties: {
              id: { type: 'string', example: 'districtId123' },
              name: { type: 'string', example: 'Gambir' },
            },
          },
          village: {
            type: 'object',
            properties: {
              id: { type: 'string', example: 'villageId123' },
              name: { type: 'string', example: 'Cideng' },
            },
          },
          DataPerusahaanTujuanBongkarOnPengakutanDetail: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                pengangkutanDetail: {
                  type: 'object',
                  properties: {
                    id: { type: 'string', example: 'detailId123' },
                    b3Substance: {
                      type: 'object',
                      properties: {
                        id: { type: 'string', example: 'b3SubstanceId123' },
                        dataBahanB3: {
                          type: 'object',
                          properties: {
                            id: { type: 'string', example: 'dataBahanB3Id123' },
                            namaBahan: { type: 'string', example: 'Asam Sulfat' },
                          },
                        },
                      },
                    },
                    pelaporanPengangkutan: {
                      type: 'object',
                      properties: {
                        id: { type: 'string', example: 'reportId123' },
                        nomorLaporan: { type: 'string', example: 'LAP-2024-001' },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    })
    @ApiResponse({ status: 404, description: 'Perusahaan Tujuan Bongkar tidak ditemukan.' })
    async getPerusahaanTujuanBongkarById(@Param('id') id: string) {
      return await this.companyService.getPerusahaanTujuanBongkarById(id);
    }

    @Get('search-perusahaan-tujuan-bongkar')
    @ApiOperation({ summary: 'Cari data perusahaan tujuan bongkar dengan filter, termasuk berdasarkan pelaporan terkait' })
    @ApiResponse({
      status: 200,
      description: 'Data perusahaan tujuan bongkar ditemukan.',
      schema: {
        type: 'object',
        properties: {
          data: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'string', example: 'perusahaan123' },
                namaPerusahaan: { type: 'string', example: 'PT. Bongkar Muatan' },
                alamat: { type: 'string', example: 'Jl. Bongkar No. 2, Jakarta' },
                longitude: { type: 'number', example: 107.6191 },
                latitude: { type: 'number', example: -6.9175 },
                company: { type: 'object', properties: { id: { type: 'string' }, name: { type: 'string', example: 'PT. Contoh Perusahaan' } } },
                province: { type: 'object', properties: { name: { type: 'string', example: 'DKI Jakarta' } } },
                regency: { type: 'object', properties: { name: { type: 'string', example: 'Jakarta Pusat' } } },
                district: { type: 'object', properties: { name: { type: 'string', example: 'Gambir' } } },
                village: { type: 'object', properties: { name: { type: 'string', example: 'Cideng' } } },
              },
            },
          },
          totalRecords: { type: 'number', example: 50 },
          currentPage: { type: 'number', example: 1 },
          totalPages: { type: 'number', example: 5 },
        },
      },
    })
    @ApiResponse({ status: 404, description: 'Data perusahaan tujuan bongkar tidak ditemukan.' })
    async searchPerusahaanTujuanBongkar(@Query() dto: SearchPerusahaanTujuanBongkarDto) {
      return await this.companyService.searchPerusahaanTujuanBongkar(dto);
    }
}
