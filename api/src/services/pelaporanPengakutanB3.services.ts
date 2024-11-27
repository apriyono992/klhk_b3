import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from './prisma.services';
import { CreatePelaporanPengangkutanDto } from 'src/models/createPelaporanPengakutanDto';
import { UpdatePelaporanPengangkutanDto } from 'src/models/updatePelaporanPengakutanDto';
import { CreatePengangkutanDetailDto } from 'src/models/createPelaporanPengakutanDetailDto';
import { UpdatePerusahaanAsalMuatDanTujuanDto } from 'src/models/updatePerusahaanAsalDanTujuanB3Dto';
import { CreatePerusahaanAsalMuatDanTujuanDto } from 'src/models/createPerusahaanAsalDanTujuanB3Dto';
import { UpdatePengangkutanDetailDto } from 'src/models/updatePelaporanPengakutanDetailDto';
import { SearchPelaporanPengakutanDto } from 'src/models/searchPelaporanPengakutanDto';
import { SearchBelumPelaporanPengakutanVehicleDto } from 'src/models/searchBelumPelaporanPengakutanVehicleDto';
import { SearchPermohonanRekomBelumDilaporkanDto } from 'src/models/searchPermohonanRekomBelumDilaporkanDto';
import { ReviewPelaporanBahanB3Dto } from 'src/models/reviewPelaporanBahanB3Dto';
import { StatusPengajuan } from 'src/models/enums/statusPengajuanPelaporan';
import { addMonths, format } from 'date-fns';
import { parse } from 'path';
import { JenisPelaporan } from 'src/models/enums/jenisPelaporan';

@Injectable()
export class PelaporanPengangkutanService {
  constructor(private readonly prisma: PrismaService) {}

    async createReport(data: CreatePelaporanPengangkutanDto) {
        const { applicationId, companyId, vehicleId, bulan, tahun, pengangkutanDetails } = data;
        const period = await this.prisma.period.findUnique({ where: { id: data.periodId } });
        if (!period) throw new BadRequestException('Specified period does not exist.');
    
        // Ensure the report is created within the allowed period
        const currentDate = new Date();
        if (currentDate < period.startReportingDate || currentDate > period.endReportingDate) {
          throw new BadRequestException('Current date is outside the reporting period.');
        }

        if (vehicleId === undefined) {
          // Mulai transaksi Prisma
          await this.prisma.$transaction(async (prisma) => {
            // 1. Periksa apakah sudah ada pelaporan untuk `applicationId` dan `periodId`
            const existingReport = await prisma.pelaporanPengangkutan.findFirst({
              where: {
                applicationId,
                periodId: period.id,
              },
            });

            if (existingReport) {
              throw new BadRequestException(
                'Pelaporan sudah dibuat untuk aplikasi ini pada periode yang sama.'
              );
            }

            // 2. Ambil semua kendaraan dari aplikasi
            const vehicles = await prisma.vehicle.findMany({
              where: {
                applications: {
                  some: { applicationId },
                },
              },
              select: { id: true },
            });

            if (vehicles.length === 0) {
              throw new BadRequestException('Tidak ada kendaraan yang ditemukan untuk aplikasi ini.');
            }

            // 3. Ambil periode dan buat array bulan
            const { startPeriodDate, endPeriodDate } = period;
            const months = [];
            let current = new Date(startPeriodDate);

            while (current <= endPeriodDate) {
              const bulan = format(current, 'MM');
              const tahun = format(current, 'yyyy');
              months.push({ bulan, tahun });
              current = addMonths(current, 1);
            }

            // 4. Siapkan data untuk batch insert
            const pelaporanData = [];

            for (const vehicle of vehicles) {
              for (let { bulan, tahun } of months) {
                bulan = parseInt(bulan);
                tahun = parseInt(tahun);
                pelaporanData.push({
                  applicationId,
                  vehicleId: vehicle.id,
                  companyId,
                  bulan,
                  tahun,
                  isDraft: true,
                  periodId: period.id,
                });
              }
            }

            // 5. Lakukan insert menggunakan `createMany`
            await prisma.pelaporanPengangkutan.createMany({
              data: pelaporanData,
              skipDuplicates: true,
            });

            return {mewssage: 'Pelaporan pengangkutan berhasil dibuat untuk semua kendaraan dan bulan dalam periode.'};
          });
        } else {

                  // Check if a report already exists for the same vehicle, month, and year
        const existingReport = await this.prisma.pelaporanPengangkutan.findFirst({
          where: {
              applicationId,
              vehicleId,
              bulan,
              tahun,
          },
          });
  
          if (existingReport) {
          throw new BadRequestException('Report already exists for this application, vehicle, month, and year.');
          }
  
          if (pengangkutanDetails.length === 0) {
            return this.prisma.pelaporanPengangkutan.create({
              data: {
                  applicationId,
                  vehicleId,
                  companyId,
                  bulan,
                  tahun,
                  isDraft: true,
                  periodId: data.periodId,
              },
            });
  
          }else{
  
            return this.prisma.pelaporanPengangkutan.create({
              data: {
                  applicationId,
                  vehicleId,
                  companyId,
                  bulan,
                  tahun,
                  isDraft: true,
                  pengangkutanDetails: {
                    create: pengangkutanDetails.map((detail) => ({
                      b3SubstanceId: detail.b3SubstanceId,
                      jumlahB3: detail.jumlahB3,
                      DataPerusahaanAsalMuatOnPengakutanDetail:
                        detail.perusahaanAsalMuat?.length > 0
                          ? {
                              create: detail.perusahaanAsalMuat.map((asalMuat) => ({
                                perusahaanAsalMuatId: asalMuat,
                              })),
                            }
                          : undefined,
                          DataPerusahaanTujuanBongkarOnPengakutanDetail:
                          detail.perusahaanAsalMuatDanTujuanBongkar?.length > 0
                            ? {
                                create: detail.perusahaanAsalMuatDanTujuanBongkar.flatMap((tujuan) =>
                                  tujuan.perusahaanTujuanBongkar.map((tujuanBongkarDetail) => ({
                                    perusahaanAsalMuatId: tujuan.perusahaanAsalMuatId,
                                    perusahaanTujuanBongkarId: tujuanBongkarDetail.perusahaanTujuanBongkarId,
                                    locationTypeAsalMuat: tujuan.locationType,
                                    longitudeAsalMuat: tujuan.longitudeAsalMuat,
                                    latitudeAsalMuat: tujuan.latitudeAsalMuat,
                                    locationTypeTujuan: tujuanBongkarDetail.locationType,
                                    longitudeTujuan: tujuanBongkarDetail.longitudeTujuanBongkar,
                                    latitudeTujuan: tujuanBongkarDetail.latitudeTujuanBokar,
                                  }))
                                ),
                              }
                            : undefined,
                    })),                  
                  },
                  periodId: data.periodId,
              },
              });
          }
        }
        // Create the report along with the related details
        
    }

