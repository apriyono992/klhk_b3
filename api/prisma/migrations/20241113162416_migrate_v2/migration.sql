/*
  Warnings:

  - You are about to drop the column `namaSupplier` on the `DataCustomer` table. All the data in the column will be lost.
  - You are about to drop the column `pengangkutanDetailId` on the `PerusahaanAsalMuat` table. All the data in the column will be lost.
  - You are about to drop the column `pengangkutanDetailId` on the `PerusahaanTujuanBongkar` table. All the data in the column will be lost.
  - You are about to drop the `ApiResponse` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[companyId,dataBahanB3Id,bulan,tahun]` on the table `PelaporanB3Dihasilkan` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `companyId` to the `DataCustomer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `namaCustomer` to the `DataCustomer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tipeProduk` to the `PelaporanB3Dihasilkan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `districtId` to the `PerusahaanAsalMuat` table without a default value. This is not possible if the table is not empty.
  - Added the required column `provinceId` to the `PerusahaanAsalMuat` table without a default value. This is not possible if the table is not empty.
  - Added the required column `regencyId` to the `PerusahaanAsalMuat` table without a default value. This is not possible if the table is not empty.
  - Added the required column `villageId` to the `PerusahaanAsalMuat` table without a default value. This is not possible if the table is not empty.
  - Added the required column `districtId` to the `PerusahaanTujuanBongkar` table without a default value. This is not possible if the table is not empty.
  - Added the required column `provinceId` to the `PerusahaanTujuanBongkar` table without a default value. This is not possible if the table is not empty.
  - Added the required column `regencyId` to the `PerusahaanTujuanBongkar` table without a default value. This is not possible if the table is not empty.
  - Added the required column `villageId` to the `PerusahaanTujuanBongkar` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "PelaporanB3Dihasilkan" DROP CONSTRAINT "PelaporanB3Dihasilkan_dataBahanB3Id_fkey";

-- DropForeignKey
ALTER TABLE "PerusahaanAsalMuat" DROP CONSTRAINT "PerusahaanAsalMuat_pengangkutanDetailId_fkey";

-- DropForeignKey
ALTER TABLE "PerusahaanTujuanBongkar" DROP CONSTRAINT "PerusahaanTujuanBongkar_pengangkutanDetailId_fkey";

-- AlterTable
ALTER TABLE "Company" ADD COLUMN     "skalaPerusahaan" TEXT;

-- AlterTable
ALTER TABLE "DataCustomer" DROP COLUMN "namaSupplier",
ADD COLUMN     "companyId" TEXT NOT NULL,
ADD COLUMN     "namaCustomer" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "PelaporanB3Dihasilkan" ADD COLUMN     "isApproved" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isDraft" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "isFinalized" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "tipeProduk" TEXT NOT NULL,
ALTER COLUMN "dataBahanB3Id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "PelaporanPengangkutan" ADD COLUMN     "isApproved" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isFinalized" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "PelaporanPenggunaanBahanB3" ADD COLUMN     "isApproved" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isFinalized" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "PengangkutanDetail" ADD COLUMN     "isApproved" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isDraft" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "isFinalized" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "jumlahB3" DROP NOT NULL;

-- AlterTable
ALTER TABLE "PerusahaanAsalMuat" DROP COLUMN "pengangkutanDetailId",
ADD COLUMN     "districtId" TEXT NOT NULL,
ADD COLUMN     "provinceId" TEXT NOT NULL,
ADD COLUMN     "regencyId" TEXT NOT NULL,
ADD COLUMN     "villageId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "PerusahaanTujuanBongkar" DROP COLUMN "pengangkutanDetailId",
ADD COLUMN     "districtId" TEXT NOT NULL,
ADD COLUMN     "provinceId" TEXT NOT NULL,
ADD COLUMN     "regencyId" TEXT NOT NULL,
ADD COLUMN     "villageId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "rolesId" DROP DEFAULT;

-- DropTable
DROP TABLE "ApiResponse";

-- CreateTable
CREATE TABLE "PelaporanB3DihasilkanHistory" (
    "id" TEXT NOT NULL,
    "pelaporanB3DihasilkanId" TEXT NOT NULL,
    "statusPengajuan" TEXT NOT NULL,
    "tanggalPengajuan" TIMESTAMP(3) NOT NULL,
    "tanggalPenyelesaian" TIMESTAMP(3),
    "catatanAdmin" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PelaporanB3DihasilkanHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PelaporanB3DihasilkanFinal" (
    "id" TEXT NOT NULL,
    "tipeProduk" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "periodId" TEXT NOT NULL,
    "bulan" INTEGER NOT NULL,
    "tahun" INTEGER NOT NULL,
    "namaProduk" TEXT,
    "prosesProduksi" TEXT,
    "dataBahanB3Id" TEXT,
    "jumlahB3Dihasilkan" DOUBLE PRECISION NOT NULL,
    "approvedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PelaporanB3DihasilkanFinal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PelaporanPenggunaanBahanB3Final" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "bulan" INTEGER NOT NULL,
    "tahun" INTEGER NOT NULL,
    "dataBahanB3Id" TEXT NOT NULL,
    "periodId" TEXT NOT NULL,
    "tipePembelian" TEXT NOT NULL,
    "jumlahPembelianB3" DOUBLE PRECISION NOT NULL,
    "jumlahB3Digunakan" DOUBLE PRECISION NOT NULL,
    "approvedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PelaporanPenggunaanBahanB3Final_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DataSupplierOnPelaporanPenggunaanB3Final" (
    "id" TEXT NOT NULL,
    "pelaporanPenggunaanB3FinalId" TEXT NOT NULL,
    "namaSupplier" TEXT NOT NULL,
    "alamat" TEXT NOT NULL,
    "email" TEXT,
    "telepon" TEXT,
    "fax" TEXT,
    "longitude" DOUBLE PRECISION,
    "latitude" DOUBLE PRECISION,
    "provinceId" TEXT NOT NULL,
    "regencyId" TEXT NOT NULL,
    "districtId" TEXT NOT NULL,
    "villageId" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DataSupplierOnPelaporanPenggunaanB3Final_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PelaporanPenggunaanBahanB3History" (
    "id" TEXT NOT NULL,
    "pelaporanPenggunaanBahanB3Id" TEXT NOT NULL,
    "statusPengajuan" TEXT NOT NULL,
    "tanggalPengajuan" TIMESTAMP(3) NOT NULL,
    "tanggalPenyelesaian" TIMESTAMP(3),
    "catatanAdmin" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PelaporanPenggunaanBahanB3History_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PelaporanBahanB3Distribusi" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "periodId" TEXT NOT NULL,
    "bulan" INTEGER NOT NULL,
    "tahun" INTEGER NOT NULL,
    "dataBahanB3Id" TEXT NOT NULL,
    "jumlahB3Distribusi" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isDraft" BOOLEAN NOT NULL DEFAULT true,
    "isFinalized" BOOLEAN NOT NULL DEFAULT false,
    "isApproved" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "PelaporanBahanB3Distribusi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DataCustomerOnPelaporanDistribusiBahanB3" (
    "id" TEXT NOT NULL,
    "pelaporanBahanB3DistribusiId" TEXT NOT NULL,
    "dataCustomerId" TEXT NOT NULL,

    CONSTRAINT "DataCustomerOnPelaporanDistribusiBahanB3_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DataTransporterOnPelaporanDistribusiBahanB3" (
    "id" TEXT NOT NULL,
    "pelaporanBahanB3DistribusiId" TEXT NOT NULL,
    "dataTransporterId" TEXT NOT NULL,

    CONSTRAINT "DataTransporterOnPelaporanDistribusiBahanB3_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PelaporanBahanB3DistribusiFinal" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "periodId" TEXT NOT NULL,
    "bulan" INTEGER NOT NULL,
    "tahun" INTEGER NOT NULL,
    "dataBahanB3Id" TEXT NOT NULL,
    "jumlahB3Distribusi" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "approveAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PelaporanBahanB3DistribusiFinal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PelaporanBahanB3DistribusiHistory" (
    "id" TEXT NOT NULL,
    "pelaporanBahanB3DistribusiId" TEXT NOT NULL,
    "statusPengajuan" TEXT NOT NULL,
    "tanggalPengajuan" TIMESTAMP(3) NOT NULL,
    "tanggalPenyelesaian" TIMESTAMP(3),
    "catatanAdmin" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PelaporanBahanB3DistribusiHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DataTransporter" (
    "id" TEXT NOT NULL,
    "namaTransPorter" TEXT NOT NULL,
    "alamat" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telepon" TEXT NOT NULL,
    "fax" TEXT,
    "longitude" DOUBLE PRECISION NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "companyId" TEXT NOT NULL,
    "provinceId" TEXT NOT NULL,
    "regencyId" TEXT NOT NULL,
    "districtId" TEXT NOT NULL,
    "villageId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DataTransporter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DataCustomerFinal" (
    "id" TEXT NOT NULL,
    "pelaporanId" TEXT NOT NULL,
    "namaCustomer" TEXT NOT NULL,
    "alamat" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telepon" TEXT NOT NULL,
    "fax" TEXT,
    "longitude" DOUBLE PRECISION NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "companyId" TEXT NOT NULL,
    "provinceId" TEXT NOT NULL,
    "regencyId" TEXT NOT NULL,
    "districtId" TEXT NOT NULL,
    "villageId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DataCustomerFinal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DataTransporterFinal" (
    "id" TEXT NOT NULL,
    "pelaporanId" TEXT NOT NULL,
    "namaTransporter" TEXT NOT NULL,
    "alamat" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telepon" TEXT NOT NULL,
    "fax" TEXT,
    "longitude" DOUBLE PRECISION NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "companyId" TEXT NOT NULL,
    "provinceId" TEXT NOT NULL,
    "regencyId" TEXT NOT NULL,
    "districtId" TEXT NOT NULL,
    "villageId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DataTransporterFinal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DataPerusahaanAsalMuatOnPengakutanDetail" (
    "id" TEXT NOT NULL,
    "pengangkutanDetailId" TEXT NOT NULL,
    "perusahaanAsalMuatId" TEXT NOT NULL,

    CONSTRAINT "DataPerusahaanAsalMuatOnPengakutanDetail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DataPerusahaanTujuanBongkarOnPengakutanDetail" (
    "id" TEXT NOT NULL,
    "pengangkutanDetailId" TEXT NOT NULL,
    "perusahaanTujuanBongkarId" TEXT NOT NULL,

    CONSTRAINT "DataPerusahaanTujuanBongkarOnPengakutanDetail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DataPerusahaanAsalMuatOnPengakutanDetailFinal" (
    "id" TEXT NOT NULL,
    "pengangkutanDetailId" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "namaPerusahaan" TEXT NOT NULL,
    "alamat" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "locationType" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "provinceId" TEXT NOT NULL,
    "regencyId" TEXT NOT NULL,
    "districtId" TEXT NOT NULL,
    "villageId" TEXT NOT NULL,

    CONSTRAINT "DataPerusahaanAsalMuatOnPengakutanDetailFinal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DataPerusahaanTujuanBongkarOnPengakutanDetailFinal" (
    "id" TEXT NOT NULL,
    "pengangkutanDetailId" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "namaPerusahaan" TEXT NOT NULL,
    "alamat" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "locationType" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "provinceId" TEXT NOT NULL,
    "regencyId" TEXT NOT NULL,
    "districtId" TEXT NOT NULL,
    "villageId" TEXT NOT NULL,

    CONSTRAINT "DataPerusahaanTujuanBongkarOnPengakutanDetailFinal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DataPICFinal" (
    "id" TEXT NOT NULL,
    "namaPIC" TEXT,
    "jabatan" TEXT,
    "email" TEXT,
    "telepon" TEXT,
    "fax" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DataPICFinal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_DataTembusanToDraftSurat" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_BaseSuratNotfikasiToDataTembusan" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_DataPICToDataTransporter" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_DataPICFinalToDataSupplierOnPelaporanPenggunaanB3Final" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "PelaporanB3DihasilkanFinal_companyId_dataBahanB3Id_bulan_ta_key" ON "PelaporanB3DihasilkanFinal"("companyId", "dataBahanB3Id", "bulan", "tahun");

-- CreateIndex
CREATE UNIQUE INDEX "PelaporanPenggunaanBahanB3Final_dataBahanB3Id_bulan_tahun_key" ON "PelaporanPenggunaanBahanB3Final"("dataBahanB3Id", "bulan", "tahun");

-- CreateIndex
CREATE UNIQUE INDEX "PelaporanBahanB3Distribusi_companyId_dataBahanB3Id_bulan_ta_key" ON "PelaporanBahanB3Distribusi"("companyId", "dataBahanB3Id", "bulan", "tahun");

-- CreateIndex
CREATE UNIQUE INDEX "PelaporanBahanB3DistribusiFinal_dataBahanB3Id_bulan_tahun_key" ON "PelaporanBahanB3DistribusiFinal"("dataBahanB3Id", "bulan", "tahun");

-- CreateIndex
CREATE UNIQUE INDEX "_DataTembusanToDraftSurat_AB_unique" ON "_DataTembusanToDraftSurat"("A", "B");

-- CreateIndex
CREATE INDEX "_DataTembusanToDraftSurat_B_index" ON "_DataTembusanToDraftSurat"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_BaseSuratNotfikasiToDataTembusan_AB_unique" ON "_BaseSuratNotfikasiToDataTembusan"("A", "B");

-- CreateIndex
CREATE INDEX "_BaseSuratNotfikasiToDataTembusan_B_index" ON "_BaseSuratNotfikasiToDataTembusan"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_DataPICToDataTransporter_AB_unique" ON "_DataPICToDataTransporter"("A", "B");

-- CreateIndex
CREATE INDEX "_DataPICToDataTransporter_B_index" ON "_DataPICToDataTransporter"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_DataPICFinalToDataSupplierOnPelaporanPenggunaanB3Fin_AB_unique" ON "_DataPICFinalToDataSupplierOnPelaporanPenggunaanB3Final"("A", "B");

-- CreateIndex
CREATE INDEX "_DataPICFinalToDataSupplierOnPelaporanPenggunaanB3Final_B_index" ON "_DataPICFinalToDataSupplierOnPelaporanPenggunaanB3Final"("B");

-- CreateIndex
CREATE UNIQUE INDEX "PelaporanB3Dihasilkan_companyId_dataBahanB3Id_bulan_tahun_key" ON "PelaporanB3Dihasilkan"("companyId", "dataBahanB3Id", "bulan", "tahun");

-- AddForeignKey
ALTER TABLE "PerusahaanAsalMuat" ADD CONSTRAINT "PerusahaanAsalMuat_provinceId_fkey" FOREIGN KEY ("provinceId") REFERENCES "reg_provinces"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PerusahaanAsalMuat" ADD CONSTRAINT "PerusahaanAsalMuat_regencyId_fkey" FOREIGN KEY ("regencyId") REFERENCES "reg_regencies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PerusahaanAsalMuat" ADD CONSTRAINT "PerusahaanAsalMuat_districtId_fkey" FOREIGN KEY ("districtId") REFERENCES "reg_districts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PerusahaanAsalMuat" ADD CONSTRAINT "PerusahaanAsalMuat_villageId_fkey" FOREIGN KEY ("villageId") REFERENCES "reg_village"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PerusahaanTujuanBongkar" ADD CONSTRAINT "PerusahaanTujuanBongkar_provinceId_fkey" FOREIGN KEY ("provinceId") REFERENCES "reg_provinces"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PerusahaanTujuanBongkar" ADD CONSTRAINT "PerusahaanTujuanBongkar_regencyId_fkey" FOREIGN KEY ("regencyId") REFERENCES "reg_regencies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PerusahaanTujuanBongkar" ADD CONSTRAINT "PerusahaanTujuanBongkar_districtId_fkey" FOREIGN KEY ("districtId") REFERENCES "reg_districts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PerusahaanTujuanBongkar" ADD CONSTRAINT "PerusahaanTujuanBongkar_villageId_fkey" FOREIGN KEY ("villageId") REFERENCES "reg_village"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PelaporanB3Dihasilkan" ADD CONSTRAINT "PelaporanB3Dihasilkan_dataBahanB3Id_fkey" FOREIGN KEY ("dataBahanB3Id") REFERENCES "DataBahanB3"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PelaporanB3DihasilkanHistory" ADD CONSTRAINT "PelaporanB3DihasilkanHistory_pelaporanB3DihasilkanId_fkey" FOREIGN KEY ("pelaporanB3DihasilkanId") REFERENCES "PelaporanB3Dihasilkan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PelaporanB3DihasilkanFinal" ADD CONSTRAINT "PelaporanB3DihasilkanFinal_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PelaporanB3DihasilkanFinal" ADD CONSTRAINT "PelaporanB3DihasilkanFinal_periodId_fkey" FOREIGN KEY ("periodId") REFERENCES "Period"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PelaporanB3DihasilkanFinal" ADD CONSTRAINT "PelaporanB3DihasilkanFinal_dataBahanB3Id_fkey" FOREIGN KEY ("dataBahanB3Id") REFERENCES "DataBahanB3"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DataCustomer" ADD CONSTRAINT "DataCustomer_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PelaporanPenggunaanBahanB3Final" ADD CONSTRAINT "PelaporanPenggunaanBahanB3Final_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PelaporanPenggunaanBahanB3Final" ADD CONSTRAINT "PelaporanPenggunaanBahanB3Final_dataBahanB3Id_fkey" FOREIGN KEY ("dataBahanB3Id") REFERENCES "DataBahanB3"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PelaporanPenggunaanBahanB3Final" ADD CONSTRAINT "PelaporanPenggunaanBahanB3Final_periodId_fkey" FOREIGN KEY ("periodId") REFERENCES "Period"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DataSupplierOnPelaporanPenggunaanB3Final" ADD CONSTRAINT "DataSupplierOnPelaporanPenggunaanB3Final_pelaporanPengguna_fkey" FOREIGN KEY ("pelaporanPenggunaanB3FinalId") REFERENCES "PelaporanPenggunaanBahanB3Final"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DataSupplierOnPelaporanPenggunaanB3Final" ADD CONSTRAINT "DataSupplierOnPelaporanPenggunaanB3Final_provinceId_fkey" FOREIGN KEY ("provinceId") REFERENCES "reg_provinces"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DataSupplierOnPelaporanPenggunaanB3Final" ADD CONSTRAINT "DataSupplierOnPelaporanPenggunaanB3Final_regencyId_fkey" FOREIGN KEY ("regencyId") REFERENCES "reg_regencies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DataSupplierOnPelaporanPenggunaanB3Final" ADD CONSTRAINT "DataSupplierOnPelaporanPenggunaanB3Final_districtId_fkey" FOREIGN KEY ("districtId") REFERENCES "reg_districts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DataSupplierOnPelaporanPenggunaanB3Final" ADD CONSTRAINT "DataSupplierOnPelaporanPenggunaanB3Final_villageId_fkey" FOREIGN KEY ("villageId") REFERENCES "reg_village"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DataSupplierOnPelaporanPenggunaanB3Final" ADD CONSTRAINT "DataSupplierOnPelaporanPenggunaanB3Final_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PelaporanPenggunaanBahanB3History" ADD CONSTRAINT "PelaporanPenggunaanBahanB3History_pelaporanPenggunaanBahan_fkey" FOREIGN KEY ("pelaporanPenggunaanBahanB3Id") REFERENCES "PelaporanPenggunaanBahanB3"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PelaporanBahanB3Distribusi" ADD CONSTRAINT "PelaporanBahanB3Distribusi_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PelaporanBahanB3Distribusi" ADD CONSTRAINT "PelaporanBahanB3Distribusi_periodId_fkey" FOREIGN KEY ("periodId") REFERENCES "Period"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PelaporanBahanB3Distribusi" ADD CONSTRAINT "PelaporanBahanB3Distribusi_dataBahanB3Id_fkey" FOREIGN KEY ("dataBahanB3Id") REFERENCES "DataBahanB3"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DataCustomerOnPelaporanDistribusiBahanB3" ADD CONSTRAINT "DataCustomerOnPelaporanDistribusiBahanB3_pelaporanBahanB3D_fkey" FOREIGN KEY ("pelaporanBahanB3DistribusiId") REFERENCES "PelaporanBahanB3Distribusi"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DataCustomerOnPelaporanDistribusiBahanB3" ADD CONSTRAINT "DataCustomerOnPelaporanDistribusiBahanB3_dataCustomerId_fkey" FOREIGN KEY ("dataCustomerId") REFERENCES "DataCustomer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DataTransporterOnPelaporanDistribusiBahanB3" ADD CONSTRAINT "DataTransporterOnPelaporanDistribusiBahanB3_pelaporanBahan_fkey" FOREIGN KEY ("pelaporanBahanB3DistribusiId") REFERENCES "PelaporanBahanB3Distribusi"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DataTransporterOnPelaporanDistribusiBahanB3" ADD CONSTRAINT "DataTransporterOnPelaporanDistribusiBahanB3_dataTransporte_fkey" FOREIGN KEY ("dataTransporterId") REFERENCES "DataTransporter"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PelaporanBahanB3DistribusiFinal" ADD CONSTRAINT "PelaporanBahanB3DistribusiFinal_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PelaporanBahanB3DistribusiFinal" ADD CONSTRAINT "PelaporanBahanB3DistribusiFinal_periodId_fkey" FOREIGN KEY ("periodId") REFERENCES "Period"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PelaporanBahanB3DistribusiFinal" ADD CONSTRAINT "PelaporanBahanB3DistribusiFinal_dataBahanB3Id_fkey" FOREIGN KEY ("dataBahanB3Id") REFERENCES "DataBahanB3"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PelaporanBahanB3DistribusiHistory" ADD CONSTRAINT "PelaporanBahanB3DistribusiHistory_pelaporanBahanB3Distribu_fkey" FOREIGN KEY ("pelaporanBahanB3DistribusiId") REFERENCES "PelaporanBahanB3Distribusi"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DataTransporter" ADD CONSTRAINT "DataTransporter_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DataTransporter" ADD CONSTRAINT "DataTransporter_provinceId_fkey" FOREIGN KEY ("provinceId") REFERENCES "reg_provinces"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DataTransporter" ADD CONSTRAINT "DataTransporter_regencyId_fkey" FOREIGN KEY ("regencyId") REFERENCES "reg_regencies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DataTransporter" ADD CONSTRAINT "DataTransporter_districtId_fkey" FOREIGN KEY ("districtId") REFERENCES "reg_districts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DataTransporter" ADD CONSTRAINT "DataTransporter_villageId_fkey" FOREIGN KEY ("villageId") REFERENCES "reg_village"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DataCustomerFinal" ADD CONSTRAINT "DataCustomerFinal_pelaporanId_fkey" FOREIGN KEY ("pelaporanId") REFERENCES "PelaporanBahanB3DistribusiFinal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DataTransporterFinal" ADD CONSTRAINT "DataTransporterFinal_pelaporanId_fkey" FOREIGN KEY ("pelaporanId") REFERENCES "PelaporanBahanB3DistribusiFinal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DataPerusahaanAsalMuatOnPengakutanDetail" ADD CONSTRAINT "DataPerusahaanAsalMuatOnPengakutanDetail_pengangkutanDetai_fkey" FOREIGN KEY ("pengangkutanDetailId") REFERENCES "PengangkutanDetail"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DataPerusahaanAsalMuatOnPengakutanDetail" ADD CONSTRAINT "DataPerusahaanAsalMuatOnPengakutanDetail_perusahaanAsalMua_fkey" FOREIGN KEY ("perusahaanAsalMuatId") REFERENCES "PerusahaanAsalMuat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DataPerusahaanTujuanBongkarOnPengakutanDetail" ADD CONSTRAINT "DataPerusahaanTujuanBongkarOnPengakutanDetail_pengangkutan_fkey" FOREIGN KEY ("pengangkutanDetailId") REFERENCES "PengangkutanDetail"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DataPerusahaanTujuanBongkarOnPengakutanDetail" ADD CONSTRAINT "DataPerusahaanTujuanBongkarOnPengakutanDetail_perusahaanTu_fkey" FOREIGN KEY ("perusahaanTujuanBongkarId") REFERENCES "PerusahaanTujuanBongkar"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DataPerusahaanAsalMuatOnPengakutanDetailFinal" ADD CONSTRAINT "DataPerusahaanAsalMuatOnPengakutanDetailFinal_pengangkutan_fkey" FOREIGN KEY ("pengangkutanDetailId") REFERENCES "LaporanPengangkutanFinalDetail"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DataPerusahaanAsalMuatOnPengakutanDetailFinal" ADD CONSTRAINT "DataPerusahaanAsalMuatOnPengakutanDetailFinal_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DataPerusahaanAsalMuatOnPengakutanDetailFinal" ADD CONSTRAINT "DataPerusahaanAsalMuatOnPengakutanDetailFinal_provinceId_fkey" FOREIGN KEY ("provinceId") REFERENCES "reg_provinces"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DataPerusahaanAsalMuatOnPengakutanDetailFinal" ADD CONSTRAINT "DataPerusahaanAsalMuatOnPengakutanDetailFinal_regencyId_fkey" FOREIGN KEY ("regencyId") REFERENCES "reg_regencies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DataPerusahaanAsalMuatOnPengakutanDetailFinal" ADD CONSTRAINT "DataPerusahaanAsalMuatOnPengakutanDetailFinal_districtId_fkey" FOREIGN KEY ("districtId") REFERENCES "reg_districts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DataPerusahaanAsalMuatOnPengakutanDetailFinal" ADD CONSTRAINT "DataPerusahaanAsalMuatOnPengakutanDetailFinal_villageId_fkey" FOREIGN KEY ("villageId") REFERENCES "reg_village"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DataPerusahaanTujuanBongkarOnPengakutanDetailFinal" ADD CONSTRAINT "DataPerusahaanTujuanBongkarOnPengakutanDetailFinal_pengang_fkey" FOREIGN KEY ("pengangkutanDetailId") REFERENCES "LaporanPengangkutanFinalDetail"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DataPerusahaanTujuanBongkarOnPengakutanDetailFinal" ADD CONSTRAINT "DataPerusahaanTujuanBongkarOnPengakutanDetailFinal_company_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DataPerusahaanTujuanBongkarOnPengakutanDetailFinal" ADD CONSTRAINT "DataPerusahaanTujuanBongkarOnPengakutanDetailFinal_provinc_fkey" FOREIGN KEY ("provinceId") REFERENCES "reg_provinces"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DataPerusahaanTujuanBongkarOnPengakutanDetailFinal" ADD CONSTRAINT "DataPerusahaanTujuanBongkarOnPengakutanDetailFinal_regency_fkey" FOREIGN KEY ("regencyId") REFERENCES "reg_regencies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DataPerusahaanTujuanBongkarOnPengakutanDetailFinal" ADD CONSTRAINT "DataPerusahaanTujuanBongkarOnPengakutanDetailFinal_distric_fkey" FOREIGN KEY ("districtId") REFERENCES "reg_districts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DataPerusahaanTujuanBongkarOnPengakutanDetailFinal" ADD CONSTRAINT "DataPerusahaanTujuanBongkarOnPengakutanDetailFinal_village_fkey" FOREIGN KEY ("villageId") REFERENCES "reg_village"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DataTembusanToDraftSurat" ADD CONSTRAINT "_DataTembusanToDraftSurat_A_fkey" FOREIGN KEY ("A") REFERENCES "DataTembusan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DataTembusanToDraftSurat" ADD CONSTRAINT "_DataTembusanToDraftSurat_B_fkey" FOREIGN KEY ("B") REFERENCES "DraftSurat"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BaseSuratNotfikasiToDataTembusan" ADD CONSTRAINT "_BaseSuratNotfikasiToDataTembusan_A_fkey" FOREIGN KEY ("A") REFERENCES "BaseSuratNotfikasi"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BaseSuratNotfikasiToDataTembusan" ADD CONSTRAINT "_BaseSuratNotfikasiToDataTembusan_B_fkey" FOREIGN KEY ("B") REFERENCES "DataTembusan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DataPICToDataTransporter" ADD CONSTRAINT "_DataPICToDataTransporter_A_fkey" FOREIGN KEY ("A") REFERENCES "DataPIC"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DataPICToDataTransporter" ADD CONSTRAINT "_DataPICToDataTransporter_B_fkey" FOREIGN KEY ("B") REFERENCES "DataTransporter"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DataPICFinalToDataSupplierOnPelaporanPenggunaanB3Final" ADD CONSTRAINT "_DataPICFinalToDataSupplierOnPelaporanPenggunaanB3Final_A_fkey" FOREIGN KEY ("A") REFERENCES "DataPICFinal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DataPICFinalToDataSupplierOnPelaporanPenggunaanB3Final" ADD CONSTRAINT "_DataPICFinalToDataSupplierOnPelaporanPenggunaanB3Final_B_fkey" FOREIGN KEY ("B") REFERENCES "DataSupplierOnPelaporanPenggunaanB3Final"("id") ON DELETE CASCADE ON UPDATE CASCADE;
