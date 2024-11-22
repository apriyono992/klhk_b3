import {
    Controller,
    Get,
    Param,
    Query,
    NotFoundException,
    UploadedFiles,
    Body,
    Post,
    UseInterceptors,
    Put,
    Delete,
    UseGuards,
  } from '@nestjs/common';
  import { ApiOperation, ApiParam, ApiResponse, ApiConsumes, ApiBody, ApiTags } from '@nestjs/swagger';
import { CreateWprDto, UpdateWprDto } from 'src/models/createWprDto';
import { SearchWprDto } from 'src/models/searchWrpDto';
import { WprService } from 'src/services/wpr.services';
import { IsPhotoValidFile } from 'src/validators/photoFileType.validator';
import * as fs from 'fs';
import { BadRequestException } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { UploadResult } from 'src/models/uploadResult';
import { uploadPhotoFilesToDisk } from 'src/utils/uploadPhotoFileToDisk';
import { RolesGuard } from 'src/utils/roles.guard';
import { JwtAuthGuard } from 'src/utils/auth.guard';
import { RolesAccess } from 'src/models/enums/roles';
import { Roles } from 'src/utils/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@ApiTags('WIlayah Pertambangan Rakyat')
@Controller('wpr')
export class Wprontroller {
constructor(private readonly wrpService: WprService,  private readonly isPhotoValidFile: IsPhotoValidFile) {}
    
    @Roles(RolesAccess.PIC_REKOMENDASI, RolesAccess.PIC_CMS, RolesAccess.SUPER_ADMIN)
    @Post()
    @ApiConsumes('multipart/form-data')
    @ApiOperation({ summary: 'Buat Wilayah Pertambangan Rakyat baru' })
    @ApiResponse({
      status: 201,
      description: 'Wilayah Pertambangan Rakyat berhasil dibuat',
        schema: {
            example: {
            message: 'Wilayah Pertambangan Rakyat berhasil dibuat',
            data: {
                id: '12345',
                sumberData: 'PESK',
                tahunPengambilan: '2024-05-10T00:00:00.000Z',
                status: 'Berizin',
                luasWilayah: 150.0,
                polygon: 'POLYGON((106.8456 -6.2088, 106.8457 -6.2090, 106.8460 -6.2085, 106.8456 -6.2088))',
                photos: [
                {
                    id: 'photo1',
                    originalFileName: 'photo1.jpg',
                    fileName: 'photo1-uuid.jpg',
                    url: '/uploads/photo1-uuid.jpg',
                }]
            }
            }
        },
    })
    @UseInterceptors(FilesInterceptor('photos'))
    async createWrp(
        @UploadedFiles() photos: Express.Multer.File[],
        @Body() createDocumentDto: CreateWprDto ,
        ) {
        let uploadedFiles: UploadResult[] = [];
    
        // Validate the files
        this.isPhotoValidFile.validateAndThrow(photos);
    
        // If attachments are valid and present, upload the files
        if (photos && photos.length > 0) {
            // Upload files to disk and generate the file metadata
            uploadedFiles = uploadPhotoFilesToDisk(photos);
            try {
            return await this.wrpService.createWpr(createDocumentDto, uploadedFiles);
            } catch (error) {
            this.handleDocumentsFileDeletion(uploadedFiles);
            throw error;
            }
        } else {
            throw new BadRequestException('No files were uploaded.');
        }
    }

