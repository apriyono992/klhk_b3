import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../services/prisma.services'; // Import your Prisma service
import * as fs from 'fs';
import * as path from 'path'; // For handling file paths

function chunkArray<T>(array: T[], chunkSize: number): T[][] {
  const result = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    result.push(array.slice(i, i + chunkSize));
  }
  return result;
}

@Injectable()
export class SeedService {
  private readonly logger = new Logger(SeedService.name);

  constructor(private prisma: PrismaService) {}

  async seed() {
    try {
      await this.seedProvinces();
    } catch (error) {
      this.logger.error('Error while seeding provinces data', error);
    }

    try {
      await this.seedRegencies();
    } catch (error) {
      this.logger.error('Error while seeding regencies data', error);
    }

    try {
      await this.seedDistricts();
    } catch (error) {
      this.logger.error('Error while seeding districts data', error);
    }

    try {
      await this.seedVillages();
    } catch (error) {
      this.logger.error('Error while seeding villages data', error);
    }

    this.logger.log('Seeding process completed');
  }

  private async seedProvinces() {
    const filePath = path.join(__dirname, '../seed/provinces.json');
    const provincesData = this.readJsonFile(filePath);

    await this.prisma.province.createMany({
      data: provincesData,
      skipDuplicates: true, // This ensures that existing records are skipped
    });
    this.logger.log('Provinces seeded');
  }

  private async seedRegencies() {
    const filePath = path.join(__dirname, '../seed/regencies.json');
    const regenciesData = this.readJsonFile(filePath);

    await this.prisma.regencies.createMany({
      data: regenciesData,
      skipDuplicates: true, // Skip duplicate entries
    });
    this.logger.log('Regencies seeded');
  }

  private async seedDistricts() {
    const filePath = path.join(__dirname, '../seed/districts.json');
    const districtsData = this.readJsonFile(filePath);

    await this.prisma.districts.createMany({
      data: districtsData,
      skipDuplicates: true, // This ensures that existing records are skipped
    });
    this.logger.log('Districts seeded');
  }

  private async seedVillages() {
    const filePath = path.join(__dirname, '../seed/villages.json');
    const villagesData = this.readJsonFile(filePath);

    const chunks = chunkArray(villagesData, 1000); // Chunk into batches of 1000

    for (const chunk of chunks) {
        try {
          await this.prisma.village.createMany({
            data: chunk,
            skipDuplicates: true,
          });
        } catch (error) {
          // Log the error and the data chunk that caused it
          this.logger.error('Error inserting village data', { error });
        }
    }
    this.logger.log('Villages seeded');
  }

  // Function to get villages without district
   public async getVillagesWithoutDistrict(): Promise<any[]> {
    // Paths to the JSON files
    const villagesFilePath = path.join(__dirname, '../seed/villages.json');
    const regenciesFilePath = path.join(__dirname, '../seed/districts.json');

    // Load the data from JSON files
    const villagesData = this.readJsonFile(villagesFilePath);
    const regenciesData = this.readJsonFile(regenciesFilePath);

    // Create a Set of all district IDs in the regencies data
    const regenciesIds = new Set(regenciesData.map((regency: any) => regency.id));

    // Filter villages that don't have a matching district ID in regencies
    const villagesWithoutDistrict = villagesData.filter((village: any) => !regenciesIds.has(village.districtId));
     // Get distinct district IDs
     const distinctDistrictIds = [...new Set(villagesWithoutDistrict.map((village: any) => village.districtId))];
    return distinctDistrictIds;
  }

  private readJsonFile(filePath: string): any[] {
    try {
      const fileContents = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(fileContents);
    } catch (error) {
      this.logger.error(`Failed to read file: ${filePath}`, error);
      return [];
    }
  }
}
