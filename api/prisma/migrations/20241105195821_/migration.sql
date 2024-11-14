/*
  Warnings:

  - Added the required column `kategori_b3` to the `BahanB3Registrasi` table without a default value. This is not possible if the table is not empty.
  - Added the required column `negara_muat` to the `BahanB3Registrasi` table without a default value. This is not possible if the table is not empty.
  - Added the required column `penggunaan` to the `BahanB3Registrasi` table without a default value. This is not possible if the table is not empty.
  - Added the required column `penghasil_bahan_kimia` to the `BahanB3Registrasi` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "BahanB3Registrasi" ADD COLUMN     "kategori_b3" TEXT NOT NULL,
ADD COLUMN     "negara_muat" TEXT NOT NULL,
ADD COLUMN     "penggunaan" TEXT NOT NULL,
ADD COLUMN     "penghasil_bahan_kimia" TEXT NOT NULL;
