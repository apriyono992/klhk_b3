/*
  Warnings:

  - A unique constraint covering the columns `[companyId,applicationId,bulan,tahun,periodId,vehicleId]` on the table `KewajibanPelaporanAplikasi` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[companyId,periodId,bulan,tahun,jenisLaporan]` on the table `KewajibanPelaporanPerusahaan` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[registrasiId,companyId,bulan,tahun,periodId]` on the table `KewajibanPelaporanRegistrasi` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "DataPIC" DROP CONSTRAINT "DataPIC_companyId_fkey";

-- DropIndex
DROP INDEX "KewajibanPelaporanAplikasi_companyId_applicationId_periodId_key";

-- DropIndex
DROP INDEX "KewajibanPelaporanPerusahaan_companyId_periodId_jenisLapora_key";

-- DropIndex
DROP INDEX "KewajibanPelaporanRegistrasi_registrasiId_companyId_periodI_key";

-- AlterTable
ALTER TABLE "DataPIC" ALTER COLUMN "companyId" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "KewajibanPelaporanAplikasi_companyId_applicationId_bulan_ta_key" ON "KewajibanPelaporanAplikasi"("companyId", "applicationId", "bulan", "tahun", "periodId", "vehicleId");

-- CreateIndex
CREATE UNIQUE INDEX "KewajibanPelaporanPerusahaan_companyId_periodId_bulan_tahun_key" ON "KewajibanPelaporanPerusahaan"("companyId", "periodId", "bulan", "tahun", "jenisLaporan");

-- CreateIndex
CREATE UNIQUE INDEX "KewajibanPelaporanRegistrasi_registrasiId_companyId_bulan_t_key" ON "KewajibanPelaporanRegistrasi"("registrasiId", "companyId", "bulan", "tahun", "periodId");

-- AddForeignKey
ALTER TABLE "DataPIC" ADD CONSTRAINT "DataPIC_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE SET NULL ON UPDATE CASCADE;
