-- AlterTable
ALTER TABLE "PenyimpananB3" ADD COLUMN     "districtId" TEXT,
ADD COLUMN     "provinceId" TEXT,
ADD COLUMN     "regencyId" TEXT,
ADD COLUMN     "villageId" TEXT;

-- AddForeignKey
ALTER TABLE "PenyimpananB3" ADD CONSTRAINT "PenyimpananB3_provinceId_fkey" FOREIGN KEY ("provinceId") REFERENCES "reg_provinces"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PenyimpananB3" ADD CONSTRAINT "PenyimpananB3_regencyId_fkey" FOREIGN KEY ("regencyId") REFERENCES "reg_regencies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PenyimpananB3" ADD CONSTRAINT "PenyimpananB3_districtId_fkey" FOREIGN KEY ("districtId") REFERENCES "reg_districts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PenyimpananB3" ADD CONSTRAINT "PenyimpananB3_villageId_fkey" FOREIGN KEY ("villageId") REFERENCES "reg_village"("id") ON DELETE SET NULL ON UPDATE CASCADE;
