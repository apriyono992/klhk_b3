/*
  Warnings:

  - Added the required column `bulan` to the `Registrasi` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Registrasi" ADD COLUMN     "bulan" TEXT NOT NULL;