    // Update main PelaporanPengangkutan fields with conditional updates
    async updateMainData(id: string, data: UpdatePelaporanPengangkutanDto) {
        // Ensure the PelaporanPengangkutan report exists
        const report = await this.prisma.pelaporanPengangkutan.findUnique({ where: { id } });
        if (!report) throw new NotFoundException('Report not found.');

        // Prepare the update data object only with fields present in the request
        const updateData: any = {};
        if (data.bulan !== undefined) updateData.bulan = data.bulan;
        if (data.tahun !== undefined) updateData.tahun = data.tahun;
        if (data.isDraft !== undefined) updateData.isDraft = data.isDraft;

        // Perform the update with the constructed updateData object
        return this.prisma.pelaporanPengangkutan.update({
            where: { id },
            data: updateData,
        });
    }

    // Method to add a new PengangkutanDetail to a PelaporanPengangkutan
    async addPengangkutanDetail(pelaporanPengangkutanId: string, detailData: CreatePengangkutanDetailDto) {
        // Check if the main report exists
        const report = await this.prisma.pelaporanPengangkutan.findUnique({ where: { id: pelaporanPengangkutanId } });
        if (!report) throw new NotFoundException('Pelaporan pengangkutan not found.');

        // Check for duplicate b3SubstanceId in the current report
        const existingDetail = await this.prisma.pengangkutanDetail.findFirst({
        where: {
            pelaporanPengangkutanId,
            b3SubstanceId: detailData.b3SubstanceId,
        },
        });

        if (existingDetail) {
        throw new BadRequestException('b3SubstanceId already exists for this PelaporanPengangkutan.');
        }

        // Create PengangkutanDetail
        return this.prisma.pengangkutanDetail.create({
        data: {
            pelaporanPengangkutanId,
            b3SubstanceId: detailData.b3SubstanceId,
            jumlahB3: detailData.jumlahB3,
            DataPerusahaanAsalMuatOnPengakutanDetail: detailData?.perusahaanAsalMuat?.length > 0 ?
  
            {
            create: detailData.perusahaanAsalMuat.map((asalMuat) => ({
              perusahaanAsalMuatId: asalMuat,
            })),
            } : undefined,
            DataPerusahaanTujuanBongkarOnPengakutanDetail:
                detailData.perusahaanAsalMuatDanTujuanBongkar?.length > 0
                  ? {
                      create: detailData.perusahaanAsalMuatDanTujuanBongkar?.flatMap((tujuan) =>
                        tujuan.perusahaanTujuanBongkar?.map((tujuanBongkarDetail) => ({
                          perusahaanAsalMuatId: tujuan.perusahaanAsalMuatId,
                          perusahaanTujuanBongkarId: tujuanBongkarDetail.perusahaanTujuanBongkarId,
                          locationTypeAsalMuat: tujuan.locationType,
                          longitudeAsalMuat: tujuan.longitudeAsalMuat,
                          latitudeAsalMuat: tujuan.latitudeAsalMuat,
                          locationTypeTujuan: tujuanBongkarDetail.locationType,
                          longitudeTujuan: tujuanBongkarDetail.longitudeTujuanBongkar,
                          latitudeTujuan: tujuanBongkarDetail.latitudeTujuanBokar,
                        }))
                      ),
                    }
                  : undefined,
        },
        });
    }

