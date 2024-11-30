import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../services/prisma.services'; // Import your Prisma service
import * as fs from 'fs';
import * as path from 'path'; // For handling file paths
import { connect } from 'http2';

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

    try {
      await this.seedCompany();
    } catch (error) {
      this.logger.error('Error while seeding company data', error);
    }

    try {
      await this.seedRegistrasi();
    } catch (error) {
      this.logger.error('Error while seeding registrasi data', error);
    }

    try {
      await this.seedRoles();
    } catch (error) {
      this.logger.error('Error while seeding Roles data', error);
    }

    try {
      await this.seedPersyaratan();
    } catch (error) {
      this.logger.error('Error while seeding persyaratan data', error);
    }

    try {
      await this.seedDataTembusan();
    } catch (error) {
      this.logger.error('Error while seeding persyaratan data', error);
    }

    try {
      await this.seedDataBahanB3();
    } catch (error) {
      this.logger.error('Error while seeding persyaratan data', error);
    }

    try {
      await this.seedIdentitasApplication();
    } catch (error) {
      this.logger.error('Error while seeding persyaratan data', error);
    }

    try {
      await this.seedApplication();
    } catch (error) {
      this.logger.error('Error while seeding persyaratan data', error);
    }

    try {
      await this.seedBahanb3reg();
    } catch (error) {
      this.logger.error('Error while seeding persyaratan data', error);
    }

    try {
      await this.seedSektorPenggunaanBahan();
    } catch (error) {
      this.logger.error('Error while seeding persyaratan data', error);
    }

    try {
      await this.seedPelabuhan();
    } catch (error) {
      this.logger.error('Error while seeding pelabuhan data', error);
    }

    try {
      await this.validasiTeknisRegistrasi();
    } catch (error) {
      this.logger.error('Error while seeding validasi teknis data', error);
    }

    try {
      await this.seedPeriod();
    } catch (error) {
      this.logger.error('Error while seeding period data', error);
    }

    try {
      await this.seedPenggunaanFinal();
    } catch (error) {
      this.logger.error('Error while seeding penggunaan data', error);
    }

    try {
      await this.seedDistribusiFinal()
    } catch (error) {
      this.logger.error('Error while seeding distribusi data', error);
    }

    try {
      await this.seedDihasilkanFinal()
    } catch (error) {
      this.logger.error('Error while seeding dihasilkan data', error);
    }

    this.logger.log('Seeding process completed');
  }


  async seedMercuryMonitoringEndp() {
    try {
      await this.seedMercuryMonitoring();
    } catch (error) {
      this.logger.error('Error while seeding MercuryMonitoring data', error);
    }
  }

  async seedRegistrasiEndp() {
    try {
      await this.seedRegistrasi();
    } catch (error) {
      this.logger.error('Error while seeding registrasi data', error);
    }
  }

  private async seedProvinces() {
    const filePath = path.join(process.cwd(), 'src/seed/provinces.json');
    const provincesData = this.readJsonFile(filePath);

    await this.prisma.province.createMany({
      data: provincesData,
      skipDuplicates: true, // This ensures that existing records are skipped
    });
    this.logger.log('Provinces seeded');
  }

  private async seedPelabuhan() {
    const filePath = path.join(process.cwd(), 'src/seed/data_pelabuhan.json');
    const pelabuhanData = this.readJsonFile(filePath);

    await this.prisma.dataPelabuhan.createMany({
      data: pelabuhanData,
      skipDuplicates: true, // This ensures that existing records are skipped
    });
    this.logger.log('Pelabuhan seeded');
  }

  private async seedRegencies() {
    const filePath = path.join(process.cwd(), 'src/seed/regencies.json');
    const regenciesData = this.readJsonFile(filePath);

    await this.prisma.regencies.createMany({
      data: regenciesData,
      skipDuplicates: true, // Skip duplicate entries
    });
    this.logger.log('Regencies seeded');
  }

  private async seedDistricts() {
    const filePath = path.join(process.cwd(), 'src/seed/districts.json');
    const districtsData = this.readJsonFile(filePath);

    await this.prisma.districts.createMany({
      data: districtsData,
      skipDuplicates: true, // This ensures that existing records are skipped
    });
    this.logger.log('Districts seeded');
  }

  private async seedCompany() {
    const filePath = path.join(process.cwd(), 'src/seed/company.json');
    const companyData = this.readJsonFile(filePath);

    await this.prisma.company.createMany({
      data: companyData,
      skipDuplicates: true, // This ensures that existing records are skipped
    });
    this.logger.log('Company seeded');
  }

  private async seedRegistrasi() {
    const filePath = path.join(process.cwd(), 'src/seed/registrasi.json');
    const registrasiData = this.readJsonFile(filePath);

    await this.prisma.registrasi.createMany({
      data: registrasiData,
      skipDuplicates: true, // This ensures that existing records are skipped
    });
    this.logger.log('Regitrasi seeded');
  }

  private async seedRoles() {
    const filePath = path.join(process.cwd(), 'src/seed/roles.json');
    const rolesData = this.readJsonFile(filePath);

    await this.prisma.roles.createMany({
      data: rolesData,
      skipDuplicates: true, // This ensures that existing records are skipped
    });
    this.logger.log('Roles seeded');
  }

  private async seedPersyaratan() {
    const filePath = path.join(process.cwd(), 'src/seed/persyaratan.json');
    const persyaratanData = this.readJsonFile(filePath);

    await this.prisma.persyaratan.createMany({
      data: persyaratanData,
      skipDuplicates: true, // This ensures that existing records are skipped
    });
    this.logger.log('Persyaratan seeded');
  }

  private async seedDataTembusan() {
    const filePath = path.join(process.cwd(), 'src/seed/dataTembusan.json');
    const data = this.readJsonFile(filePath);

    await this.prisma.dataTembusan.createMany({
      data,
      skipDuplicates: true, // This ensures that existing records are skipped
    });
    this.logger.log('Data Tembusan seeded');
  }

  private async seedIdentitasApplication() {
    const filePath = path.join(
      process.cwd(),
      'src/seed/identitasApplication.json',
    );
    const data = this.readJsonFile(filePath);

    await this.prisma.identitasApplication.createMany({
      data,
      skipDuplicates: true, // This ensures that existing records are skipped
    });
    this.logger.log('Data Identitas Application seeded');
  }

  private async seedApplication() {
    const filePath = path.join(process.cwd(), 'src/seed/application.json');
    const data = this.readJsonFile(filePath);

    await this.prisma.application.createMany({
      data,
      skipDuplicates: true, // This ensures that existing records are skipped
    });
    this.logger.log('Data Application seeded');
  }

  private async seedDataBahanB3() {
    const filePath = path.join(process.cwd(), 'src/seed/dataBahanB3.json');
    const data = this.readJsonFile(filePath);

    await this.prisma.dataBahanB3.createMany({
      data,
      skipDuplicates: true, // This ensures that existing records are skipped
    });
    this.logger.log('Data dataBahanB3 seeded');
  }

  private async seedB3subtance() {
    const filePath = path.join(process.cwd(), 'src/seed/b3subtance.json');
    const data = this.readJsonFile(filePath);

    await this.prisma.b3Substance.createMany({
      data,
      skipDuplicates: true, // This ensures that existing records are skipped
    });
    this.logger.log('Data b3subtance seeded');
  }

  private async seedSektorPenggunaanBahan() {
    const filePath = path.join(
        process.cwd(),
        'src/seed/sektorPenggunaanBahanB3.json',
    );
    const data = this.readJsonFile(filePath);

    await this.prisma.sektorPenggunaanB3.createMany({
      data,
      skipDuplicates: true, // This ensures that existing records are skipped
    });
    this.logger.log('Data sektorPenggunaanBahanB3 seeded');
  }

  private async seedBahanb3reg() {
    const filePath = path.join(process.cwd(), 'src/seed/bahanb3reg.json');
    const data = this.readJsonFile(filePath);

    await this.prisma.bahanB3Registrasi.createMany({
      data,
      skipDuplicates: true, // This ensures that existing records are skipped
    });
    this.logger.log('Data bahanb3reg seeded');
  }

  private async seedPeriod() {
    const filePath = path.join(process.cwd(), 'src/seed/period.json');
    const data = this.readJsonFile(filePath);

    await this.prisma.period.createMany({
      data,
      skipDuplicates: true, // This ensures that existing records are skipped
    });
    this.logger.log('Data period seeded');
  }

  private async seedPenggunaanFinal() {
    const filePath = path.join(process.cwd(), 'src/seed/penggunaan_final.json');
    const data = this.readJsonFile(filePath);

    await this.prisma.pelaporanPenggunaanBahanB3Final.createMany({
      data,
      skipDuplicates: true, // This ensures that existing records are skipped
    });
    this.logger.log('Data penggunaan final seeded');
  }

  private async seedDihasilkanFinal() {
    const filePath = path.join(process.cwd(), 'src/seed/dihasilkan_final.json');
    const data = this.readJsonFile(filePath);

    await this.prisma.pelaporanB3DihasilkanFinal.createMany({
      data,
      skipDuplicates: true, // This ensures that existing records are skipped
    });
    this.logger.log('Data dihasilkan final seeded');
  }

  private async seedDistribusiFinal() {
    const filePath = path.join(process.cwd(), 'src/seed/distribusi_final.json');
    const data = this.readJsonFile(filePath);

    await this.prisma.pelaporanBahanB3DistribusiFinal.createMany({
      data,
      skipDuplicates: true, // This ensures that existing records are skipped
    });
    this.logger.log('Data distribusi final seeded');
  }

  private async seedVillages() {
    const filePath = path.join(process.cwd(), 'src/seed/villages.json');
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

  private async validasiTeknisRegistrasi() {
    const filePath = path.join(process.cwd(), 'src/seed/validasiTeknisRegistrasi.json');
    const data = this.readJsonFile(filePath);

    await this.prisma.validasiTeknisRegistrasi.createMany({
      data,
      skipDuplicates: true, // This ensures that existing records are skipped
    });
    this.logger.log('Data ValidasiTeknisRegistrasi seeded');
  }

  // Function to get villages without district
  public async getVillagesWithoutDistrict(): Promise<any[]> {
    // Paths to the JSON files
    const villagesFilePath = path.join(process.cwd(), 'src/seed/villages.json');
    const regenciesFilePath = path.join(
      process.cwd(),
      'src/seed/districts.json',
    );

    // Load the data from JSON files
    const villagesData = this.readJsonFile(villagesFilePath);
    const regenciesData = this.readJsonFile(regenciesFilePath);

    // Create a Set of all district IDs in the regencies data
    const regenciesIds = new Set(
      regenciesData.map((regency: any) => regency.id),
    );

    // Filter villages that don't have a matching district ID in regencies
    const villagesWithoutDistrict = villagesData.filter(
      (village: any) => !regenciesIds.has(village.districtId),
    );
    // Get distinct district IDs
    const distinctDistrictIds = [
      ...new Set(
        villagesWithoutDistrict.map((village: any) => village.districtId),
      ),
    ];
    return distinctDistrictIds;
  }
    // Fungsi untuk menghasilkan tanggal acak dalam tahun yang diberikan
    private getRandomDateInYear(year: number): Date {
      const start = new Date(`${year}-01-01`).getTime();
      const end = new Date(`${year}-12-31`).getTime();
      const randomTime = start + Math.random() * (end - start);
      return new Date(randomTime);
    }
  

  private async seedMercuryMonitoring() {
    const filePath = path.join(process.cwd(), 'src/seed/mercury_monitoring.json');
    const mercuryData = this.readJsonFile(filePath);

    try {
      for (const record of mercuryData) {
        try{
           // Temukan jenis sampel berdasarkan kode
        const jenisSampel = await this.prisma.jenisSample.findFirst({
          where: { deskripsi: {
             mode: 'insensitive',
             equals: record["Jenis_Sampel"],
          } },
        });

        const province = await this.prisma.province.findFirst({
          where: { name: {
             mode: 'insensitive',
             equals: record["Provinsi"],
          } },
        });

        const city = await this.prisma.regencies.findFirst({
          where: { name: {
             mode: 'insensitive',
             equals: record["Kab_Kota"],
          } },
        });

        const district = await this.prisma.districts.findFirst({
          where: { name: {
             mode: 'insensitive',
             equals: record["KEC"],
          } },
        });
        
        const village = await this.prisma.village.findFirst({
          where: { name: {
             mode: 'insensitive',
             equals: record["DESA"],
          } },
        });

        if (!jenisSampel) {
          console.error(`Jenis sampel dengan kode ${record["Jenis_Sampel"]} tidak ditemukan. Skipping...`);
          continue;
        }

        // Hasilkan tanggal acak untuk tahun pengambilan
        const randomTanggalPengambilan = this.getRandomDateInYear(record["THN_SMPL"]);


        // Buat entri MercuryMonitoring bersama dengan Location dalam satu operasi
        await this.prisma.mercuryMonitoring.create({
          data: {
            sumberData: record["Sumber_Data"],
            jenisSampel: { connect: { id: jenisSampel.id } },
            tahunPengambilan: randomTanggalPengambilan,
            hasilKadar: record["KADAR"]?.toString(),
            satuan: record["SATUAN"] ?? "N/A",
            tingkatKadar: record["TK_MERKURI"] ?? "N/A",
            konsentrasi: record["KONSNTRASI"] ?? "N/A",
            location: {
              create: {
                latitude: record.Y,
                longitude: record.X,
                description: record["DESA"],
                province: province ? { connect: { id: province.id } } : undefined,
                regency: city ? { connect: { id: city.id } } : undefined,
                district: district ?  {connect: { id: district.id }} : undefined,
                village: village ? {connect: { id: village.id }} : undefined,
                keterangan: record["TK_MERKURI"],
              },
            },
          },
        });
        console.log(`Inserted MercuryMonitoring for sample ${record["Jenis_Sampel"]} at location ${record["DESA"]}`);

        }catch(error){
        console.log(`Failed to MercuryMonitoring for sample ${record["Jenis_Sampel"]} at location ${record["Provinsi"]} ${record["Kab_Kota"]} ${record["KEC"]} ${record["DESA"]}`);

        }
       
      }
    } catch (error) {
      console.error('Error during MercuryMonitoring seeding:', error);
    }
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
