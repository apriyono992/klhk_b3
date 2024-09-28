/*
  Warnings:

  - Added the required column `status` to the `SuratRekomendasiB3` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SuratRekomendasiB3" ADD COLUMN     "status" TEXT NOT NULL;
