/*
  Warnings:

  - You are about to drop the `SuratOnVehicle` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SuratRekomendasiB3` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[name]` on the table `Company` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[npwp]` on the table `Company` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[nomorInduk]` on the table `Company` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[kodeDBKlh]` on the table `Company` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[noPolisi]` on the table `Vehicle` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `Company` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `DataBahanB3` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `DataPejabat` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `DataTembusan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Vehicle` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "SuratOnVehicle" DROP CONSTRAINT "SuratOnVehicle_suratId_fkey";

-- DropForeignKey
ALTER TABLE "SuratOnVehicle" DROP CONSTRAINT "SuratOnVehicle_vehicleId_fkey";

-- DropForeignKey
ALTER TABLE "SuratRekomendasiB3" DROP CONSTRAINT "SuratRekomendasiB3_companyId_fkey";

-- AlterTable
ALTER TABLE "Company" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "DataBahanB3" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "DataPejabat" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "DataTembusan" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Vehicle" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- DropTable
DROP TABLE "SuratOnVehicle";

-- DropTable
DROP TABLE "SuratRekomendasiB3";

-- CreateTable
CREATE TABLE "IdentitasApplication" (
    "id" TEXT NOT NULL,
    "namaPemohon" TEXT NOT NULL,
    "jabatan" TEXT NOT NULL,
    "alamatDomisili" TEXT NOT NULL,
    "teleponFax" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "npwp" TEXT,
    "ktp" TEXT,
    "companyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "IdentitasApplication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Application" (
    "id" TEXT NOT NULL,
    "kodePermohonan" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "tipeSurat" TEXT NOT NULL,
    "tanggalPengajuan" TIMESTAMP(3) NOT NULL,
    "tanggalDisetujui" TIMESTAMP(3),
    "tanggalBerakhir" TIMESTAMP(3),
    "companyId" TEXT NOT NULL,
    "identitasPemohonId" TEXT,
    "requiredDocumentsStatus" JSONB NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Application_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ApplicationStatusHistory" (
    "id" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "oldStatus" TEXT,
    "newStatus" TEXT NOT NULL,
    "changedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "changedBy" TEXT,

    CONSTRAINT "ApplicationStatusHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ApplicationOnVehicle" (
    "applicationId" TEXT NOT NULL,
    "vehicleId" TEXT NOT NULL,

    CONSTRAINT "ApplicationOnVehicle_pkey" PRIMARY KEY ("applicationId","vehicleId")
);

-- CreateTable
CREATE TABLE "B3Substance" (
    "id" TEXT NOT NULL,
    "dataBahanB3Id" TEXT NOT NULL,
    "b3pp74" BOOLEAN NOT NULL,
    "b3DiluarList" BOOLEAN NOT NULL,
    "karakteristikB3" TEXT NOT NULL,
    "fasaB3" TEXT NOT NULL,
    "jenisKemasan" TEXT NOT NULL,
    "asalMuat" TEXT NOT NULL,
    "tujuanBongkar" TEXT NOT NULL,
    "tujuanPenggunaan" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "B3Substance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DocumentRekomendasiB3" (
    "id" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "documentType" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "isValid" BOOLEAN,
    "validationNotes" TEXT,
    "applicationId" TEXT NOT NULL,
    "isArchived" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DocumentRekomendasiB3_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DraftSurat" (
    "id" TEXT NOT NULL,
    "nomorSurat" TEXT,
    "tanggalSurat" TIMESTAMP(3),
    "tipeSurat" TEXT NOT NULL,
    "kodeDBKlh" TEXT,
    "pejabatId" TEXT,
    "applicationId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DraftSurat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FinalSurat" (
    "id" TEXT NOT NULL,
    "nomorSurat" TEXT NOT NULL,
    "tanggalSurat" TIMESTAMP(3) NOT NULL,
    "pejabatId" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "signedByDirector" BOOLEAN NOT NULL DEFAULT false,
    "signatureUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FinalSurat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_DataTembusanToDraftSurat" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_DataTembusanToFinalSurat" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Application_kodePermohonan_key" ON "Application"("kodePermohonan");

-- CreateIndex
CREATE UNIQUE INDEX "DraftSurat_applicationId_key" ON "DraftSurat"("applicationId");

-- CreateIndex
CREATE UNIQUE INDEX "FinalSurat_applicationId_key" ON "FinalSurat"("applicationId");

-- CreateIndex
CREATE UNIQUE INDEX "_DataTembusanToDraftSurat_AB_unique" ON "_DataTembusanToDraftSurat"("A", "B");

-- CreateIndex
CREATE INDEX "_DataTembusanToDraftSurat_B_index" ON "_DataTembusanToDraftSurat"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_DataTembusanToFinalSurat_AB_unique" ON "_DataTembusanToFinalSurat"("A", "B");

-- CreateIndex
CREATE INDEX "_DataTembusanToFinalSurat_B_index" ON "_DataTembusanToFinalSurat"("B");

-- CreateIndex
CREATE UNIQUE INDEX "Company_name_key" ON "Company"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Company_npwp_key" ON "Company"("npwp");

-- CreateIndex
CREATE UNIQUE INDEX "Company_nomorInduk_key" ON "Company"("nomorInduk");

-- CreateIndex
CREATE UNIQUE INDEX "Company_kodeDBKlh_key" ON "Company"("kodeDBKlh");

-- CreateIndex
CREATE UNIQUE INDEX "Vehicle_noPolisi_key" ON "Vehicle"("noPolisi");

-- AddForeignKey
ALTER TABLE "IdentitasApplication" ADD CONSTRAINT "IdentitasApplication_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_identitasPemohonId_fkey" FOREIGN KEY ("identitasPemohonId") REFERENCES "IdentitasApplication"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApplicationStatusHistory" ADD CONSTRAINT "ApplicationStatusHistory_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApplicationOnVehicle" ADD CONSTRAINT "ApplicationOnVehicle_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApplicationOnVehicle" ADD CONSTRAINT "ApplicationOnVehicle_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "B3Substance" ADD CONSTRAINT "B3Substance_dataBahanB3Id_fkey" FOREIGN KEY ("dataBahanB3Id") REFERENCES "DataBahanB3"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "B3Substance" ADD CONSTRAINT "B3Substance_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentRekomendasiB3" ADD CONSTRAINT "DocumentRekomendasiB3_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DraftSurat" ADD CONSTRAINT "DraftSurat_pejabatId_fkey" FOREIGN KEY ("pejabatId") REFERENCES "DataPejabat"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DraftSurat" ADD CONSTRAINT "DraftSurat_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FinalSurat" ADD CONSTRAINT "FinalSurat_pejabatId_fkey" FOREIGN KEY ("pejabatId") REFERENCES "DataPejabat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FinalSurat" ADD CONSTRAINT "FinalSurat_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DataTembusanToDraftSurat" ADD CONSTRAINT "_DataTembusanToDraftSurat_A_fkey" FOREIGN KEY ("A") REFERENCES "DataTembusan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DataTembusanToDraftSurat" ADD CONSTRAINT "_DataTembusanToDraftSurat_B_fkey" FOREIGN KEY ("B") REFERENCES "DraftSurat"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DataTembusanToFinalSurat" ADD CONSTRAINT "_DataTembusanToFinalSurat_A_fkey" FOREIGN KEY ("A") REFERENCES "DataTembusan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DataTembusanToFinalSurat" ADD CONSTRAINT "_DataTembusanToFinalSurat_B_fkey" FOREIGN KEY ("B") REFERENCES "FinalSurat"("id") ON DELETE CASCADE ON UPDATE CASCADE;
