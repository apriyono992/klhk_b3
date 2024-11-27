-- AlterTable
ALTER TABLE "DataPelabuhan" ADD COLUMN     "latitude" TEXT,
ADD COLUMN     "longitude" TEXT;

-- AlterTable
ALTER TABLE "Registrasi" ADD COLUMN     "type_registrasi" TEXT NOT NULL DEFAULT 'import';