    // Update an existing PengangkutanDetail with conditional creation or updates for related companies
    async updatePengangkutanDetail(detailId: string, data: UpdatePengangkutanDetailDto) {
        // Ensure the PengangkutanDetail exists
        const detail = await this.prisma.pengangkutanDetail.findUnique({ where: { id: detailId }, include: { pelaporanPengangkutan: {include:{ company: true}}} });
        if (!detail) throw new NotFoundException('Pengangkutan detail not found.');

        // Prepare the data object, only including fields that are present in the request
        const updateData: any = {};
        if (data.b3SubstanceId) updateData.b3SubstanceId = data.b3SubstanceId;
        if (data.jumlahB3) updateData.jumlahB3 = data.jumlahB3;

        if (data.perusahaanAsalMuat) {
          // Create new PerusahaanAsalMuat records
          updateData.DataPerusahaanAsalMuatOnPengakutanDetail = {
            deleteMany: data.perusahaanAsalMuat
            ? {} : undefined,
            create: data.perusahaanAsalMuat ?  data?.perusahaanAsalMuat?.map((asalMuat) => ({
              perusahaanAsalMuatId: asalMuat ,
            })): undefined,
          };
        }

        if(data.perusahaanTujuanBongkar) {
          // Create new PerusahaanTujuanBongkar records
          updateData.DataPerusahaanTujuanBongkarOnPengakutanDetail = data.perusahaanTujuanBongkar?.length > 0
          ? {
              // Menghapus data berdasarkan pengangkutanDetailId
              deleteMany: {
                pengangkutanDetailId: detailId,
              },
              // Membuat data baru berdasarkan perusahaanTujuanBongkar
              create: data.perusahaanTujuanBongkar.flatMap((tujuan) =>
                tujuan.perusahaanTujuanBongkar?.map((tujuanBongkarId) => ({
                  perusahaanAsalMuatId: tujuan.perusahaanAsalMuatId,
                  perusahaanTujuanBongkarId: tujuanBongkarId,
                }))
              ),
            }
          : undefined
        
        }

        // Update the PengangkutanDetail with new fields
        const updatedDetail = await this.prisma.pengangkutanDetail.update({
        where: { id: detailId },
        data: updateData,
        });

        return updatedDetail;
    }

    // Delete a PengangkutanDetail and its associated companies
    async deletePengangkutanDetailFromReport(detailId: string) {
      const detail = await this.prisma.pengangkutanDetail.findUnique({ where: { id: detailId } });
      if (!detail) throw new NotFoundException('Pengangkutan detail not found.');

      // Now delete the PengangkutanDetail itself
      return this.prisma.pengangkutanDetail.delete({
        where: { id: detailId },
      });
    }

