import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from './prisma.services';
import { CreateMercuryMonitoringDto } from '../models/createMercuryMonitoringDto';
import { Express } from 'express';  // For file type
import { UploadResult } from 'src/models/uploadResult';
import { MercuryMonitoringFilterDto } from 'src/models/searchMercuryMonitoringDto';
import { LocationType } from 'src/models/enums/locationType';
import { UpdateMercuryMonitoringDto } from 'src/models/updateMercuyMonitoringDto';

@Injectable()
export class MercuryMonitoringService {
  constructor(private prisma: PrismaService) {}

 // Method untuk membuat Mercury Monitoring baru
  async create(createMercuryMonitoringDto: CreateMercuryMonitoringDto, files: UploadResult[]): Promise<any> {
    const {
      jenisSampelId,
      bakuMutuLingkunganId,
      tahunPengambilan,
      hasilKadar,
      satuan,
      tingkatKadar,
      konsentrasi,
      keterangan,
      longitude,
      latitude,
      provinceId,
      districtId,
      regencyId,
      villageId,
      sumberData
    } = createMercuryMonitoringDto;

    try {
      // Membuat record MercuryMonitoring
      const mercuryMonitoring = await this.prisma.mercuryMonitoring.create({
        data: {
          jenisSampel: { connect: { id: jenisSampelId } },
          bakuMutuLingkungan: { connect: { id: bakuMutuLingkunganId } },
          tahunPengambilan,
          hasilKadar,
          satuan,
          tingkatKadar,
          konsentrasi,
          sumberData,
          location: {
            create: {
              longitude,
              latitude,
              provinceId,
              regencyId,
              districtId,
              villageId,
              keterangan,
            },
          },
        },
      });

      // Mengunggah foto jika ada
      if (files && files.length > 0) {
        for (const file of files) {
          await this.prisma.photo.create({
            data: {
              url: `uploads/photos/${file.filename}`,
              author: 'Admin',
              mercuryId: mercuryMonitoring.id,
            },
          });
        }
      }

      // Mengembalikan respons sukses
      return {
        success: true,
        message: 'Data monitoring merkuri berhasil disimpan.',
        data: mercuryMonitoring,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Gagal menyimpan data monitoring merkuri. Silakan coba lagi atau hubungi admin.',
      };
    }
  }

  // Method untuk memperbarui Mercury Monitoring
  async update(
    id: string,
    updateMercuryMonitoringDto: UpdateMercuryMonitoringDto,
    files?: UploadResult[],
  ): Promise<any> {
    const {
      jenisSampelId,
      bakuMutuLingkunganId,
      tahunPengambilan,
      hasilKadar,
      satuan,
      tingkatKadar,
      konsentrasi,
      keterangan,
      longitude,
      latitude,
      provinceId,
      districtId,
      regencyId,
      villageId,
      sumberData
    } = updateMercuryMonitoringDto;

    try {
      // Periksa apakah record MercuryMonitoring dengan ID tersebut ada
      const existingRecord = await this.prisma.mercuryMonitoring.findUnique({
        where: { id },
      });

      if (!existingRecord) {
        return {
          success: false,
          message: 'Data monitoring merkuri tidak ditemukan.',
        };
      }

      // Perbarui data MercuryMonitoring
      const updatedRecord = await this.prisma.mercuryMonitoring.update({
        where: { id },
        data: {
          jenisSampel: jenisSampelId ? { connect: { id: jenisSampelId } } : undefined,
          bakuMutuLingkungan: bakuMutuLingkunganId ? {  connect: { id: bakuMutuLingkunganId } } : undefined,
          tahunPengambilan: tahunPengambilan ?? undefined,
          hasilKadar,
          satuan,
          tingkatKadar,
          konsentrasi,
          location: {
            update: {
              longitude,
              latitude,
              provinceId,
              regencyId,
              districtId,
              villageId,
              keterangan,
            },
          },
        },
      });

      // Mengunggah foto baru jika ada
      if (files && files.length > 0) {
        // Menghapus foto lama yang terkait dengan MercuryMonitoring (opsional)
        await this.prisma.photo.deleteMany({
          where: { mercuryId: id },
        });

        // Simpan foto baru
        for (const file of files) {
          await this.prisma.photo.create({
            data: {
              url: `uploads/photos/${file.filename}`,
              author: 'Admin',
              mercuryId: updatedRecord.id,
            },
          });
        }
      }

      // Mengembalikan respons sukses
      return {
        success: true,
        message: 'Data monitoring merkuri berhasil diperbarui.',
        data: updatedRecord,
      };
    } catch (error) {
      // Menangani error dengan respons yang lebih jelas
      console.error('Error saat memperbarui data monitoring merkuri:', error);

      return {
        success: false,
        message: 'Gagal memperbarui data monitoring merkuri. Silakan coba lagi atau hubungi admin.',
        error: error.message,
      };
    }
  }

