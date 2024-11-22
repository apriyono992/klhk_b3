import { Controller, Post, Body, UsePipes, ValidationPipe, UploadedFiles, UseInterceptors, UseFilters, Get, Query, BadRequestException, Param, NotFoundException, Put, HttpStatus, HttpException, Delete, UseGuards } from '@nestjs/common';
import { MercuryMonitoringService } from '../services/mercuryMonitoring.services';
import { CreateMercuryMonitoringDto } from '../models/createMercuryMonitoringDto';
import { ApiTags, ApiOperation, ApiResponse, ApiConsumes, ApiBody, ApiParam } from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { UploadResult } from 'src/models/uploadResult';
import { ValidationFilter } from 'src/utils/response.filter';
import { uploadPhotoFilesToDisk } from 'src/utils/uploadPhotoFileToDisk';
import { IsPhotoValidFile } from 'src/validators/photoFileType.validator';
import { MercuryMonitoringFilterDto } from 'src/models/searchMercuryMonitoringDto';
import { UpdateMercuryMonitoringDto } from 'src/models/updateMercuyMonitoringDto';
import { JwtAuthGuard } from 'src/utils/auth.guard';
import { RolesGuard } from 'src/utils/roles.guard';
import { PublicApiGuard } from 'src/utils/public.guard';

