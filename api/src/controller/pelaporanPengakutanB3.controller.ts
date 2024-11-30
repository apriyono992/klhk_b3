import { Controller, Post, Body, Put, Param, Get, Query, Delete, NotFoundException, BadRequestException, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam, ApiNotFoundResponse } from '@nestjs/swagger';
import { UpdatePelaporanPengangkutanDto } from 'src/models/updatePelaporanPengakutanDto';
import { CreatePengangkutanDetailDto } from 'src/models/createPelaporanPengakutanDetailDto';
import { PelaporanPengangkutanService } from 'src/services/pelaporanPengakutanB3.services';
import { CreatePelaporanPengangkutanDto } from 'src/models/createPelaporanPengakutanDto';
import { SearchPelaporanPengakutanDto } from 'src/models/searchPelaporanPengakutanDto';
import { UpdatePengangkutanDetailDto } from 'src/models/updatePelaporanPengakutanDetailDto';
import { ReviewPelaporanBahanB3Dto } from 'src/models/reviewPelaporanBahanB3Dto';
import { RolesGuard } from 'src/utils/roles.guard';
import { JwtAuthGuard } from 'src/utils/auth.guard';
import { RolesAccess } from 'src/models/enums/roles';
import { Roles } from 'src/utils/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@ApiTags('Pelaporan Pengangkutan')
@Controller('pelaporan-pengangkutan')
export class PelaporanPengangkutanController {
  constructor(private readonly pelaporanService: PelaporanPengangkutanService) {}

  @Roles(RolesAccess.PIC_PELAPORAN, RolesAccess.PENGELOLA, RolesAccess.SUPER_ADMIN)
  @Post()
  @ApiOperation({ summary: 'Create new report' })
  @ApiBody({
    description: 'Data untuk membuat laporan baru',
    type: CreatePelaporanPengangkutanDto,
    examples: {
      example1: {
        summary: 'Contoh Permintaan Pembuatan Laporan',
        value: {
          applicationId: "a1b2c3d4-5678-1234-9abc-def567890123",
          companyId: "c1b2c3d4-5678-1234-9abc-def567890456",
          vehicleId: "v1b2c3d4-5678-1234-9abc-def567890789",
          bulan: 5,
          tahun: 2024,
          pengangkutanDetails: [
            {
              b3SubstanceId: "b3e45679-1234-4abc-9def-5678abcdef12",
              jumlahB3: 1500,
              perusahaanAsalMuat: [
                {
                  perusahaanAsalMuatId: "company123-1234-5678-9012-abcdef123456",
                  locationType: "GUDANG",
                  longitudeAsalMuat: 106.84513,
                  latitudeAsalMuat: -6.21462
                }
              ],
              perusahaanTujuanBongkar: [
                {
                  perusahaanAsalMuatId: "company123-1234-5678-9012-abcdef123456",
                  locationType: "NON_B3",
                  longitudeAsalMuat: 106.84513,
                  latitudeAsalMuat: -6.21462,
                  perusahaanTujuanBongkar: [
                    {
                      perusahaanTujuanBongkarId: "company456-7890-1234-5678-abcdef654321",
                      locationType: "PELABUHAN",
                      longitudeTujuanBongkar: 112.76884,
                      latitudeTujuanBokar: -7.25044
                    }
                  ]
                }
              ]
            }
          ],
          isDraft: true,
          periodId: "p1b2c3d4-5678-1234-9abc-def567890000"
        }
      }
    }
  })
  @ApiResponse({
    status: 201,
    description: 'The report has been successfully created.',
    schema: {
      example: {
        id: "r1b2c3d4-5678-1234-9abc-def567890111",
        applicationId: "a1b2c3d4-5678-1234-9abc-def567890123",
        companyId: "c1b2c3d4-5678-1234-9abc-def567890456",
        vehicleId: "v1b2c3d4-5678-1234-9abc-def567890789",
        bulan: 5,
        tahun: 2024,
        pengangkutanDetails: [
          {
            id: "pd1b2c3d4-5678-1234-9abc-def567890222",
            b3SubstanceId: "b3e45679-1234-4abc-9def-5678abcdef12",
            jumlahB3: 1500,
            perusahaanAsalMuat: [
              {
                perusahaanAsalMuatId: "company123-1234-5678-9012-abcdef123456",
                locationType: "GUDANG",
                longitudeAsalMuat: 106.84513,
                latitudeAsalMuat: -6.21462
              }
            ],
            perusahaanTujuanBongkar: [
              {
                perusahaanAsalMuatId: "company123-1234-5678-9012-abcdef123456",
                locationType: "NON_B3",
                longitudeAsalMuat: 106.84513,
                latitudeAsalMuat: -6.21462,
                perusahaanTujuanBongkar: [
                  {
                    perusahaanTujuanBongkarId: "company456-7890-1234-5678-abcdef654321",
                    locationType: "PELABUHAN",
                    longitudeTujuanBongkar: 112.76884,
                    latitudeTujuanBokar: -7.25044
                  }
                ]
              }
            ]
          }
        ],
        isDraft: true,
        periodId: "p1b2c3d4-5678-1234-9abc-def567890000",
        createdAt: "2024-05-01T12:00:00Z",
        updatedAt: "2024-05-01T12:00:00Z"
      }
    }
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data or report already exists.',
  })
  async createReport(@Body() data: CreatePelaporanPengangkutanDto) {
    return this.pelaporanService.createReport(data);
  }

