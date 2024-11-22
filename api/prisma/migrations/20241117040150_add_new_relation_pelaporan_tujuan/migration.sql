/*
  Warnings:

  - You are about to drop the column `locationType` on the `DataPerusahaanAsalMuatOnPengakutanDetailFinal` table. All the data in the column will be lost.
  - You are about to drop the `ApiResponse` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `latitudeAsalMuat` to the `DataPerusahaanTujuanBongkarOnPengakutanDetail` table without a default value. This is not possible if the table is not empty.
  - Added the required column `latitudeTujuan` to the `DataPerusahaanTujuanBongkarOnPengakutanDetail` table without a default value. This is not possible if the table is not empty.
  - Added the required column `locationTypeAsalMuat` to the `DataPerusahaanTujuanBongkarOnPengakutanDetail` table without a default value. This is not possible if the table is not empty.
  - Added the required column `locationTypeTujuan` to the `DataPerusahaanTujuanBongkarOnPengakutanDetail` table without a default value. This is not possible if the table is not empty.
  - Added the required column `longitudeAsalMuat` to the `DataPerusahaanTujuanBongkarOnPengakutanDetail` table without a default value. This is not possible if the table is not empty.
  - Added the required column `longitudeTujuan` to the `DataPerusahaanTujuanBongkarOnPengakutanDetail` table without a default value. This is not possible if the table is not empty.
  - Added the required column `perusahaanAsalMuatId` to the `DataPerusahaanTujuanBongkarOnPengakutanDetail` table without a default value. This is not possible if the table is not empty.
  - Added the required column `DataPerusahaanAsalMuatOnPengakutanDetailFinalId` to the `DataPerusahaanTujuanBongkarOnPengakutanDetailFinal` table without a default value. This is not possible if the table is not empty.
  - Added the required column `latitudeAsalMuat` to the `DataPerusahaanTujuanBongkarOnPengakutanDetailFinal` table without a default value. This is not possible if the table is not empty.
  - Added the required column `latitudeTujuan` to the `DataPerusahaanTujuanBongkarOnPengakutanDetailFinal` table without a default value. This is not possible if the table is not empty.
  - Added the required column `locationTypeAsalMuat` to the `DataPerusahaanTujuanBongkarOnPengakutanDetailFinal` table without a default value. This is not possible if the table is not empty.
  - Added the required column `locationTypeTujuan` to the `DataPerusahaanTujuanBongkarOnPengakutanDetailFinal` table without a default value. This is not possible if the table is not empty.
  - Added the required column `longitudeAsalMuat` to the `DataPerusahaanTujuanBongkarOnPengakutanDetailFinal` table without a default value. This is not possible if the table is not empty.
  - Added the required column `longitudeTujuan` to the `DataPerusahaanTujuanBongkarOnPengakutanDetailFinal` table without a default value. This is not possible if the table is not empty.
  - Added the required column `locationType` to the `PerusahaanTujuanBongkar` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "DataPerusahaanAsalMuatOnPengakutanDetailFinal" DROP COLUMN "locationType";

-- AlterTable
ALTER TABLE "DataPerusahaanTujuanBongkarOnPengakutanDetail" ADD COLUMN     "latitudeAsalMuat" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "latitudeTujuan" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "locationTypeAsalMuat" TEXT NOT NULL,
ADD COLUMN     "locationTypeTujuan" TEXT NOT NULL,
ADD COLUMN     "longitudeAsalMuat" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "longitudeTujuan" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "perusahaanAsalMuatId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "DataPerusahaanTujuanBongkarOnPengakutanDetailFinal" ADD COLUMN     "DataPerusahaanAsalMuatOnPengakutanDetailFinalId" TEXT NOT NULL,
ADD COLUMN     "latitudeAsalMuat" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "latitudeTujuan" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "locationTypeAsalMuat" TEXT NOT NULL,
ADD COLUMN     "locationTypeTujuan" TEXT NOT NULL,
ADD COLUMN     "longitudeAsalMuat" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "longitudeTujuan" DOUBLE PRECISION NOT NULL,
ALTER COLUMN "locationType" DROP NOT NULL;

-- AlterTable
ALTER TABLE "PerusahaanTujuanBongkar" ADD COLUMN     "locationType" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Registrasi" ALTER COLUMN "tahun" DROP NOT NULL,
ALTER COLUMN "tahun" SET DEFAULT 2021,
ALTER COLUMN "bulan" DROP NOT NULL,
ALTER COLUMN "bulan" SET DEFAULT 'Januari';

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "rolesId" DROP NOT NULL,
ALTER COLUMN "rolesId" DROP DEFAULT;

-- DropTable
DROP TABLE "ApiResponse";

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

-- CreateIndex
CREATE UNIQUE INDEX "_DataTembusanToDraftSurat_AB_unique" ON "_DataTembusanToDraftSurat"("A", "B");

-- CreateIndex
CREATE INDEX "_DataTembusanToDraftSurat_B_index" ON "_DataTembusanToDraftSurat"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_BaseSuratNotfikasiToDataTembusan_AB_unique" ON "_BaseSuratNotfikasiToDataTembusan"("A", "B");

-- CreateIndex
CREATE INDEX "_BaseSuratNotfikasiToDataTembusan_B_index" ON "_BaseSuratNotfikasiToDataTembusan"("B");

-- AddForeignKey
ALTER TABLE "DataPerusahaanTujuanBongkarOnPengakutanDetail" ADD CONSTRAINT "DataPerusahaanTujuanBongkarOnPengakutanDetail_perusahaanAs_fkey" FOREIGN KEY ("perusahaanAsalMuatId") REFERENCES "PerusahaanAsalMuat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DataPerusahaanTujuanBongkarOnPengakutanDetailFinal" ADD CONSTRAINT "DataPerusahaanTujuanBongkarOnPengakutanDetailFinal_DataPer_fkey" FOREIGN KEY ("DataPerusahaanAsalMuatOnPengakutanDetailFinalId") REFERENCES "DataPerusahaanAsalMuatOnPengakutanDetailFinal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DataTembusanToDraftSurat" ADD CONSTRAINT "_DataTembusanToDraftSurat_A_fkey" FOREIGN KEY ("A") REFERENCES "DataTembusan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DataTembusanToDraftSurat" ADD CONSTRAINT "_DataTembusanToDraftSurat_B_fkey" FOREIGN KEY ("B") REFERENCES "DraftSurat"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BaseSuratNotfikasiToDataTembusan" ADD CONSTRAINT "_BaseSuratNotfikasiToDataTembusan_A_fkey" FOREIGN KEY ("A") REFERENCES "BaseSuratNotfikasi"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BaseSuratNotfikasiToDataTembusan" ADD CONSTRAINT "_BaseSuratNotfikasiToDataTembusan_B_fkey" FOREIGN KEY ("B") REFERENCES "DataTembusan"("id") ON DELETE CASCADE ON UPDATE CASCADE;
