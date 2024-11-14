/*
  Warnings:

  - You are about to drop the column `registrasiId` on the `B3Substance` table. All the data in the column will be lost.
  - You are about to drop the column `no_reg_bahanb3` on the `Registrasi` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "B3Substance" DROP CONSTRAINT "B3Substance_registrasiId_fkey";

-- AlterTable
ALTER TABLE "B3Substance" DROP COLUMN "registrasiId";

-- AlterTable
ALTER TABLE "Registrasi" DROP COLUMN "no_reg_bahanb3",
ADD COLUMN     "no_reg" TEXT,
ADD COLUMN     "sub_layanan" TEXT;

-- CreateTable
CREATE TABLE "BahanB3Registrasi" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "no_reg_bahan" TEXT NOT NULL,
    "nama_bahan" TEXT NOT NULL,
    "nama_dagang" TEXT NOT NULL,
    "cas_number" TEXT NOT NULL,
    "hs_code" TEXT NOT NULL,
    "klasifikasi_b3" TEXT NOT NULL,
    "karakteristik_b3" TEXT NOT NULL,
    "tujuan_penggunaan" TEXT NOT NULL,
    "jumlah_impor" DECIMAL(15,2) NOT NULL,
    "jumlah_impor_per_tahun" DECIMAL(15,2) NOT NULL,
    "pelaksanaan_rencana_impor" INTEGER NOT NULL,
    "asal_negara" TEXT NOT NULL,
    "alamat_penghasil_b3" TEXT NOT NULL,
    "pelabuhan_asal" TEXT NOT NULL,
    "pelabuhan_muat" TEXT NOT NULL,
    "pelabuhan_bongkar" TEXT NOT NULL,
    "provinsi_pelabuhan_bongkar" TEXT NOT NULL,
    "registrasiId" TEXT,
    "SektorPenggunaanB3" JSONB[],

    CONSTRAINT "BahanB3Registrasi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HistoryStatusRegistrasi" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "registrasiId" TEXT,
    "status" TEXT NOT NULL,

    CONSTRAINT "HistoryStatusRegistrasi_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "BahanB3Registrasi" ADD CONSTRAINT "BahanB3Registrasi_registrasiId_fkey" FOREIGN KEY ("registrasiId") REFERENCES "Registrasi"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HistoryStatusRegistrasi" ADD CONSTRAINT "HistoryStatusRegistrasi_registrasiId_fkey" FOREIGN KEY ("registrasiId") REFERENCES "Registrasi"("id") ON DELETE SET NULL ON UPDATE CASCADE;