  async getFilteredMercuryMonitoring(filterDto: MercuryMonitoringFilterDto): Promise<any> {
    const {
      provinceId,
      regencyId,
      districtId,
      villageId,
      jenisSampelId,
      bakuMutuLingkunganId,
      tahunPengambilanStart,
      tahunPengambilanEnd,
      konsentrasi,
      tingkatKadar,
      locationType,
      
    } = filterDto;
  
    const whereClause: any = {};
  
    // Apply filters for jenisSampelId, bakuMutuLingkunganId, konsentrasi, etc.
    if (jenisSampelId) whereClause.jenisSampelId = jenisSampelId;
    if (bakuMutuLingkunganId) whereClause.bakuMutuLingkunganId = bakuMutuLingkunganId;
    if (konsentrasi) whereClause.konsentrasi = konsentrasi;
    if (tingkatKadar) whereClause.tingkatKadar = tingkatKadar;
  
    // Apply date range filter for tahunPengambilan
    if (tahunPengambilanStart || tahunPengambilanEnd) {
      whereClause.tahunPengambilan = {};
      if (tahunPengambilanStart) {
        whereClause.tahunPengambilan.gte = tahunPengambilanStart;
      }
      if (tahunPengambilanEnd) {
        whereClause.tahunPengambilan.lte = tahunPengambilanEnd;
      }
    }
  
    // Build location filter
    const locationFilter = {};
    if (provinceId) locationFilter['provinceId'] = provinceId;
    if (regencyId) locationFilter['regencyId'] = regencyId;
    if (districtId) locationFilter['districtId'] = districtId;
    if (villageId) locationFilter['villageId'] = villageId;
  
    // Handle locationType logic
    const locationConditions: any[] = [];
    // if (!locationType) {
    //   // If no locationType or "both", include both peskLocation and warehouseLocation
    //   locationConditions.push({ peskLocation: { AND: locationFilter } });
    //   locationConditions.push({ warehouseLocation: { AND: locationFilter } });
    // } else if (locationType === LocationType.PESK) {
    //   // If locationType is "pesk", filter by peskLocation
    //   locationConditions.push({ peskLocation: { AND: locationFilter } });
    // } else if (locationType === LocationType.WAREHOUSE) {
    //   // If locationType is "warehouse", filter by warehouseLocation
    //   locationConditions.push({ warehouseLocation: { AND: locationFilter } });
    // }
  
    if (locationConditions.length > 0) {
      whereClause.OR = locationConditions;
    }
  
    const mercuryMonitoringRecords = await this.prisma.mercuryMonitoring.findMany({
      where: whereClause,
      select: {
        id: true,
        sumberData: true,
        jenisSampel: {
          include: {
            jenisSampelType: true,
          },
        },
        bakuMutuLingkunganId: true,
        tahunPengambilan: true,
        hasilKadar: true,
        satuan: true,
        tingkatKadar: true,
        konsentrasi: true,
        photos: true,
        location: {
          select: {
            latitude: true,
            longitude: true,
            province: { select: { name: true } },
            regency: { select: { name: true } },
            district: { select: { name: true } },
            village: { select: { name: true } },
          },
        },
      },
    });
    const [total] = await Promise.all([
      this.prisma.mercuryMonitoring.count({ where: whereClause }),
    ]);

    return {
      total,
      page: 1 ,
      limit: total,
      data :  mercuryMonitoringRecords,
    };
  }

