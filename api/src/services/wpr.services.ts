import * as fs from 'fs';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from './prisma.services';
import { CreateWprDto } from 'src/models/createWprDto';
import { UploadResult } from 'src/models/uploadResult';
import { SearchWprDto } from 'src/models/searchWrpDto';

@Injectable()
export class WprService {
    constructor(private readonly prisma: PrismaService) {
        // Initialization code here
    }

    async createWpr(dto: CreateWprDto, uploadedFiles: UploadResult[]) {
        let photosData = [];
    
        // Validasi file upload
        if (uploadedFiles && uploadedFiles.length > 0) {
          photosData = uploadedFiles.map((file) => ({
            originalName: file.originalname,
            fileName: file.filename,
            url: file.path,
            author: 'admin',
          }));
        }
    
        let locationData;
        locationData = {
            create: {
              provinceId: dto.provinceId,
              regencyId: dto.regencyId,
              districtId: dto.districtId,
              villageId: dto.villageId,
              longitude: dto.longitude,
              latitude: dto.latitude,
              keterangan: dto.keterangan,
            },
        };
    
    
        try {
          // Buat record WPR
          const wpr = await this.prisma.wilayahPertambanganRakyat.create({
            data: {
              sumberData: dto.sumberData,
              tahunPengambilan: dto.tahunPengambilan,
              status: dto.status,
              luasWilayah: dto.luasWilayah,
              location: locationData,
              polygon: dto.polygon,
              photos: {
                create: photosData,
              },
            },
          });
    
          return {
            message: 'Wilayah Pertambangan Rakyat berhasil dibuat',
            data: wpr,
          };
        } catch (error) {
          throw new BadRequestException(`Gagal membuat Wilayah Pertambangan Rakyat`);
        }
    }

    async updateWpr(id: string, dto: Partial<CreateWprDto>, uploadedFiles: UploadResult[], deletePhotoIds: string[]) {
        // Cek apakah WPR dengan ID tersebut ada
        const existingWpr = await this.prisma.wilayahPertambanganRakyat.findUnique({
          where: { id },
          include: { photos: true },
        });
    
        if (!existingWpr) {
          throw new NotFoundException(`Wilayah Pertambangan Rakyat dengan ID ${id} tidak ditemukan.`);
        }
    
        // Menghapus foto jika `deletePhotoIds` diberikan
        if (deletePhotoIds && deletePhotoIds.length > 0) {
          const photosToDelete = await this.prisma.photo.findMany({
            where: { id: { in: deletePhotoIds } },
          });
    
          if (photosToDelete.length === 0) {
            throw new NotFoundException(`Foto yang ingin dihapus tidak ditemukan.`);
          }
    
          // Hapus file dari sistem
          for (const photo of photosToDelete) {
            if (fs.existsSync(photo.url)) {
              try {
                fs.unlinkSync(photo.url);
              } catch (err) {
                throw new BadRequestException(`Gagal menghapus file foto dari disk.`);
              }
            }
          }
    
          // Hapus record foto dari database
          await this.prisma.photo.deleteMany({
            where: { id: { in: deletePhotoIds } },
          });
        }
    
        // Persiapkan data foto baru jika ada
        let photosData = [];
        if (uploadedFiles && uploadedFiles.length > 0) {
          photosData = uploadedFiles.map((file) => ({
            originalFileName: file.originalname,
            fileName: file.filename,
            url: file.path,
            author: 'admin',
          }));
        }
    
        // Update data WPR
        const updatedWpr = await this.prisma.wilayahPertambanganRakyat.update({
          where: { id },
          data: {
            sumberData: dto.sumberData || undefined,
            tahunPengambilan: dto.tahunPengambilan || undefined,
            status: dto.status || undefined,
            luasWilayah: dto.luasWilayah || undefined,
            polygon: dto.polygon || undefined,
            location: {
                update:{
                    data:{
                        keterangan: dto.keterangan || undefined,
                        longitude: dto.longitude || undefined,
                        latitude: dto.latitude || undefined,
                        villageId: dto.villageId || undefined,
                        provinceId: dto.provinceId || undefined,
                        regencyId: dto.regencyId || undefined,
                        
                    }
                }
            },
            photos: photosData.length > 0
              ? {
                  create: photosData,
                }
              : undefined,
          },
        });
    
        return {
          message: 'Wilayah Pertambangan Rakyat berhasil di-update',
          data: updatedWpr,
        };
    }

    async deleteWpr(id: string) {
      // Cek apakah WPR dengan ID tersebut ada
      const existingWpr = await this.prisma.wilayahPertambanganRakyat.findUnique({
        where: { id },
        include: { photos: true },
      });
  
      if (!existingWpr) {
        throw new NotFoundException(`Wilayah Pertambangan Rakyat dengan ID ${id} tidak ditemukan.`);
      }
  
      // Menghapus foto terkait dari disk
      for (const photo of existingWpr.photos) {
        if (fs.existsSync(photo.url)) {
          try {
            fs.unlinkSync(photo.url);
          } catch (err) {
            throw new BadRequestException(`Gagal menghapus file foto dengan nama ${photo.fileName} dari disk.`);
          }
        }
      }
  
      // Hapus foto dari database
      await this.prisma.photo.deleteMany({
        where: { id: { in: existingWpr.photos.map((photo) => photo.id) } },
      });
  
      // Hapus WPR dari database
      await this.prisma.wilayahPertambanganRakyat.delete({
        where: { id },
      });
  
      return {
        message: `Wilayah Pertambangan Rakyat dengan ID ${id} berhasil dihapus.`,
      };
    }

