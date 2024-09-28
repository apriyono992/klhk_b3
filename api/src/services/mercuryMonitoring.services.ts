import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from './prisma.services';
import { CreateMercuryMonitoringDto } from '../models/createMercuryMonitoringDto';
import { Express } from 'express';  // For file type
import { UploadResult } from 'src/models/uploadResult';
import { MercuryMonitoringFilterDto } from 'src/models/searchMercuryMonitoringDto';
import { LocationType } from 'src/models/enums/locationType';

@Injectable()
export class MercuryMonitoringService {
  constructor(private prisma: PrismaService) {}

  // Create a new MercuryMonitoring record
  async create(createMercuryMonitoringDto: CreateMercuryMonitoringDto, files: UploadResult[]): Promise<any> {
    const {
      jenisSampelId,
      bakuMutuLingkunganId,
      tahunPengambilan,
      hasilKadar,
      satuan,
      tingkatKadar,
      konsentrasi,
      peskLatitude,
      peskLongitude,
      warehouseLatitude,
      warehouseLongitude,
      peskProvinceId,
      peskRegencyId,
      peskDistrictId,
      peskVillageId,
      warehouseProvinceId,
      warehouseRegencyId,
      warehouseDistrictId,
      warehouseVillageId,
    } = createMercuryMonitoringDto;

    // Create the MercuryMonitoring record
    const mercuryMonitoring = await this.prisma.mercuryMonitoring.create({
      data: {
        jenisSampelId: jenisSampelId ?? null,
        bakuMutuLingkunganId: bakuMutuLingkunganId ?? null,
        tahunPengambilan: tahunPengambilan,
        hasilKadar: hasilKadar,
        satuan: satuan,
        tingkatKadar: tingkatKadar,
        konsentrasi: konsentrasi,
        peskLocationId: peskLatitude && peskLongitude ? 
        await this.createLocation(peskLatitude, peskLongitude, peskProvinceId, peskRegencyId, peskDistrictId, peskVillageId) : null,
        warehouseLocationId: warehouseLatitude && warehouseLongitude ? 
        await this.createLocation(warehouseLatitude, warehouseLongitude, warehouseProvinceId, warehouseRegencyId, warehouseDistrictId, warehouseVillageId) : null,
      },
    });

    // Handle photos upload if provided
    if (files && files.length > 0) {
      for (const file of files) {
        // Save the photo to the database
        await this.prisma.photo.create({
          data: {
            url: `uploads/photos/${file.filename}`,
            author: 'Admin',  // Save the final path to the database
            mercuryId: mercuryMonitoring.id,  // Relate to the mercury monitoring record
          },
        });
      }
    }

    // Fetch the location details to include in the response
    const peskLocation = await this.getLocationDetails(mercuryMonitoring.peskLocationId);
    const warehouseLocation = await this.getLocationDetails(mercuryMonitoring.warehouseLocationId);

    return {
      success: true,
      data: {
        mercuryMonitoring,
        locations: {
          peskLocation,
          warehouseLocation,
        },
      },
    };
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
    if (!locationType) {
      // If no locationType or "both", include both peskLocation and warehouseLocation
      locationConditions.push({ peskLocation: { AND: locationFilter } });
      locationConditions.push({ warehouseLocation: { AND: locationFilter } });
    } else if (locationType === LocationType.PESK) {
      // If locationType is "pesk", filter by peskLocation
      locationConditions.push({ peskLocation: { AND: locationFilter } });
    } else if (locationType === LocationType.WAREHOUSE) {
      // If locationType is "warehouse", filter by warehouseLocation
      locationConditions.push({ warehouseLocation: { AND: locationFilter } });
    }
  
    if (locationConditions.length > 0) {
      whereClause.OR = locationConditions;
    }
  
    // Query the database with the filters
    const mercuryMonitoringRecords = await this.prisma.mercuryMonitoring.findMany({
      where: whereClause,
      include: {
        photos: true,
        peskLocation: {
          include: {
            province: true,
            regency: true,
            district: true,
            village: true,
          },
        },
        warehouseLocation: {
          include: {
            province: true,
            regency: true,
            district: true,
            village: true,
          },
        },
      },
    });

    return mercuryMonitoringRecords.map(record => ({
      ...record,
      photoUrls: record.photos.map(photo => `${process.env.API_BASE_URL}/${photo.url}`),
      peskLocation: {
        province: record.peskLocation?.province?.name,
        regency: record.peskLocation?.regency?.name,
        district: record.peskLocation?.district?.name,
        village: record.peskLocation?.village?.name,
      },
      warehouseLocation: {
        province: record.warehouseLocation?.province?.name,
        regency: record.warehouseLocation?.regency?.name,
        district: record.warehouseLocation?.district?.name,
        village: record.warehouseLocation?.village?.name,
      },
    }));
  }
  
  async getMercuryMonitoringById(id: string): Promise<any> {
    const mercuryMonitoring = await this.prisma.mercuryMonitoring.findUnique({
      where: { id },
      include: {
        photos: true,
        peskLocation: {
          include: {
            province: true,
            regency: true,
            district: true,
            village: true,
          },
        },
        warehouseLocation: {
          include: {
            province: true,
            regency: true,
            district: true,
            village: true,
          },
        },
      },
    });
  
    if (!mercuryMonitoring) {
      throw new NotFoundException(`MercuryMonitoring with id ${id} not found`);
    }

  
    return {
      ...mercuryMonitoring,
      photoUrls: mercuryMonitoring.photos.map(photo => `${process.env.API_BASE_URL}/${photo.url}`), 
      peskLocation: {
        province: mercuryMonitoring.peskLocation?.province?.name,
        regency: mercuryMonitoring.peskLocation?.regency?.name,
        district: mercuryMonitoring.peskLocation?.district?.name,
        village: mercuryMonitoring.peskLocation?.village?.name,
      },
      warehouseLocation: {
        province: mercuryMonitoring.warehouseLocation?.province?.name,
        regency: mercuryMonitoring.warehouseLocation?.regency?.name,
        district: mercuryMonitoring.warehouseLocation?.district?.name,
        village: mercuryMonitoring.warehouseLocation?.village?.name,
      },
    };
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
      province: location.province?.name || null,
      regency: location.regency?.name || null,
      district: location.district?.name || null,
      village: location.village?.name || null,
    };
  }
}