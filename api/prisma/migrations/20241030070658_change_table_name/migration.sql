/*
  Warnings:

  - You are about to drop the `RegistrasiPersyaratan` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "RegistrasiPersyaratan" DROP CONSTRAINT "RegistrasiPersyaratan_registrasiId_fkey";

-- DropTable
DROP TABLE "RegistrasiPersyaratan";

-- CreateTable
CREATE TABLE "Persyaratan" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "document_number" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "notes" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'dibuat',
    "approved_by" TEXT,
    "registrasiId" TEXT,

    CONSTRAINT "Persyaratan_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Persyaratan" ADD CONSTRAINT "Persyaratan_registrasiId_fkey" FOREIGN KEY ("registrasiId") REFERENCES "Registrasi"("id") ON DELETE SET NULL ON UPDATE CASCADE;