  @Roles(RolesAccess.PIC_PELAPORAN, RolesAccess.PENGELOLA, RolesAccess.SUPER_ADMIN)
  @Put('update/:id')
  @ApiOperation({ summary: 'Update main report data' })
  @ApiParam({ name: 'id', description: 'The ID of the report to update' })
  @ApiBody({
    description: 'Data untuk memperbarui laporan',
    type: UpdatePelaporanPengangkutanDto,
    examples: {
      example1: {
        summary: 'Contoh Permintaan Update Laporan',
        value: {
          bulan: 6,
          tahun: 2024,
          isDraft: false
        }
      }
    }
  })
  @ApiResponse({
    status: 200,
    description: 'The report has been successfully updated.',
    schema: {
      example: {
        id: "r1b2c3d4-5678-1234-9abc-def567890111",
        applicationId: "a1b2c3d4-5678-1234-9abc-def567890123",
        companyId: "c1b2c3d4-5678-1234-9abc-def567890456",
        vehicleId: "v1b2c3d4-5678-1234-9abc-def567890789",
        bulan: 6,
        tahun: 2024,
        isDraft: false,
        periodId: "p1b2c3d4-5678-1234-9abc-def567890000",
        updatedAt: "2024-06-15T08:00:00Z"
      }
    }
  })
  @ApiResponse({ status: 404, description: 'Report not found.' })
  async updateMainData(
    @Param('id') id: string,
    @Body() data: UpdatePelaporanPengangkutanDto,
  ) {
    return this.pelaporanService.updateMainData(id, data);
  }
  @Roles(RolesAccess.PIC_PELAPORAN, RolesAccess.PENGELOLA, RolesAccess.SUPER_ADMIN)
  @Post('add/:id')
  @ApiOperation({ summary: 'Add detail to a report' })
  @ApiParam({ name: 'id', description: 'The ID of the report' })
  @ApiBody({
    description: 'Data for adding detail to the report',
    type: CreatePengangkutanDetailDto,
    examples: {
      example1: {
        summary: 'Example request for adding a detail',
        value: {
          b3SubstanceId: "b3e45679-1234-4abc-9def-5678abcdef12",
          jumlahB3: 1500,
          perusahaanAsalMuat: [
            "company123-1234-5678-9012-abcdef123456",
            "company789-4321-8765-1098-abcdef654321"
          ],
          perusahaanAsalMuatDanTujuanBongkar: [
            {
              perusahaanAsalMuatId: "asalMuat-1234-5678-9012-abcdef",
              locationType: "GUDANG",
              longitudeAsalMuat: 106.84513,
              latitudeAsalMuat: -6.20876,
              perusahaanTujuanBongkar: [
                {
                  perusahaanTujuanBongkarId: "bongkar-9876-5432-1098-fedcba",
                  locationType: "NON_B3",
                  longitudeTujuanBongkar: 106.83072,
                  latitudeTujuanBokar: -6.20194,
                }
              ]
            }
          ]
        }
      }
    }
  })
  @ApiResponse({
    status: 201,
    description: 'The detail has been successfully added.',
    schema: {
      example: {
        id: "d1b2c3d4-5678-1234-9abc-def567890111",
        b3SubstanceId: "b3e45679-1234-4abc-9def-5678abcdef12",
        jumlahB3: 1500,
        perusahaanAsalMuat: [
          "company123-1234-5678-9012-abcdef123456",
          "company789-4321-8765-1098-abcdef654321"
        ],
        perusahaanAsalMuatDanTujuanBongkar: [
          {
            perusahaanAsalMuatId: "asalMuat-1234-5678-9012-abcdef",
            locationType: "GUDANG",
            longitudeAsalMuat: 106.84513,
            latitudeAsalMuat: -6.20876,
            perusahaanTujuanBongkar: [
              {
                perusahaanTujuanBongkarId: "bongkar-9876-5432-1098-fedcba",
                locationType: "NON_B3",
                longitudeTujuanBongkar: 106.83072,
                latitudeTujuanBokar: -6.20194,
              }
            ]
          }
        ]
      }
    }
  })
  @ApiNotFoundResponse({
    description: 'Report not found or duplicate b3SubstanceId.',
    schema: {
      example: {
        statusCode: 404,
        message: 'Report not found or duplicate b3SubstanceId.',
        error: 'Not Found',
      },
    },
  })
  async addPengangkutanDetail(
    @Param('id') reportId: string,
    @Body() detailData: CreatePengangkutanDetailDto,
  ) {
    return this.pelaporanService.addPengangkutanDetail(reportId, detailData);
  }
  