  async getFilteredMercuryMonitoringGeoJson(filterDto: MercuryMonitoringFilterDto): Promise<any> {
    const {
      provinceId,
      regencyId,
      districtId,
      villageId,
      jenisSampelId,
      bakuMutuLingkunganId,
      tahunPengambilanStart,
      tahunPengambilanEnd,
      konsentrasi,
      tingkatKadar,
      locationType,
    } = filterDto;
  
    const whereClause: any = {};
  
    // Apply filters for jenisSampelId, bakuMutuLingkunganId, konsentrasi, etc.
    if (jenisSampelId) whereClause.jenisSampelId = jenisSampelId;
    if (bakuMutuLingkunganId) whereClause.bakuMutuLingkunganId = bakuMutuLingkunganId;
    if (konsentrasi) whereClause.konsentrasi = konsentrasi;
    if (tingkatKadar) whereClause.tingkatKadar = tingkatKadar;
  
    // Apply date range filter for tahunPengambilan
    if (tahunPengambilanStart || tahunPengambilanEnd) {
      whereClause.tahunPengambilan = {};
      if (tahunPengambilanStart) {
        whereClause.tahunPengambilan.gte = tahunPengambilanStart;
      }
      if (tahunPengambilanEnd) {
        whereClause.tahunPengambilan.lte = tahunPengambilanEnd;
      }
    }
  
    // Build location filter
    const locationFilter = {};
    if (provinceId) locationFilter['provinceId'] = provinceId;
    if (regencyId) locationFilter['regencyId'] = regencyId;
    if (districtId) locationFilter['districtId'] = districtId;
    if (villageId) locationFilter['villageId'] = villageId;
  
    // Handle locationType logic
    const locationConditions: any[] = [];
    // if (!locationType) {
    //   // If no locationType or "both", include both peskLocation and warehouseLocation
    //   locationConditions.push({ peskLocation: { AND: locationFilter } });
    //   locationConditions.push({ warehouseLocation: { AND: locationFilter } });
    // } else if (locationType === LocationType.PESK) {
    //   // If locationType is "pesk", filter by peskLocation
    //   locationConditions.push({ peskLocation: { AND: locationFilter } });
    // } else if (locationType === LocationType.WAREHOUSE) {
    //   // If locationType is "warehouse", filter by warehouseLocation
    //   locationConditions.push({ warehouseLocation: { AND: locationFilter } });
    // }
  
    if (locationConditions.length > 0) {
      whereClause.OR = locationConditions;
    }
  
    const mercuryMonitoringRecords = await this.prisma.mercuryMonitoring.findMany({
      where: whereClause,
      select: {
        id: true,
        sumberData: true,
        jenisSampel: {
          include: {
            jenisSampelType: true,
          },
        },
        bakuMutuLingkunganId: true,
        tahunPengambilan: true,
        hasilKadar: true,
        satuan: true,
        tingkatKadar: true,
        konsentrasi: true,
        photos: true,
        location: {
          select: {
            latitude: true,
            longitude: true,
            province: { select: { name: true } },
            regency: { select: { name: true } },
            district: { select: { name: true } },
            village: { select: { name: true } },
          },
        },
      },
    });
    
    // Mapping data menjadi format GeoJSON Point
const geoJsonFeatures = mercuryMonitoringRecords
  .filter((record) => {
    // Cek apakah longitude dan latitude tidak null atau undefined
    const longitude = record.location?.longitude;
    const latitude = record.location?.latitude;
    return longitude !== null && longitude !== undefined && latitude !== null && latitude !== undefined;
  })
  .map((record) => ({
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [
        record.location.longitude,
        record.location.latitude,
      ],
    },
    properties: {
      id: record.id,
      sumberData: record.sumberData ?? '',
      jenisSampel: record.jenisSampel?.jenisSampelType?.deskripsi ?? '',
      bakuMutuLingkunganId: record.bakuMutuLingkunganId ?? '',
      tahunPengambilan: record.tahunPengambilan ?? '',
      hasilKadar: record.hasilKadar ?? '',
      satuan: record.satuan ?? '',
      tingkatKadar: record.tingkatKadar ?? '',
      konsentrasi: record.konsentrasi ?? '',
      province: record.location.province?.name ?? '',
      regency: record.location.regency?.name ?? '',
      district: record.location.district?.name ?? '',
      village: record.location.village?.name ?? '',
      photoUrls: (record.photos ?? []).map((photo) => `${process.env.API_BASE_URL}/${photo.url}`),
    },
  }));

