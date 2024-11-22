-- AlterTable
ALTER TABLE "Location" ADD COLUMN     "keterangan" TEXT;

-- AlterTable
ALTER TABLE "MercuryMonitoring" ADD COLUMN     "locationId" TEXT,
ALTER COLUMN "hasilKadar" SET DATA TYPE TEXT,
ALTER COLUMN "satuan" SET DATA TYPE TEXT,
ALTER COLUMN "tingkatKadar" SET DATA TYPE TEXT,
ALTER COLUMN "konsentrasi" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "MercuryMonitoring" ADD CONSTRAINT "MercuryMonitoring_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE SET NULL ON UPDATE CASCADE;