  @Get('find/:id')
  @ApiOperation({ summary: 'Get report by ID' })
  @ApiParam({ name: 'id', description: 'The ID of the report to fetch' })
  @ApiResponse({
    status: 200,
    description: 'The report has been successfully retrieved.',
    schema: {
      example: {
        id: "r1b2c3d4-5678-1234-9abc-def567890111",
        applicationId: "a1b2c3d4-5678-1234-9abc-def567890123",
        companyId: "c1b2c3d4-5678-1234-9abc-def567890456",
        vehicleId: "v1b2c3d4-5678-1234-9abc-def567890789",
        bulan: 5,
        tahun: 2024,
        isDraft: false,
        periodId: "p1b2c3d4-5678-1234-9abc-def567890000",
        period: {
          id: "p1b2c3d4-5678-1234-9abc-def567890000",
          name: "Q2 2024",
          startDate: "2024-04-01T00:00:00Z",
          endDate: "2024-06-30T23:59:59Z",
          finalizationDeadline: "2024-07-15T23:59:59Z"
        },
        application: {
          id: "a1b2c3d4-5678-1234-9abc-def567890123",
          kodePermohonan: "APL-2024-0001",
          status: "APPROVED",
          jenisPermohonan: "Pengangkutan",
          tipeSurat: "B3 Transport Permit",
          tanggalPengajuan: "2024-04-10T00:00:00Z",
          vehicles: [
            {
              id: "v1b2c3d4-5678-1234-9abc-def567890789",
              noPolisi: "B1234XYZ",
              modelKendaraan: "Truck",
              tahunPembuatan: 2022,
              nomorRangka: "NMR1234567890",
              nomorMesin: "ENG1234567890"
            }
          ]
        },
        company: {
          id: "c1b2c3d4-5678-1234-9abc-def567890456",
          name: "PT Transportasi B3",
          penanggungJawab: "Andi Surya",
          alamatKantor: "Jl. Industri No. 10, Jakarta",
          telpKantor: "021-1234567",
          npwp: "01.234.567.8-901.000",
          bidangUsaha: "Pengangkutan B3"
        },
        vehicle: {
          id: "v1b2c3d4-5678-1234-9abc-def567890789",
          noPolisi: "B1234XYZ",
          modelKendaraan: "Truck",
          tahunPembuatan: 2022,
          nomorRangka: "NMR1234567890",
          nomorMesin: "ENG1234567890"
        },
        pengangkutanDetails: [
          {
            id: "d1b2c3d4-5678-1234-9abc-def567890222",
            b3SubstanceId: "b3e45679-1234-4abc-9def-5678abcdef12",
            b3Substance: {
              id: "b3e45679-1234-4abc-9def-5678abcdef12",
              dataBahanB3Id: "db1c2d3e4f5g6h7i8j9k",
              namaBahanKimia: "Asam Sulfat",
              fasaB3: "Cair",
              jenisKemasan: "Tangki"
            },
            jumlahB3: 1500,
            perusahaanAsalMuat: [
              {
                id: "am1b2c3d4-5678-1234-9abc-def567890333",
                companyId: "company123-1234-5678-9012-abcdef123456",
                namaPerusahaan: "PT Asal Muat",
                alamat: "Jl. Industri No. 1, Jakarta",
                latitude: -6.21462,
                longitude: 106.84513,
                locationType: "warehouse"
              }
            ],
            perusahaanTujuanBongkar: [
              {
                id: "tb1b2c3d4-5678-1234-9abc-def567890444",
                companyId: "company456-7890-1234-5678-abcdef654321",
                namaPerusahaan: "PT Tujuan Bongkar",
                alamat: "Jl. Logistik No. 5, Surabaya",
                latitude: -7.25044,
                longitude: 112.76884,
                locationType: "port"
              }
            ]
          }
        ],
        createdAt: "2024-05-01T12:00:00Z",
        updatedAt: "2024-05-15T12:00:00Z"
      }
    }
  })
  @ApiResponse({ status: 404, description: 'Report not found.' })
  async getReportById(@Param('id') id: string) {
    return this.pelaporanService.getReportById(id);
  }

