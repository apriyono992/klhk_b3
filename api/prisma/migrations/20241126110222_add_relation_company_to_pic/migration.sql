/*
  Warnings:

  - You are about to alter the column `jumlah_impor` on the `BahanB3Registrasi` table. The data in that column could be lost. The data in that column will be cast from `Decimal(15,2)` to `Decimal(15,4)`.
  - You are about to alter the column `jumlah_impor_per_tahun` on the `BahanB3Registrasi` table. The data in that column could be lost. The data in that column will be cast from `Decimal(15,2)` to `Decimal(15,4)`.
  - Added the required column `companyId` to the `DataPIC` table without a default value. This is not possible if the table is not empty.
  - Added the required column `companyId` to the `DataPICFinal` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "PelaporanPenggunaanBahanB3" DROP CONSTRAINT "PelaporanPenggunaanBahanB3_dataBahanB3Id_fkey";

-- AlterTable
ALTER TABLE "BahanB3Registrasi" ALTER COLUMN "jumlah_impor" SET DATA TYPE DECIMAL(15,4),
ALTER COLUMN "jumlah_impor_per_tahun" SET DATA TYPE DECIMAL(15,4);

-- AlterTable
ALTER TABLE "DataPIC" ADD COLUMN     "companyId" TEXT NOT NULL,
ADD COLUMN     "type" TEXT;

-- AlterTable
ALTER TABLE "DataPICFinal" ADD COLUMN     "companyId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "PelaporanPenggunaanBahanB3" ALTER COLUMN "dataBahanB3Id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "DataPIC" ADD CONSTRAINT "DataPIC_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PelaporanPenggunaanBahanB3" ADD CONSTRAINT "PelaporanPenggunaanBahanB3_dataBahanB3Id_fkey" FOREIGN KEY ("dataBahanB3Id") REFERENCES "DataBahanB3"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DataPICFinal" ADD CONSTRAINT "DataPICFinal_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
