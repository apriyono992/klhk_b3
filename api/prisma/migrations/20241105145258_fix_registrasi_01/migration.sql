/*
  Warnings:

  - The `pelabuhan_asal` column on the `BahanB3Registrasi` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `pelabuhan_muat` column on the `BahanB3Registrasi` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `pelabuhan_bongkar` column on the `BahanB3Registrasi` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `provinsi_pelabuhan_bongkar` column on the `BahanB3Registrasi` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "BahanB3Registrasi" DROP COLUMN "pelabuhan_asal",
ADD COLUMN     "pelabuhan_asal" TEXT[],
DROP COLUMN "pelabuhan_muat",
ADD COLUMN     "pelabuhan_muat" TEXT[],
DROP COLUMN "pelabuhan_bongkar",
ADD COLUMN     "pelabuhan_bongkar" TEXT[],
DROP COLUMN "provinsi_pelabuhan_bongkar",
ADD COLUMN     "provinsi_pelabuhan_bongkar" TEXT[];