  // Menggabungkan data menjadi FeatureCollection
  const geoJsonData = {
    type: 'FeatureCollection',
    features: geoJsonFeatures,
  };

return geoJsonData;
  }
  
  async getMercuryMonitoringById(id: string): Promise<any> {
    const mercuryMonitoring = await this.prisma.mercuryMonitoring.findUnique({
      where: { id },
      include: {
        photos: true,
        
        location:{
          include: {
            province: true,
            regency: true,
            district: true,
            village: true,
          },
        }
      },
    });
  
    if (!mercuryMonitoring) {
      throw new NotFoundException(`MercuryMonitoring with id ${id} not found`);
    }

  
    return {
      ...mercuryMonitoring,
      photoUrls: mercuryMonitoring.photos.map(photo => `${process.env.API_BASE_URL}/${photo.url}`), 
    };
  }

  // Method untuk menghapus data MercuryMonitoring
  async delete(id: string): Promise<any> {
    try {
      // Cek apakah data MercuryMonitoring dengan ID tersebut ada
      const existingRecord = await this.prisma.mercuryMonitoring.findUnique({
        where: { id },
      });

      if (!existingRecord) {
        return {
          success: false,
          message: 'Data monitoring merkuri tidak ditemukan.',
        };
      }

      // Menghapus semua foto yang terkait dengan MercuryMonitoring
      await this.prisma.photo.deleteMany({
        where: { mercuryId: id },
      });

      // Menghapus record MercuryMonitoring
      await this.prisma.mercuryMonitoring.delete({
        where: { id },
      });

      // Mengembalikan respons sukses
      return {
        success: true,
        message: 'Data monitoring merkuri berhasil dihapus.',
      };
    } catch (error) {
      // Menangani error dengan respons yang lebih jelas
      console.error('Error saat menghapus data monitoring merkuri:', error);

      return {
        success: false,
        message: 'Gagal menghapus data monitoring merkuri. Silakan coba lagi atau hubungi admin.',
        error: error.message,
      };
    }
  }
  
  private async createLocation(latitude: number, longitude: number, provinceId: string, regencyId: string, districtId: string, villageId: string) {
    const location = await this.prisma.location.create({
      data: {
        latitude,
        longitude,
        provinceId,
        regencyId,
        districtId,
        villageId,
      },
    });
    return location.id;
  }

  // Fetch the location details, including province, regency, district, and village names
  private async getLocationDetails(locationId: string) {
    if (!locationId) return null;

    const location = await this.prisma.location.findUnique({
      where: { id: locationId },
      include: {
        province: true,
        regency: {
          select: {
            id: true,
            name: true,
          },
        },
        district: {
          select: {
            id: true,
            name: true,
          },
        },
        village: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
    

    console.log(location)

    return {
      id: location.id,
      latitude: location.latitude,
      longitude: location.longitude,
      province: location.province?.name || undefined,
      regency: location.regency?.name || undefined,
      district: location.district?.name || undefined,
      village: location.village?.name || undefined,
    };
  }
}