    @Roles(RolesAccess.PIC_REKOMENDASI, RolesAccess.PIC_CMS, RolesAccess.SUPER_ADMIN)
    @Put(':id')
    @ApiOperation({ summary: 'Update Wilayah Pertambangan Rakyat' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        description: 'Update Wilayah Pertambangan Rakyat dengan metadata dan foto',
        schema: {
        type: 'object',
        properties: {
            id: {
            type: 'string',
            example: '12345',
            },
            sumberData: {
            type: 'string',
            example: 'PESK',
            },
            tahunPengambilan: {
            type: 'string',
            format: 'date-time',
            example: '2024-05-10T00:00:00.000Z',
            },
            status: {
            type: 'string',
            enum: ['Berizin', 'Tidak Berizin'],
            },
            luasWilayah: {
            type: 'number',
            example: 150.0,
            },
            polygon: {
            type: 'string',
            example: 'POLYGON((106.8456 -6.2088, 106.8457 -6.2090, 106.8460 -6.2085, 106.8456 -6.2088))',
            },
            deletePhotoIds: {
            type: 'array',
            items: { type: 'string' },
            example: ['photo1', 'photo2'],
            },
            photos: {
            type: 'array',
            items: {
                type: 'string',
                format: 'binary',
            },
            },
        },
        },
    })
    @UseInterceptors(FilesInterceptor('photos'))
    async updateWpr(
        @Param('id') id: string,
        @Body() updateDto: UpdateWprDto,
        @UploadedFiles() photos: Express.Multer.File[],
    ) {
        let uploadedFiles: UploadResult[] = [];

        // Validasi file foto
        this.isPhotoValidFile.validateAndThrow(photos);

        // Upload file jika ada
        if (photos && photos.length > 0) {
        uploadedFiles = uploadPhotoFilesToDisk(photos);
        }

        try {
        return await this.wrpService.updateWpr(id, updateDto, uploadedFiles, updateDto.deletePhotoIds);
        } catch (error) {
        // Hapus file yang diupload jika terjadi error
        this.handleDocumentsFileDeletion(uploadedFiles);
            throw new BadRequestException('Error updating WPR');
        }
    }
    
        
    @Get('find/:id')
    @ApiOperation({ summary: 'Dapatkan detail WPR berdasarkan ID' })
    @ApiParam({
        name: 'id',
        description: 'ID dari Wilayah Pertambangan Rakyat',
        example: '12345',
    })
    @ApiResponse({
        status: 200,
        description: 'Detail Wilayah Pertambangan Rakyat ditemukan',
        schema: {
        example: {
            id: '12345',
            sumberData: 'PESK',
            tahunPengambilan: '2024-05-10T00:00:00.000Z',
            status: 'Berizin',
            luasWilayah: 150.0,
            polygon: 'POLYGON((106.8456 -6.2088, 106.8457 -6.2090, 106.8460 -6.2085, 106.8456 -6.2088))',
            photos: [
            {
                id: 'photo1',
                originalFileName: 'photo1.jpg',
                fileName: 'photo1-uuid.jpg',
                url: '/uploads/photo1-uuid.jpg',
                author: 'admin',
            },
            ],
            location: {
            id: 'location123',
            village: { id: 'village123', name: 'Desa A' },
            district: { id: 'district123', name: 'Kecamatan B' },
            regency: { id: 'regency123', name: 'Kabupaten C' },
            province: { id: 'province123', name: 'Provinsi D' },
            latitude: -6.2088,
            longitude: 106.8456,
            keterangan: 'Area Tambang Aktif',
            },
            createdAt: '2024-05-10T00:00:00.000Z',
            updatedAt: '2024-05-12T00:00:00.000Z',
        },
        },
    })
    @ApiResponse({
        status: 404,
        description: 'Wilayah Pertambangan Rakyat tidak ditemukan',
        schema: {
        example: {
            statusCode: 404,
            message: 'Wilayah Pertambangan Rakyat dengan ID 12345 tidak ditemukan.',
            error: 'Not Found',
        },
        },
    })
    async getWprById(@Param('id') id: string) {
        return this.wrpService.getWprById(id);
    }

    @Roles(RolesAccess.PIC_REKOMENDASI, RolesAccess.PIC_CMS, RolesAccess.SUPER_ADMIN)
    @Delete(':id')
    @ApiOperation({ summary: 'Hapus Wilayah Pertambangan Rakyat berdasarkan ID' })
    @ApiResponse({
        status: 200,
        description: 'Wilayah Pertambangan Rakyat berhasil dihapus.',
        schema: {
        example: {
            message: 'Wilayah Pertambangan Rakyat dengan ID 12345 berhasil dihapus.',
        },
        },
    })
    @ApiResponse({
        status: 404,
        description: 'Wilayah Pertambangan Rakyat tidak ditemukan.',
        schema: {
        example: {
            statusCode: 404,
            message: 'Wilayah Pertambangan Rakyat dengan ID 12345 tidak ditemukan.',
            error: 'Not Found',
        },
        },
    })
    @ApiResponse({
        status: 400,
        description: 'Gagal menghapus file foto dari disk.',
        schema: {
        example: {
            statusCode: 400,
            message: 'Gagal menghapus file foto dengan nama photo1.jpg dari disk.',
            error: 'Bad Request',
        },
        },
    })
    async deleteWpr(@Param('id') id: string) {
        return this.wrpService.deleteWpr(id);
    }
  
