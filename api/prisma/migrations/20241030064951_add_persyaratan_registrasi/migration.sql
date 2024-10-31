/*
  Warnings:

  - The primary key for the `reg_provinces` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `reg_provinces` table. The data in that column could be lost. The data in that column will be cast from `Text` to `Char(2)`.

*/
-- AlterTable
ALTER TABLE "reg_provinces" DROP CONSTRAINT "reg_provinces_pkey",
ALTER COLUMN "id" SET DATA TYPE CHAR(2),
ADD CONSTRAINT "reg_provinces_pkey" PRIMARY KEY ("id");

-- CreateTable
CREATE TABLE "PelaporanPengangkutan" (
    "id" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "vehicleId" TEXT NOT NULL,
    "bulan" INTEGER NOT NULL,
    "tahun" INTEGER NOT NULL,
    "periodId" TEXT NOT NULL,
    "isDraft" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PelaporanPengangkutan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PengangkutanDetail" (
    "id" TEXT NOT NULL,
    "pelaporanPengangkutanId" TEXT NOT NULL,
    "b3SubstanceId" TEXT NOT NULL,
    "jumlahB3" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PengangkutanDetail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PerusahaanAsalMuat" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "pengangkutanDetailId" TEXT NOT NULL,
    "namaPerusahaan" TEXT NOT NULL,
    "alamat" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "locationType" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PerusahaanAsalMuat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PerusahaanTujuanBongkar" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "pengangkutanDetailId" TEXT NOT NULL,
    "namaPerusahaan" TEXT NOT NULL,
    "alamat" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PerusahaanTujuanBongkar_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Period" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "finalizationDeadline" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Period_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RegistrasiPersyaratan" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "document_number" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "notes" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'dibuat',
    "approved_by" TEXT,
    "registrasiId" TEXT,

    CONSTRAINT "RegistrasiPersyaratan_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PelaporanPengangkutan_vehicleId_bulan_tahun_key" ON "PelaporanPengangkutan"("vehicleId", "bulan", "tahun");

-- CreateIndex
CREATE UNIQUE INDEX "PengangkutanDetail_b3SubstanceId_pelaporanPengangkutanId_key" ON "PengangkutanDetail"("b3SubstanceId", "pelaporanPengangkutanId");

-- AddForeignKey
ALTER TABLE "Location" ADD CONSTRAINT "Location_provinceId_fkey" FOREIGN KEY ("provinceId") REFERENCES "reg_provinces"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reg_regencies" ADD CONSTRAINT "reg_regencies_provinceId_fkey" FOREIGN KEY ("provinceId") REFERENCES "reg_provinces"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PelaporanPengangkutan" ADD CONSTRAINT "PelaporanPengangkutan_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PelaporanPengangkutan" ADD CONSTRAINT "PelaporanPengangkutan_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PelaporanPengangkutan" ADD CONSTRAINT "PelaporanPengangkutan_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PelaporanPengangkutan" ADD CONSTRAINT "PelaporanPengangkutan_periodId_fkey" FOREIGN KEY ("periodId") REFERENCES "Period"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PengangkutanDetail" ADD CONSTRAINT "PengangkutanDetail_pelaporanPengangkutanId_fkey" FOREIGN KEY ("pelaporanPengangkutanId") REFERENCES "PelaporanPengangkutan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PengangkutanDetail" ADD CONSTRAINT "PengangkutanDetail_b3SubstanceId_fkey" FOREIGN KEY ("b3SubstanceId") REFERENCES "B3Substance"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PerusahaanAsalMuat" ADD CONSTRAINT "PerusahaanAsalMuat_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PerusahaanAsalMuat" ADD CONSTRAINT "PerusahaanAsalMuat_pengangkutanDetailId_fkey" FOREIGN KEY ("pengangkutanDetailId") REFERENCES "PengangkutanDetail"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PerusahaanTujuanBongkar" ADD CONSTRAINT "PerusahaanTujuanBongkar_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PerusahaanTujuanBongkar" ADD CONSTRAINT "PerusahaanTujuanBongkar_pengangkutanDetailId_fkey" FOREIGN KEY ("pengangkutanDetailId") REFERENCES "PengangkutanDetail"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RegistrasiPersyaratan" ADD CONSTRAINT "RegistrasiPersyaratan_registrasiId_fkey" FOREIGN KEY ("registrasiId") REFERENCES "Registrasi"("id") ON DELETE SET NULL ON UPDATE CASCADE;