    // Finalize the report only if all reports for the entire period are present for all vehicles in the application
    async finalizeReport(companyId:string, periodId: string, applicationId: string) {
            // 1. Mulai transaksi
            return await this.prisma.$transaction(async (prisma) => {
              // 2. Validasi periode
              const period = await prisma.period.findUnique({ where: { id: periodId } });
              if (!period) throw new NotFoundException('Periode tidak ditemukan.');

              // Cek batas waktu finalisasi
              if (new Date() > period.finalizationDeadline) {
                throw new BadRequestException('Batas waktu finalisasi telah berakhir.');
              }

              // 3. Ambil semua kendaraan dari aplikasi
              const vehicles = await prisma.vehicle.findMany({
                where: {  applications: {some:{
                  applicationId
                }} }
              });

              const allVehicleIds = vehicles.map((vehicle) => vehicle.id);

              if (allVehicleIds.length === 0) {
                throw new NotFoundException('Tidak ada kendaraan yang terdaftar dalam aplikasi ini.');
              }

              // 4. Ambil semua laporan berdasarkan `companyId`, `periodId`, dan `applicationId`
              const reports = await this.prisma.pelaporanPengangkutan.findMany({
                where: { periodId: periodId, companyId:companyId },
                include: {
                  period: true,            // Include period to check finalization deadline
                  vehicle:true,
                  company:true,
                  application: {
                    include: { vehicles: true }, // Include all vehicles in the application
                  },
                  pengangkutanDetails: {
                    include:{
                      b3Substance:true,
                      DataPerusahaanAsalMuatOnPengakutanDetail:{
                        include:{
                          perusahaanAsalMuat:true
                        }
                      },
                      DataPerusahaanTujuanBongkarOnPengakutanDetail:{
                        include:{
                          perusahaanTujuanBongkar:true
                        }
                      }
                    }
                  },
                },
              });

              if (reports.length === 0) {
                throw new NotFoundException('Laporan tidak ditemukan untuk aplikasi ini.');
              }

              // 5. Validasi apakah semua kendaraan sudah ada di laporan
              const reportedVehicleIds = [...new Set(reports.map((report) => report.vehicleId))];
              const missingVehicles = allVehicleIds.filter((vehicleId) => !reportedVehicleIds.includes(vehicleId));

              if (missingVehicles.length > 0) {
                const missingVehicleString = missingVehicles.join(', ');
                throw new BadRequestException(
                  `Kendaraan berikut belum dilaporkan: ${missingVehicleString}.`
                );
              }

              // 6. Buat daftar semua bulan dalam periode
              const monthsInPeriod = this.getMonthsBetweenDates(period.startPeriodDate, period.endPeriodDate);

              // 7. Validasi setiap kendaraan untuk setiap bulan
              for (const vehicleId of allVehicleIds) {
                const vehicleReports = reports.filter((report) => report.vehicleId === vehicleId);
                const reportedMonths = vehicleReports.map((report) => `${report.bulan}-${report.tahun}`);

                const missingMonths = monthsInPeriod.filter(
                  (month) => !reportedMonths.includes(`${month.bulan}-${month.tahun}`)
                );

                if (missingMonths.length > 0) {
                  const missingMonthString = missingMonths
                    .map((m) => `Bulan ${m.bulan} Tahun ${m.tahun}`)
                    .join(', ');
                  throw new BadRequestException(
                    `Kendaraan dengan ID ${vehicleId} belum melaporkan untuk bulan: ${missingMonthString}.`
                  );
                }
              }

              // 8. Finalisasi laporan
              await prisma.pelaporanPengangkutan.updateMany({
                where: { periodId, companyId, applicationId },
                data: { status: StatusPengajuan.MENUNGGU_PERSETUJUAN, isDraft: false, isFinalized: true },
              });

              // 9. Buat riwayat finalisasi
              for (const report of reports) {
                await prisma.pelaporanPengakutanHistory.create({
                  data: {
                    pelaporanPengakutanId: report.id,
                    statusPengajuan: StatusPengajuan.MENUNGGU_PERSETUJUAN,
                    tanggalPengajuan: new Date(),
                  },
                });
              }

              // 10. Kembalikan pesan sukses
              return { message: 'Laporan dan detail berhasil difinalisasi.' };
            });
    }