@UseGuards(JwtAuthGuard, RolesGuard)
@ApiTags('Mercury Monitoring')
@Controller('mercury-monitoring')
@UseFilters(ValidationFilter)
export class MercuryMonitoringController {
  constructor(
    private readonly mercuryMonitoringService: MercuryMonitoringService,
    private readonly isPhotoValidFile: IsPhotoValidFile, 
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new Mercury Monitoring record' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Create Mercury Monitoring Data',
    type: CreateMercuryMonitoringDto,
  })
  @ApiResponse({
    status: 201,
    description: 'Record created successfully.',
    schema: {
      example: {
        success: true,
        data: {
          mercuryMonitoring: {
            id: 'monitoring123',
            jenisSampelId: 'sample123',
            tahunPengambilan: 2024,
            hasilKadar: 2.5,
            satuan: 'mg/L',
            peskLocationId: 'location123',
            warehouseLocationId: 'location456',
          },
          locations: {
            peskLocation: {
              province: 'Province A',
              regency: 'Regency A',
              district: 'District A',
              village: 'Village A',
            },
            warehouseLocation: {
              province: 'Province B',
              regency: 'Regency B',
              district: 'District B',
              village: 'Village B',
            },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Bad request or validation failed.' })
  @ApiResponse({ status: 404, description: 'Sample or Baku Mutu not found.' })
  @UseInterceptors(FilesInterceptor('photos'))  // Handle the file uploads from the 'photos' field
  async create(
    @UploadedFiles() photos: Array<Express.Multer.File>,  // Uploaded photos
    @Body() createMercuryMonitoringDto: CreateMercuryMonitoringDto,  // DTO data
  ) {
    // 1. Handle the uploaded photos
    let uploadedFiles: UploadResult[] = [];

    this.isPhotoValidFile.validateAndThrow(photos);

    if (photos && photos.length > 0) {
      // Handle file saving using your utility function
      uploadedFiles = uploadPhotoFilesToDisk(photos);
    }

    // 2. Call the service to create the Mercury Monitoring record
    return await this.mercuryMonitoringService.create(createMercuryMonitoringDto, uploadedFiles);
  }

  @Get('search-mercury-monitoring')
  @ApiOperation({ summary: 'Get mercury monitoring data with filters' })
  @ApiResponse({
    status: 200,
    description: 'Filtered mercury monitoring data retrieved successfully.',
    schema: {
      example: [
        {
          id: 'monitoring123',
          tahunPengambilan: 2024,
          hasilKadar: 2.5,
          satuan: 'mg/L',
          peskLocation: {
            province: 'Province A',
            regency: 'Regency A',
            district: 'District A',
            village: 'Village A',
          },
          warehouseLocation: {
            province: 'Province B',
            regency: 'Regency B',
            district: 'District B',
            village: 'Village B',
          },
          photoUrls: [
            'https://api.example.com/uploads/photos/photo1.jpg',
            'https://api.example.com/uploads/photos/photo2.jpg',
          ],
        },
      ],
    },
  })
  @ApiResponse({ status: 400, description: 'Bad request or invalid filters.' })
  async getMercuryMonitoringList(
    @Query() filterDto: MercuryMonitoringFilterDto,
  ) {
    try {
      // Call service to get filtered results
      return await this.mercuryMonitoringService.getFilteredMercuryMonitoring(filterDto);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get('search-mercury-monitoring-geo-json')
  @UseGuards(PublicApiGuard)
  @ApiOperation({ summary: 'Get mercury monitoring data with filters' })
  @ApiResponse({
    status: 200,
    description: 'Filtered mercury monitoring data retrieved successfully.',
    schema: {
      example: [
        {
          id: 'monitoring123',
          tahunPengambilan: 2024,
          hasilKadar: 2.5,
          satuan: 'mg/L',
          peskLocation: {
            province: 'Province A',
            regency: 'Regency A',
            district: 'District A',
            village: 'Village A',
          },
          warehouseLocation: {
            province: 'Province B',
            regency: 'Regency B',
            district: 'District B',
            village: 'Village B',
          },
          photoUrls: [
            'https://api.example.com/uploads/photos/photo1.jpg',
            'https://api.example.com/uploads/photos/photo2.jpg',
          ],
        },
      ],
    },
  })
  @ApiResponse({ status: 400, description: 'Bad request or invalid filters.' })
  async getFilteredMercuryMonitoringGeoJson(
    @Query() filterDto: MercuryMonitoringFilterDto,
  ) {
    try {
      // Call service to get filtered results
      return await this.mercuryMonitoringService.getFilteredMercuryMonitoringGeoJson(filterDto);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
  

   // Method to search for mercury monitoring data by ID
   @Get(':id')
   @ApiOperation({ summary: 'Get mercury monitoring by ID' })
   @ApiParam({ name: 'id', description: 'Mercury Monitoring ID' })
   @ApiResponse({
     status: 200,
     description: 'Mercury monitoring data retrieved successfully.',
     schema: {
       example: {
         id: 'monitoring123',
         tahunPengambilan: 2024,
         hasilKadar: 2.5,
         satuan: 'mg/L',
         peskLocation: {
           province: 'Province A',
           regency: 'Regency A',
           district: 'District A',
           village: 'Village A',
         },
         warehouseLocation: {
           province: 'Province B',
           regency: 'Regency B',
           district: 'District B',
           village: 'Village B',
         },
         photoUrls: [
           'https://api.example.com/uploads/photos/photo1.jpg',
           'https://api.example.com/uploads/photos/photo2.jpg',
         ],
       },
     },
   })
   @ApiResponse({ status: 404, description: 'Mercury Monitoring not found.' })
   async getMercuryMonitoringById(@Param('id') id: string) {
     const result = await this.mercuryMonitoringService.getMercuryMonitoringById(id);
     if (!result) {
       throw new NotFoundException(`Mercury Monitoring with id ${id} not found`);
     }
     return result;
   }

    /**
   * Update Mercury Monitoring data
   */
  @Put(':id')
  @ApiOperation({ summary: 'Update Mercury Monitoring data' })
  @ApiParam({ name: 'id', description: 'ID of the Mercury Monitoring record', type: 'string', example: 'monitoring123' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Update Mercury Monitoring data',
    type: UpdateMercuryMonitoringDto,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Data monitoring merkuri berhasil diperbarui.',
    schema: {
      example: {
        success: true,
        message: 'Data monitoring merkuri berhasil diperbarui.',
        data: {
          id: 'monitoring123',
          jenisSampelId: 'sample123',
          bakuMutuLingkunganId: 'qualityStandard456',
          tahunPengambilan: '2023-08-14T00:00:00.000Z',
          hasilKadar: '0.05',
          satuan: 'mg/L',
          tingkatKadar: 'Low',
          konsentrasi: 'Safe',
          latitude: -6.2088,
          longitude: 106.8456,
          keterangan: 'Tambang Emas Rakyat',
          provinceId: 'province123',
          regencyId: 'regency123',
          districtId: 'district123',
          villageId: 'village123',
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Data monitoring merkuri tidak ditemukan.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Gagal memperbarui data monitoring merkuri. Silakan coba lagi atau hubungi admin.',
  })
  @UseInterceptors(FilesInterceptor('photos'))
  async update(
    @Param('id') id: string,
    @Body() updateMercuryMonitoringDto: UpdateMercuryMonitoringDto,
    @UploadedFiles() files?: Express.Multer.File[],
  ) {
    try {
      const result = await this.mercuryMonitoringService.update(id, updateMercuryMonitoringDto, files);
      return {
        statusCode: HttpStatus.OK,
        success: true,
        message: 'Data monitoring merkuri berhasil diperbarui.',
        data: result,
      };
    } catch (error) {
      throw new HttpException(
        'Gagal memperbarui data monitoring merkuri. Silakan coba lagi atau hubungi admin.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**
   * Delete Mercury Monitoring data
   */
  @Delete(':id')
  @ApiOperation({ summary: 'Delete Mercury Monitoring data' })
  @ApiParam({ name: 'id', description: 'ID of the Mercury Monitoring record', type: 'string', example: 'monitoring123' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Data monitoring merkuri berhasil dihapus.',
    schema: {
      example: {
        success: true,
        message: 'Data monitoring merkuri berhasil dihapus.',
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Data monitoring merkuri tidak ditemukan.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Gagal menghapus data monitoring merkuri. Silakan coba lagi atau hubungi admin.',
  })
  async delete(@Param('id') id: string) {
    try {
      const result = await this.mercuryMonitoringService.delete(id);
      return {
        statusCode: HttpStatus.OK,
        success: true,
        message: 'Data monitoring merkuri berhasil dihapus.',
        data: result,
      };
    } catch (error) {
      throw new HttpException(
        'Gagal menghapus data monitoring merkuri. Silakan coba lagi atau hubungi admin.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