    @Get('search')
    @ApiOperation({ summary: 'Cari Wilayah Pertambangan Rakyat dengan filter' })
    @ApiResponse({
      status: 200,
      description: 'Daftar Wilayah Pertambangan Rakyat yang ditemukan',
      schema: {
        example: {
          data: [
            {
              id: 'wpr123',
              sumberData: 'PESK',
              tahunPengambilan: '2024-05-10T00:00:00.000Z',
              status: 'Berizin',
              luasWilayah: 150.0,
              polygon: 'POLYGON((106.8456 -6.2088, 106.8457 -6.2090, 106.8460 -6.2085, 106.8456 -6.2088))',
              photos: [
                {
                  id: 'photo1',
                  originalFileName: 'photo1.jpg',
                  fileName: 'photo1-uuid.jpg',
                  url: '/uploads/photo1-uuid.jpg',
                },
              ],
              location: {
                province: { id: 'province123', name: 'Provinsi A' },
                regency: { id: 'regency123', name: 'Kabupaten B' },
                district: { id: 'district123', name: 'Kecamatan C' },
                village: { id: 'village123', name: 'Desa D' },
              },
              createdAt: '2024-05-10T00:00:00.000Z',
              updatedAt: '2024-05-12T00:00:00.000Z',
            },
          ],
          total: 1,
        },
      },
    })
    async searchWpr(@Query() searchDto: SearchWprDto) {
      return this.wrpService.searchWpr(searchDto);
    }

    @Get('search-geojson')
    @ApiOperation({ summary: 'Cari Wilayah Pertambangan Rakyat dengan filter dalam format GeoJSON' })
    @ApiResponse({
    status: 200,
    description: 'Daftar Wilayah Pertambangan Rakyat dalam format GeoJSON',
    schema: {
        example: {
        type: 'FeatureCollection',
        features: [
            {
            type: 'Feature',
            geometry: {
                type: 'Polygon',
                coordinates: [
                [
                    [106.8456, -6.2088],
                    [106.8457, -6.2090],
                    [106.8460, -6.2085],
                    [106.8456, -6.2088],
                ],
                ],
            },
            properties: {
                id: 'wpr123',
                sumberData: 'PESK',
                tahunPengambilan: '2024-05-10T00:00:00.000Z',
                status: 'Berizin',
                luasWilayah: 150.0,
                photos: [
                {
                    id: 'photo1',
                    originalFileName: 'photo1.jpg',
                    fileName: 'photo1-uuid.jpg',
                    url: '/uploads/photo1-uuid.jpg',
                },
                ],
                location: {
                province: { id: 'province123', name: 'Provinsi A' },
                regency: { id: 'regency123', name: 'Kabupaten B' },
                district: { id: 'district123', name: 'Kecamatan C' },
                village: { id: 'village123', name: 'Desa D' },
                },
                createdAt: '2024-05-10T00:00:00.000Z',
                updatedAt: '2024-05-12T00:00:00.000Z',
            },
            },
        ],
        },
    },
    })
    @ApiResponse({
    status: 400,
    description: 'Permintaan tidak valid',
    schema: {
        example: {
        statusCode: 400,
        message: 'Tanggal mulai tidak boleh setelah tanggal akhir',
        error: 'Bad Request',
        },
    },
    })
    @ApiResponse({
    status: 404,
    description: 'Wilayah Pertambangan Rakyat tidak ditemukan',
    schema: {
        example: {
        statusCode: 404,
        message: 'Wilayah Pertambangan Rakyat tidak ditemukan',
        error: 'Not Found',
        },
    },
    })
    async searchGeoJson(@Query() searchDto: SearchWprDto) {
    return this.wrpService.searchWprGeoJson(searchDto);
    }

      // Handle the deletion of files if there's an error during upload
    private handleDocumentsFileDeletion(uploadedFiles: UploadResult[]) {
        uploadedFiles.forEach((file) => {
        const filePath = `/uploads/photos/${file.filename}`;
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath); // Remove the file from the disk
        }
        });
    }
  }
  