    async reviewReport(id: string, data: ReviewPelaporanBahanB3Dto) {
      const { status, adminNote } = data;
    
      if (![StatusPengajuan.DISETUJUI, StatusPengajuan.DITOLAK].includes(status)) {
        throw new BadRequestException('Status pengajuan tidak valid.');
      }
    
      return await this.prisma.$transaction(async (prisma) => {
        const report = await prisma.pelaporanPengangkutan.findUnique({ where: { id }, include:{
          pengangkutanDetails:{ include: { b3Substance:true, DataPerusahaanAsalMuatOnPengakutanDetail:{include: {perusahaanAsalMuat:true},
          }, DataPerusahaanTujuanBongkarOnPengakutanDetail: {
           include:{perusahaanTujuanBongkar:true, perusahaanAsalMuat:true} 
          }}},period:true
        } });
    
        if (!report || !report.isFinalized) {
          throw new BadRequestException('Laporan tidak valid atau belum difinalisasi.');
        }

        if (report.status === StatusPengajuan.DISETUJUI || report.isApproved) {
          throw new BadRequestException('Laporan sudah disetujui.');
        }
    
        if (status === StatusPengajuan.DISETUJUI) {
          const final = await prisma.laporanPengangkutanFinal.create({
            data: {
              companyId: report.companyId,
              periodId: report.periodId,
              bulan: report.bulan,
              tahun: report.tahun,
              applicationId: report.applicationId,
              vehicleId: report.vehicleId,
              status: status,
              approvedAt: new Date(),
            }, 
          });
  
          for (const reportDetails of report.pengangkutanDetails) {
              const finalDetail = await prisma.laporanPengangkutanFinalDetail.create({
                data: {
                  laporanPengangkutanFinalId: final.id,
                  b3SubstanceId: reportDetails.b3SubstanceId,
                  jumlahB3: reportDetails.jumlahB3,
          
                  // Salin DataPerusahaanAsalMuatOnPengakutanDetail ke DataPerusahaanAsalMuatOnPengakutanDetailFinal
                  DataPerusahaanAsalMuatOnPengakutanDetailFinal: {
                    create: reportDetails.DataPerusahaanTujuanBongkarOnPengakutanDetail.map((asalMuat) => ({
                      companyId: asalMuat.perusahaanAsalMuat.companyId,
                      namaPerusahaan: asalMuat.perusahaanAsalMuat.namaPerusahaan,
                      alamat: asalMuat.perusahaanAsalMuat.alamat,
                      latitude: asalMuat.perusahaanAsalMuat.latitude,
                      longitude: asalMuat.perusahaanAsalMuat.longitude,
                      provinceId: asalMuat.perusahaanAsalMuat.provinceId,
                      regencyId: asalMuat.perusahaanAsalMuat.regencyId,
                      districtId: asalMuat.perusahaanAsalMuat.districtId,
                      villageId: asalMuat.perusahaanAsalMuat.villageId,

                    })),
                  },
                },
              });
          
              // Ambil semua data asal muat yang sudah difinalisasi
              const asalMuatFinalList = await prisma.dataPerusahaanAsalMuatOnPengakutanDetailFinal.findMany({
                where: {
                  pengangkutanDetailId: finalDetail.id,
                },
              });
          
              // Salin DataPerusahaanTujuanBongkarOnPengakutanDetail ke DataPerusahaanTujuanBongkarOnPengakutanDetailFinal
              for (const tujuanBongkar of reportDetails.DataPerusahaanTujuanBongkarOnPengakutanDetail) {
                const asalMuatFinal = asalMuatFinalList.find(
                  (asalFinal) => asalFinal.alamat === tujuanBongkar.perusahaanAsalMuat.alamat && asalFinal.namaPerusahaan === tujuanBongkar.perusahaanAsalMuat.namaPerusahaan
                  && asalFinal.latitude === tujuanBongkar.perusahaanAsalMuat.latitude && asalFinal.longitude === tujuanBongkar.perusahaanAsalMuat.longitude
                  && asalFinal.provinceId === tujuanBongkar.perusahaanAsalMuat.provinceId && asalFinal.regencyId === tujuanBongkar.perusahaanAsalMuat.regencyId
                  && asalFinal.districtId === tujuanBongkar.perusahaanAsalMuat.districtId && asalFinal.villageId === tujuanBongkar.perusahaanAsalMuat.villageId
                  && asalFinal.companyId === tujuanBongkar.perusahaanAsalMuat.companyId
                );
          
                if (!asalMuatFinal) {
                  throw new Error('Data asal muat final tidak ditemukan untuk tujuan bongkar ini.');
                }
          
                await prisma.dataPerusahaanTujuanBongkarOnPengakutanDetailFinal.create({
                  data: {
                    pengangkutanDetailId: finalDetail.id,
                    companyId: tujuanBongkar.perusahaanTujuanBongkar.companyId,
                    namaPerusahaan: tujuanBongkar.perusahaanTujuanBongkar.namaPerusahaan,
                    alamat: tujuanBongkar.perusahaanTujuanBongkar.alamat,
                    latitude: tujuanBongkar.perusahaanTujuanBongkar.latitude,
                    longitude: tujuanBongkar.perusahaanTujuanBongkar.longitude,
                    latitudeAsalMuat: tujuanBongkar.latitudeAsalMuat,
                    longitudeAsalMuat: tujuanBongkar.longitudeAsalMuat,
                    locationTypeAsalMuat: tujuanBongkar.locationTypeAsalMuat,
                    locationTypeTujuan: tujuanBongkar.locationTypeTujuan,
                    latitudeTujuan: tujuanBongkar.latitudeTujuan,
                    longitudeTujuan: tujuanBongkar.longitudeTujuan,
                    DataPerusahaanAsalMuatOnPengakutanDetailFinalId: asalMuatFinal.id,
                    provinceId: tujuanBongkar.perusahaanTujuanBongkar.provinceId,
                    regencyId: tujuanBongkar.perusahaanTujuanBongkar.regencyId,
                    districtId: tujuanBongkar.perusahaanTujuanBongkar.districtId,
                    villageId: tujuanBongkar.perusahaanTujuanBongkar.villageId,
                  },
                });
              }
            }
            await prisma.pelaporanPengangkutan.update({
            where: { id },
            data: { isApproved: true, status:status },
            });

          } else {
              await prisma.pelaporanPengangkutan.update({
              where: { id },
              data: { isDraft: true, isFinalized: false, status:status },
              });
          }

          const rekomendasiB3 = await prisma.kewajibanPelaporanAplikasi.findMany(
            {
              where: { bulan: report.bulan, tahun: report.tahun, companyId: report.companyId, applicationId: report.applicationId },
            }
          )

          if(!rekomendasiB3) {
            throw new NotFoundException('Rekomendasi B3 tidak ditemukan.');
          }

          const rekomendasiB3C = await prisma.kewajibanPelaporanAplikasi.findFirst(
            {
              where: { bulan: report.bulan, tahun: report.tahun, companyId: report.companyId, applicationId: report.applicationId, vehicleId: report.vehicleId },
            }
          )

          if (rekomendasiB3C){
            // Tandai laporan sebagai disetujui
            await prisma.kewajibanPelaporanAplikasi.update({
              where: { id: rekomendasiB3C.id},
              data: { sudahDilaporkan: true },
            });
          }else{
            await prisma.kewajibanPelaporanAplikasi.create({
              data:{
                companyId: report.companyId,
                applicationId: report.applicationId,
                bulan: report.bulan,
                tahun: report.tahun,
                sudahDilaporkan: status === StatusPengajuan.DISETUJUI ? true : false,
                tanggalBatas: report.period.endPeriodDate,
                vehicleId: report.vehicleId,
                periodId: report.periodId,
              }
            })
          }



          if( rekomendasiB3.every((rekomendasi) => rekomendasi.sudahDilaporkan === true)){
            const kewajiban = await prisma.kewajibanPelaporanPerusahaan.findFirst(
              {
                where: { bulan: report.bulan, tahun: report.tahun, companyId: report.companyId, jenisLaporan: JenisPelaporan.PENGANGKUTAN_BAHAN_B3 },
              }
            )
            if(!kewajiban) {
              await prisma.kewajibanPelaporanPerusahaan.create({
                data: {
                  companyId: report.companyId,
                  bulan: report.bulan,
                  tahun: report.tahun,
                  jenisLaporan: JenisPelaporan.PENGANGKUTAN_BAHAN_B3,
                  sudahDilaporkan: status === StatusPengajuan.DISETUJUI ? true : false,
                  tanggalBatas: report.period.endPeriodDate,
                  periodId: report.periodId,
                },
              });
            }else{
              // Tandai laporan sebagai disetujui
              await prisma.kewajibanPelaporanPerusahaan.update({
                where: { id: kewajiban.id},
                data: { sudahDilaporkan: true },
              });
            }
        
          }
       
          await prisma.pelaporanPengakutanHistory.create({
              data: {
              pelaporanPengakutanId: id,
              statusPengajuan: status,
              tanggalPengajuan: report.updatedAt,
              tanggalPenyelesaian: new Date(),
              catatanAdmin: adminNote,
              },
        });
    
        return { message: `Laporan berhasil ${status === StatusPengajuan.DISETUJUI ? 'disetujui' : 'ditolak'}.` };
      });
    }