  @Get('search')
  @ApiOperation({ summary: 'Search for reports based on filters' })
  @ApiBody({
    description: 'Filters for searching reports',
    type: SearchPelaporanPengakutanDto,
    examples: {
      example1: {
        summary: 'Example search with various filters',
        value: {
          applicationId: "123e4567-e89b-12d3-a456-426614174000",
          periodId: "123e4567-e89b-12d3-a456-426614174001",
          bulan: 5,
          tahun: 2024,
          vehicleIds: ["v1b2c3d4-5678-1234-9abc-def567890789"],
          b3SubstanceIds: ["b3e45679-1234-4abc-9def-5678abcdef12"],
          longitudeAsalMuat: 106.84513,
          latitudeAsalMuat: -6.21462,
          longitudeTujuanBongkar: 112.76884,
          latitudeTujuanBongkar: -7.25044
        }
      }
    }
  })
  @ApiResponse({
    status: 200,
    description: 'Reports have been successfully retrieved.',
    schema: {
      example: {
        data: [
          {
            id: "r1b2c3d4-5678-1234-9abc-def567890111",
            applicationId: "a1b2c3d4-5678-1234-9abc-def567890123",
            companyId: "c1b2c3d4-5678-1234-9abc-def567890456",
            vehicleId: "v1b2c3d4-5678-1234-9abc-def567890789",
            bulan: 5,
            tahun: 2024,
            isDraft: false,
            period: {
              id: "p1b2c3d4-5678-1234-9abc-def567890000",
              name: "Q2 2024",
              startDate: "2024-04-01T00:00:00Z",
              endDate: "2024-06-30T23:59:59Z",
              finalizationDeadline: "2024-07-15T23:59:59Z"
            },
            application: {
              id: "a1b2c3d4-5678-1234-9abc-def567890123",
              kodePermohonan: "APL-2024-0001",
              status: "APPROVED",
              vehicles: [
                {
                  id: "v1b2c3d4-5678-1234-9abc-def567890789",
                  noPolisi: "B1234XYZ",
                  modelKendaraan: "Truck",
                  tahunPembuatan: 2022
                }
              ],
              company: {
                id: "c1b2c3d4-5678-1234-9abc-def567890456",
                name: "PT Transportasi B3"
              }
            },
            company: {
              id: "c1b2c3d4-5678-1234-9abc-def567890456",
              name: "PT Transportasi B3",
              alamatKantor: "Jl. Industri No. 10, Jakarta"
            },
            vehicle: {
              id: "v1b2c3d4-5678-1234-9abc-def567890789",
              noPolisi: "B1234XYZ",
              modelKendaraan: "Truck",
              tahunPembuatan: 2022
            },
            pengangkutanDetails: [
              {
                id: "d1b2c3d4-5678-1234-9abc-def567890222",
                b3Substance: {
                  id: "b3e45679-1234-4abc-9def-5678abcdef12",
                  namaBahanKimia: "Asam Sulfat",
                  fasaB3: "Cair",
                  jenisKemasan: "Tangki"
                },
                jumlahB3: 1500,
                perusahaanAsalMuat: [
                  {
                    id: "am1b2c3d4-5678-1234-9abc-def567890333",
                    namaPerusahaan: "PT Asal Muat",
                    alamat: "Jl. Industri No. 1, Jakarta",
                    latitude: -6.21462,
                    longitude: 106.84513
                  }
                ],
                perusahaanTujuanBongkar: [
                  {
                    id: "tb1b2c3d4-5678-1234-9abc-def567890444",
                    namaPerusahaan: "PT Tujuan Bongkar",
                    alamat: "Jl. Logistik No. 5, Surabaya",
                    latitude: -7.25044,
                    longitude: 112.76884
                  }
                ]
              }
            ],
            createdAt: "2024-05-01T12:00:00Z",
            updatedAt: "2024-05-15T12:00:00Z"
          }
        ],
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1
      }
    }
  })
  async searchReports(@Query() params: SearchPelaporanPengakutanDto) {
    return this.pelaporanService.searchReports(params);
  }