    // Get WPR by ID
    async getWprById(id: string) {
        const wpr = await this.prisma.wilayahPertambanganRakyat.findUnique({
        where: { id },
        include: {
            photos: true,
            location: {include:{village:true,district:true,regency:true,province:true}},
        },
        });

        if (!wpr) {
        throw new NotFoundException(`Wilayah Pertambangan Rakyat dengan ID ${id} tidak ditemukan.`);
        }

        return wpr;
    }

    async searchWpr(searchDto: SearchWprDto) {
        const {
          provinceId,
          regencyId,
          districtId,
          villageId,
          status,
          startDate,
          endDate,
          minArea,
          maxArea,
          returnAll,
          page, limit, sortBy, sortOrder
        } = searchDto;
    
        // Build query conditions
        const whereConditions: any = {
          AND: [
            provinceId ? { location: { provinceId } } : {},
            regencyId ? { location: { regencyId } } : {},
            districtId ? { location: { districtId } } : {},
            villageId ? { location: { villageId } } : {},
            status ? { status } : {},
            startDate && endDate ? { tahunPengambilan: { gte: startDate, lte: endDate } } : {},
            minArea ? { luasWilayah: { gte: minArea } } : {},
            maxArea ? { luasWilayah: { lte: maxArea } } : {},
          ],
        };
    
        // Tentukan apakah akan menggunakan paginasi atau tidak
        const queryOptions: any = {
          where: whereConditions,
          include: {
            photos: true,
            location: {include:{village:true,district:true,regency:true,province:true}},

          },
          orderBy: { [sortBy]: sortOrder },
        };
    
        if (!returnAll) {
          queryOptions.skip = (page - 1) * limit;
          queryOptions.take = limit;
        }
    
        // Query data dari Prisma
        const [data, total] = await Promise.all([
          this.prisma.wilayahPertambanganRakyat.findMany(queryOptions),
          this.prisma.wilayahPertambanganRakyat.count({ where: whereConditions }),
        ]);
    
        return {
          total,
          page: returnAll ? 1 : page,
          limit: returnAll ? total : limit,
          data,
        };
  }

  // Metode untuk mencari WPR dan mengembalikannya dalam format GeoJSON
  async searchWprGeoJson(searchDto: SearchWprDto) {
    const {
      provinceId,
      regencyId,
      districtId,
      villageId,
      status,
      startDate,
      endDate,
      minArea,
      maxArea,
      returnAll = true,
      page,
      limit,
      sortBy,
      sortOrder,
    } = searchDto;

    // Membangun filter berdasarkan DTO
    const filters: any = {
      AND: [],
    };

    if (provinceId) filters.AND.push({ location: { provinceId } });
    if (regencyId) filters.AND.push({ location: { regencyId } });
    if (districtId) filters.AND.push({ location: { districtId } });
    if (villageId) filters.AND.push({ location: { villageId } });
    if (status) filters.AND.push({ status });
    if (startDate || endDate) {
      filters.AND.push({
        tahunPengambilan: {
          gte: startDate ? new Date(startDate) : undefined,
          lte: endDate ? new Date(endDate) : undefined,
        },
      });
    }
    if (minArea || maxArea) {
      filters.AND.push({
        luasWilayah: {
          gte: minArea ?? undefined,
          lte: maxArea ?? undefined,
        },
      });
    }

    // Konfigurasi paginasi
    const pagination = returnAll
    ? {}
    : {
        skip: (page - 1) * limit,
        take: limit,
      };

    // Query ke database
    const wprList = await this.prisma.wilayahPertambanganRakyat.findMany({
    where: filters,
    include: {
      location: {
        include: {
          village: true,
          district: true,
          regency: true,
          province: true,
        },
      },
      photos: true,
    },
    orderBy: {
      [sortBy]: sortOrder,
    },
    ...(pagination as { skip?: number; take?: number }),
    });

    // Mengubah data menjadi format GeoJSON
    const geoJson = {
      type: 'FeatureCollection',
      features: wprList.map((wpr) => ({
        type: 'Feature',
        geometry: {
          type: 'Polygon',
          coordinates: JSON.parse(wpr.polygon as string).coordinates ?? [],
        },
        properties: {
          id: wpr.id,
          sumberData: wpr.sumberData,
          tahunPengambilan: wpr.tahunPengambilan,
          status: wpr.status,
          luasWilayah: wpr.luasWilayah,
          province: wpr.location?.province?.name,
          regency: wpr.location?.regency?.name,
          district: wpr.location?.district?.name,
          village: wpr.location?.village?.name,
          photos: wpr.photos.map((photo) => photo.url), // Menambahkan URL foto
          keretrakan: wpr.location?.keterangan,
        },
      })),
    };

    return geoJson;
  }
}