    // Fetch a single report with full related data by ID, or throw an error if it doesn't exist
    async getReportById(id: string) {
      const report = await this.prisma.pelaporanPengangkutan.findUnique({
        where: { id },
        include: {
          period: true, // Include period information
          application: {
            include: {
              vehicles: true, // Include vehicles associated with the application
            },
          },
          company: true, // Include company information
          vehicle: true, // Include vehicle information
          pengangkutanDetails: {
            include: {
              b3Substance: {include:{dataBahanB3:true}}, // Include B3Substance details in each PengangkutanDetail, if applicable
              DataPerusahaanAsalMuatOnPengakutanDetail: {include:{ perusahaanAsalMuat: true }},
              DataPerusahaanTujuanBongkarOnPengakutanDetail:
               {include:{ perusahaanTujuanBongkar: {include:{
                village: true,
                district: true,
                regency: true,
                province: true,
              }
            },perusahaanAsalMuat:{include:{
              village: true,
              district: true,
              regency: true,
              province: true,
            }} 
          }
          },
            },
          },
        },
      });

      if (!report) {
        throw new NotFoundException('Report not found.');
      }

      return report;
    }

    async searchReports(params: SearchPelaporanPengakutanDto) {
      const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc', applicationId, periodId, bulan, tahun, vehicleIds, b3SubstanceIds, longitudeAsalMuat, latitudeAsalMuat, longitudeTujuanBongkar, latitudeTujuanBongkar } = params;

      const offset = (page - 1) * limit;

      // Construct the query conditions
      const where: any = {
        ...(applicationId ? { applicationId } : {}),
        ...(periodId ? { periodId } : {}),
        ...(bulan ? { bulan } : {}),
        ...(tahun ? { tahun } : {}),
        ...(vehicleIds ? { vehicleId: { in: vehicleIds } } : {}),
        ...(b3SubstanceIds ? { pengangkutanDetails: { some: { b3SubstanceId: { in: b3SubstanceIds } } } } : {}),
        // Combine latitude and longitude filters for perusahaanAsalMuat
        ...(longitudeAsalMuat && latitudeAsalMuat
          ? {
              pengangkutanDetails: {
                some: {
                  perusahaanAsalMuat: {
                    some: {
                      longitude: longitudeAsalMuat,
                      latitude: latitudeAsalMuat,
                    },
                  },
                },
              },
            }
          : {}),
        // Combine latitude and longitude filters for perusahaanTujuanBongkar
        ...(longitudeTujuanBongkar && latitudeTujuanBongkar
          ? {
              pengangkutanDetails: {
                some: {
                  perusahaanTujuanBongkar: {
                    some: {
                      longitude: longitudeTujuanBongkar,
                      latitude: latitudeTujuanBongkar,
                    },
                  },
                },
              },
            }
          : {}),
      };

      const reports = await this.prisma.pelaporanPengangkutan.findMany({
        where,
        orderBy: { [sortBy]: sortOrder },
        skip: offset,
        take: limit,
        include: {
          period: true,
          application: {
            include: {
              vehicles: true,
              company: true,
            },
          },
          vehicle: true,
          company: true,
          pengangkutanDetails: {
            include: {
              b3Substance: {include: {dataBahanB3:true}},
              DataPerusahaanAsalMuatOnPengakutanDetail: {include:{ perusahaanAsalMuat: true }},
              DataPerusahaanTujuanBongkarOnPengakutanDetail: {include:{ perusahaanTujuanBongkar: true, perusahaanAsalMuat:true }},
            },
          },
        },
      });

      const total = await this.prisma.pelaporanPengangkutan.count({ where });

      return {
        data: reports,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };
    }