  @Roles(RolesAccess.PIC_PELAPORAN, RolesAccess.PENGELOLA, RolesAccess.SUPER_ADMIN)
  @Put('update/pengakutan-detail/:detailId')
  @ApiOperation({ summary: 'Update a specific detail in a report' })
  @ApiParam({ name: 'detailId', description: 'The ID of the detail to update' })
  @ApiBody({
    description: 'Data to update the detail',
    type: UpdatePengangkutanDetailDto,
    examples: {
      example1: {
        summary: 'Example Update Request',
        value: {
          b3SubstanceId: "b3e45679-1234-4abc-9def-5678abcdef12",
          jumlahB3: 2000,
          perusahaanAsalMuat: [
            "company123-1234-5678-9012-abcdef123456",
            "company789-4321-8765-1098-abcdef654321"
          ],
          perusahaanTujuanBongkar: [
            "company456-7890-1234-5678-abcdef654321",
            "company987-6543-2109-8765-abcdef123098"
          ]
        }
      }
    }
  })
  @ApiResponse({
    status: 200,
    description: 'Detail updated successfully.',
    schema: {
      example: {
        id: "d1b2c3d4-5678-1234-9abc-def567890222",
        b3SubstanceId: "b3e45679-1234-4abc-9def-5678abcdef12",
        jumlahB3: 2000,
        perusahaanAsalMuat: [
          "company123-1234-5678-9012-abcdef123456",
          "company789-4321-8765-1098-abcdef654321"
        ],
        perusahaanTujuanBongkar: [
          "company456-7890-1234-5678-abcdef654321",
          "company987-6543-2109-8765-abcdef123098"
        ],
        updatedAt: "2024-05-15T12:00:00Z"
      }
    }
  })
  @ApiResponse({ status: 404, description: 'Detail not found.' })
  async updatePengangkutanDetail(
    @Param('detailId') detailId: string,
    @Body() data: UpdatePengangkutanDetailDto,
  ) {
    return this.pelaporanService.updatePengangkutanDetail(detailId, data);
  }
  
