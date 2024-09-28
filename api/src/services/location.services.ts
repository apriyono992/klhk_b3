import { Injectable } from '@nestjs/common';
import { PrismaService } from '../services/prisma.services'; // Import your Prisma service


@Injectable()
export class LocationService {
  constructor(private readonly prisma: PrismaService) {}

  // Helper function to clean whitespace in name fields
  private cleanNames<T extends { name: string }>(items: T[]): T[] {
    return items.map((item) => ({
      ...item,
      name: item.name.trim(), // Trim whitespace from the name
    }));
  }

  // Fetch all provinces with cleaned names
  async getProvinces() {
    const provinces = await this.prisma.province.findMany();
    return this.cleanNames(provinces); // Clean whitespace
  }

  // Fetch regencies, optionally filtered by provinceId, with cleaned names
  async getRegencies(provinceId?: string) {
    const regencies = await this.prisma.regencies.findMany({
      where: provinceId ? { provinceId } : {},
    });
    return this.cleanNames(regencies); // Clean whitespace
  }

  // Fetch districts, optionally filtered by regencyId, with cleaned names
  async getDistricts(regencyId?: string) {
    const districts = await this.prisma.districts.findMany({
      where: regencyId ? { regencyId } : {},
    });
    return this.cleanNames(districts); // Clean whitespace
  }

  // Fetch villages, optionally filtered by districtId, with cleaned names
  async getVillages(districtId?: string) {
    const villages = await this.prisma.village.findMany({
      where: districtId ? { districtId } : {},
    });
    return this.cleanNames(villages); // Clean whitespace
  }
}