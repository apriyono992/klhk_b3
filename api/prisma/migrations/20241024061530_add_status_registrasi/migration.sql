/*
  Warnings:

  - Added the required column `status` to the `Registrasi` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Registrasi" ADD COLUMN     "is_draft" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "status" TEXT NOT NULL;
