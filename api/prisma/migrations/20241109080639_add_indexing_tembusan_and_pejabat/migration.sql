/*
  Warnings:

  - You are about to drop the `_BaseSuratNotfikasiToDataTembusan` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_DataPejabatToTelaahTeknisRekomendasiB3` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_DataTembusanToDraftSurat` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_BaseSuratNotfikasiToDataTembusan" DROP CONSTRAINT "_BaseSuratNotfikasiToDataTembusan_A_fkey";

-- DropForeignKey
ALTER TABLE "_BaseSuratNotfikasiToDataTembusan" DROP CONSTRAINT "_BaseSuratNotfikasiToDataTembusan_B_fkey";

-- DropForeignKey
ALTER TABLE "_DataPejabatToTelaahTeknisRekomendasiB3" DROP CONSTRAINT "_DataPejabatToTelaahTeknisRekomendasiB3_A_fkey";

-- DropForeignKey
ALTER TABLE "_DataPejabatToTelaahTeknisRekomendasiB3" DROP CONSTRAINT "_DataPejabatToTelaahTeknisRekomendasiB3_B_fkey";

-- DropForeignKey
ALTER TABLE "_DataTembusanToDraftSurat" DROP CONSTRAINT "_DataTembusanToDraftSurat_A_fkey";

-- DropForeignKey
ALTER TABLE "_DataTembusanToDraftSurat" DROP CONSTRAINT "_DataTembusanToDraftSurat_B_fkey";

-- AlterTable
ALTER TABLE "LocationDetails" ADD COLUMN     "districtId" TEXT,
ADD COLUMN     "provinceId" TEXT,
ADD COLUMN     "regencyId" TEXT,
ADD COLUMN     "villageId" TEXT;

-- DropTable
DROP TABLE "_BaseSuratNotfikasiToDataTembusan";

-- DropTable
DROP TABLE "_DataPejabatToTelaahTeknisRekomendasiB3";

-- DropTable
DROP TABLE "_DataTembusanToDraftSurat";

-- CreateTable
CREATE TABLE "TelaahTeknisPejabat" (
    "id" TEXT NOT NULL,
    "telaahTeknisId" TEXT NOT NULL,
    "dataPejabatId" TEXT NOT NULL,
    "index" INTEGER NOT NULL,

    CONSTRAINT "TelaahTeknisPejabat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PermohonanRekomendasiTembusan" (
    "id" TEXT NOT NULL,
    "draftSuratId" TEXT NOT NULL,
    "dataTembusanId" TEXT NOT NULL,
    "index" INTEGER NOT NULL,

    CONSTRAINT "PermohonanRekomendasiTembusan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NotifikasiTembusan" (
    "id" TEXT NOT NULL,
    "baseSuratNotifikasiId" TEXT NOT NULL,
    "dataTembusanId" TEXT NOT NULL,
    "index" INTEGER NOT NULL,

    CONSTRAINT "NotifikasiTembusan_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TelaahTeknisPejabat_telaahTeknisId_dataPejabatId_key" ON "TelaahTeknisPejabat"("telaahTeknisId", "dataPejabatId");

-- CreateIndex
CREATE UNIQUE INDEX "PermohonanRekomendasiTembusan_draftSuratId_dataTembusanId_key" ON "PermohonanRekomendasiTembusan"("draftSuratId", "dataTembusanId");

-- CreateIndex
CREATE UNIQUE INDEX "NotifikasiTembusan_baseSuratNotifikasiId_dataTembusanId_key" ON "NotifikasiTembusan"("baseSuratNotifikasiId", "dataTembusanId");

-- AddForeignKey
ALTER TABLE "LocationDetails" ADD CONSTRAINT "LocationDetails_provinceId_fkey" FOREIGN KEY ("provinceId") REFERENCES "reg_provinces"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LocationDetails" ADD CONSTRAINT "LocationDetails_regencyId_fkey" FOREIGN KEY ("regencyId") REFERENCES "reg_regencies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LocationDetails" ADD CONSTRAINT "LocationDetails_districtId_fkey" FOREIGN KEY ("districtId") REFERENCES "reg_districts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LocationDetails" ADD CONSTRAINT "LocationDetails_villageId_fkey" FOREIGN KEY ("villageId") REFERENCES "reg_village"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TelaahTeknisPejabat" ADD CONSTRAINT "TelaahTeknisPejabat_telaahTeknisId_fkey" FOREIGN KEY ("telaahTeknisId") REFERENCES "TelaahTeknisRekomendasiB3"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TelaahTeknisPejabat" ADD CONSTRAINT "TelaahTeknisPejabat_dataPejabatId_fkey" FOREIGN KEY ("dataPejabatId") REFERENCES "DataPejabat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PermohonanRekomendasiTembusan" ADD CONSTRAINT "PermohonanRekomendasiTembusan_draftSuratId_fkey" FOREIGN KEY ("draftSuratId") REFERENCES "DraftSurat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PermohonanRekomendasiTembusan" ADD CONSTRAINT "PermohonanRekomendasiTembusan_dataTembusanId_fkey" FOREIGN KEY ("dataTembusanId") REFERENCES "DataTembusan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotifikasiTembusan" ADD CONSTRAINT "NotifikasiTembusan_baseSuratNotifikasiId_fkey" FOREIGN KEY ("baseSuratNotifikasiId") REFERENCES "BaseSuratNotfikasi"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotifikasiTembusan" ADD CONSTRAINT "NotifikasiTembusan_dataTembusanId_fkey" FOREIGN KEY ("dataTembusanId") REFERENCES "DataTembusan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