  @Roles(RolesAccess.PIC_PELAPORAN, RolesAccess.PENGELOLA, RolesAccess.SUPER_ADMIN)
  @Delete('delete/pengakutan-detail/:detailId')
  @ApiOperation({ summary: 'Delete a specific detail in a report' })
  @ApiParam({ name: 'detailId', description: 'The ID of the detail to delete' })
  @ApiResponse({
    status: 200,
    description: 'Detail deleted successfully.',
    schema: {
      example: {
        message: 'Detail deleted successfully',
        detailId: "d1b2c3d4-5678-1234-9abc-def567890222"
      }
    }
  })
  @ApiResponse({ status: 404, description: 'Detail not found.' })
  async deletePengangkutanDetailFromReport(@Param('detailId') detailId: string) {
    await this.pelaporanService.deletePengangkutanDetailFromReport(detailId);
    return {
      message: 'Detail deleted successfully',
      detailId: detailId
    };
  }

  @Roles(RolesAccess.PIC_PELAPORAN, RolesAccess.PENGELOLA, RolesAccess.SUPER_ADMIN)
  @Post('finalize/:companyId/:periodId/:applicationId')
  @ApiOperation({ summary: 'Finalisasi laporan untuk periode dan aplikasi tertentu' })
  @ApiParam({ name: 'companyId', description: 'ID perusahaan' })
  @ApiParam({ name: 'periodId', description: 'ID periode' })
  @ApiParam({ name: 'applicationId', description: 'ID aplikasi' })
  @ApiResponse({
    status: 200,
    description: 'Laporan berhasil difinalisasi',
    schema: {
      example: {
        message: 'Laporan dan detail berhasil difinalisasi.',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Batas waktu finalisasi telah berakhir atau ada kesalahan validasi',
  })
  @ApiResponse({
    status: 404,
    description: 'Periode, laporan, atau kendaraan tidak ditemukan',
  })
  async finalizeReport(
    @Param('companyId') companyId: string,
    @Param('periodId') periodId: string,
    @Param('applicationId') applicationId: string,
  ) {
    try {
      return await this.pelaporanService.finalizeReport(companyId, periodId, applicationId);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException('Data tidak ditemukan.');
      }
      if (error instanceof BadRequestException) {
        throw new BadRequestException('Permintaan tidak valid. Harap periksa kembali data yang dikirim.');
      }
      throw new BadRequestException('Terjadi kesalahan saat memproses permintaan.');
    }
  }

  @Roles(RolesAccess.PIC_PELAPORAN, RolesAccess.SUPER_ADMIN)
  @Put('review/:id')
  @ApiOperation({ summary: 'Review and update the status of a report' })
  @ApiParam({ name: 'id', description: 'ID of the report to review' })
  @ApiBody({
    description: 'Data for reviewing the report',
    type: ReviewPelaporanBahanB3Dto,
    examples: {
      example1: {
        summary: 'Example Review Request',
        value: {
          status: 'DISETUJUI',
          adminNote: 'Laporan sudah diverifikasi dan disetujui.'
        }
      },
      example2: {
        summary: 'Example Rejection Request',
        value: {
          status: 'DITOLAK',
          adminNote: 'Data tidak lengkap, harap lengkapi kembali.'
        }
      }
    }
  })
  @ApiResponse({
    status: 200,
    description: 'Report reviewed successfully.',
    schema: {
      example: {
        message: 'Laporan berhasil disetujui.'
      }
    }
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid request or report is not finalized.',
  })
  @ApiResponse({
    status: 404,
    description: 'Report not found.',
  })
  async reviewReport(
    @Param('id') reportId: string,
    @Body() data: ReviewPelaporanBahanB3Dto,
  ) {
    try {
      return await this.pelaporanService.reviewReport(reportId, data);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException('Laporan tidak ditemukan.' + error);
      }
      if (error instanceof BadRequestException) {
        throw new BadRequestException('Permintaan tidak valid atau laporan belum difinalisasi.'+ error);
      }
      throw new BadRequestException('Terjadi kesalahan saat memproses permintaan.'+ error);
    }
  }
}
