/*
  Warnings:

  - The `asal_negara` column on the `BahanB3Registrasi` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `negara_muat` column on the `BahanB3Registrasi` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "BahanB3Registrasi" DROP COLUMN "asal_negara",
ADD COLUMN     "asal_negara" TEXT[],
DROP COLUMN "negara_muat",
ADD COLUMN     "negara_muat" TEXT[];
