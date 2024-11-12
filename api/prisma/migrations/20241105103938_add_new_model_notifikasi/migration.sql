/*
  Warnings:

  - You are about to drop the column `additionalInfo` on the `ExplicitConsent` table. All the data in the column will be lost.
  - The `dnaEmail` column on the `ExplicitConsentDetails` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "ExplicitConsent" DROP COLUMN "additionalInfo",
ADD COLUMN     "namaImpoter" TEXT,
ADD COLUMN     "negaraAsal" TEXT,
ADD COLUMN     "tujuanPenggunaan" TEXT,
ADD COLUMN     "tujuanSurat" TEXT;

-- AlterTable
ALTER TABLE "ExplicitConsentDetails" DROP COLUMN "dnaEmail",
ADD COLUMN     "dnaEmail" TEXT[];

-- AlterTable
ALTER TABLE "PersetujuanImport" ADD COLUMN     "nomorSuratExplicitConsent" TEXT,
ADD COLUMN     "nomorSuratKebenaranImport" TEXT,
ADD COLUMN     "nomorSuratPerusahaanPengimpor" TEXT,
ADD COLUMN     "regulation" TEXT,
ADD COLUMN     "tanggalDiterimaKebenaranImport" TIMESTAMP(3),
ADD COLUMN     "tanggalKebenaranImport" TIMESTAMP(3),
ADD COLUMN     "tanggalSuratExplicitConsent" TIMESTAMP(3);
