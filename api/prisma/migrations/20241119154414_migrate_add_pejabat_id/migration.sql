/*
  Warnings:

  - Added the required column `pejabat_id` to the `Registrasi` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Registrasi" ADD COLUMN     "pejabat_id" TEXT NOT NULL;