    async getUnreportedVehicles(data: SearchBelumPelaporanPengakutanVehicleDto) {
      const { applicationId, periodId } = data;

      // Ensure at least one parameter is provided
      if (!applicationId && !periodId) {
          // If both are missing, return an empty array or a default response
          return [];
      }

      // If periodId is provided, get the period and date range
      let monthsInPeriod = [];
      if (periodId) {
          const period = await this.prisma.period.findUnique({
              where: { id: periodId },
          });
          if (!period) throw new NotFoundException('Period not found.');
          monthsInPeriod = this.getMonthsBetweenDates(period.startPeriodDate, period.endPeriodDate);
      }

      // Get all vehicles in the application if applicationId is provided
      const vehicles = applicationId
          ? await this.prisma.vehicle.findMany({
              where: { applications: { some: { applicationId: applicationId } } },
          })
          : [];

      // Get all reports within this period if periodId is provided
      const reportedVehicles = periodId
          ? await this.prisma.pelaporanPengangkutan.findMany({
              where: {
                  ...(applicationId ? { applicationId } : {}),
                  OR: monthsInPeriod.map(month => ({
                      bulan: month.bulan,
                      tahun: month.tahun,
                  })),
              },
              select: { vehicleId: true },
          })
          : [];

      // Find vehicle IDs that do not appear in reported vehicles
      const reportedVehicleIds = new Set(reportedVehicles.map(r => r.vehicleId));
      const unreportedVehicles = vehicles.filter(vehicle => !reportedVehicleIds.has(vehicle.id));

      return unreportedVehicles;
    }

