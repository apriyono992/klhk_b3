/*
  Warnings:

  - You are about to drop the `PelaporanPengangkutan` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PengangkutanDetail` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Period` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PerusahaanAsalMuat` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PerusahaanTujuanBongkar` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "PelaporanPengangkutan" DROP CONSTRAINT "PelaporanPengangkutan_applicationId_fkey";

-- DropForeignKey
ALTER TABLE "PelaporanPengangkutan" DROP CONSTRAINT "PelaporanPengangkutan_companyId_fkey";

-- DropForeignKey
ALTER TABLE "PelaporanPengangkutan" DROP CONSTRAINT "PelaporanPengangkutan_periodId_fkey";

-- DropForeignKey
ALTER TABLE "PelaporanPengangkutan" DROP CONSTRAINT "PelaporanPengangkutan_vehicleId_fkey";

-- DropForeignKey
ALTER TABLE "PengangkutanDetail" DROP CONSTRAINT "PengangkutanDetail_b3SubstanceId_fkey";

-- DropForeignKey
ALTER TABLE "PengangkutanDetail" DROP CONSTRAINT "PengangkutanDetail_pelaporanPengangkutanId_fkey";

-- DropForeignKey
ALTER TABLE "PerusahaanAsalMuat" DROP CONSTRAINT "PerusahaanAsalMuat_companyId_fkey";

-- DropForeignKey
ALTER TABLE "PerusahaanAsalMuat" DROP CONSTRAINT "PerusahaanAsalMuat_pengangkutanDetailId_fkey";

-- DropForeignKey
ALTER TABLE "PerusahaanTujuanBongkar" DROP CONSTRAINT "PerusahaanTujuanBongkar_companyId_fkey";

-- DropForeignKey
ALTER TABLE "PerusahaanTujuanBongkar" DROP CONSTRAINT "PerusahaanTujuanBongkar_pengangkutanDetailId_fkey";

-- DropTable
DROP TABLE "PelaporanPengangkutan";

-- DropTable
DROP TABLE "PengangkutanDetail";

-- DropTable
DROP TABLE "Period";

-- DropTable
DROP TABLE "PerusahaanAsalMuat";

-- DropTable
DROP TABLE "PerusahaanTujuanBongkar";

-- AddForeignKey
ALTER TABLE "NotifikasiStatusHistory" ADD CONSTRAINT "NotifikasiStatusHistory_changedBy_fkey" FOREIGN KEY ("changedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
