/*
  Warnings:

  - Added the required column `nomorSurat` to the `SuratRekomendasiB3` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SuratRekomendasiB3" ADD COLUMN     "nomorSurat" TEXT NOT NULL,
ADD COLUMN     "tanggalSurat" TIMESTAMP(3);