    async getUnreportedMonthsForVehicle(data: SearchBelumPelaporanPengakutanVehicleDto) {
        const { applicationId, periodId } = data;

        // Ensure at least one parameter is provided
        if (!applicationId && !periodId) {
            // Return empty array or default response if both are missing
            return [];
        }

        // If periodId is provided, get the period and date range
        let monthsInPeriod = [];
        if (periodId) {
            const period = await this.prisma.period.findUnique({
                where: { id: periodId },
            });
            if (!period) throw new NotFoundException('Period not found.');
            monthsInPeriod = this.getMonthsBetweenDates(period.startPeriodDate, period.endPeriodDate);
        }

        // Get all reported months for the vehicle within the period
        const reportedMonths = applicationId && periodId
            ? await this.prisma.pelaporanPengangkutan.findMany({
                where: {
                    applicationId,
                    OR: monthsInPeriod.map(month => ({
                        bulan: month.bulan,
                        tahun: month.tahun,
                    })),
                },
                select: { bulan: true, tahun: true },
            })
            : [];

        // Determine which months are missing by comparing with monthsInPeriod
        const reportedMonthsSet = new Set(reportedMonths.map(month => `${month.bulan}-${month.tahun}`));
        const unreportedMonths = monthsInPeriod.filter(
            month => !reportedMonthsSet.has(`${month.bulan}-${month.tahun}`)
        );

        return unreportedMonths;
    }

    async getUnreportedApplications(data: SearchPermohonanRekomBelumDilaporkanDto) {
        const { periodId, companyId } = data;

        // Ensure at least one parameter is provided
        if (!periodId && !companyId) {
            // Return empty array or default response if both are missing
            return [];
        }

        // If periodId is provided, get the period and date range
        let monthsInPeriod = [];
        if (periodId) {
            const period = await this.prisma.period.findUnique({
                where: { id: periodId },
            });
            if (!period) throw new NotFoundException('Period not found.');
            monthsInPeriod = this.getMonthsBetweenDates(period.startPeriodDate, period.endPeriodDate);
        }

        // Retrieve all applications, optionally filtered by company
        const allApplications = await this.prisma.application.findMany({
            where: {
                ...(companyId ? { companyId } : {}),
            }
        });

        // Retrieve applications that have reports within the period and optionally filter by company
        const reportedApplications = periodId
            ? await this.prisma.pelaporanPengangkutan.findMany({
                where: {
                    ...(companyId ? { application: { companyId } } : {}),
                    OR: monthsInPeriod.map(month => ({
                        bulan: month.bulan,
                        tahun: month.tahun,
                    })),
                },
                select: { applicationId: true },
                distinct: ['applicationId'],
            })
            : [];

        // Determine which applications are missing reports
        const reportedApplicationIds = new Set(reportedApplications.map(report => report.applicationId));
        const unreportedApplications = allApplications.filter(
            application => !reportedApplicationIds.has(application.id)
        );

        return unreportedApplications;
    }

    // Helper to get all months between two dates
    private getMonthsBetweenDates(startDate: Date, endDate: Date): { bulan: number; tahun: number }[] {
    const months = [];
    let currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      months.push({
        bulan: currentDate.getMonth() + 1, // Month is zero-indexed in JavaScript
        tahun: currentDate.getFullYear(),
      });
      currentDate.setMonth(currentDate.getMonth() + 1); // Move to the next month
    }

    return months;
    }
  
}
