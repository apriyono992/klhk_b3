/*
  Warnings:

  - Made the column `bulan` on table `Registrasi` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Registrasi" ALTER COLUMN "bulan" SET NOT NULL,
ALTER COLUMN "bulan" DROP DEFAULT;
