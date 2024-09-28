-- AlterTable
ALTER TABLE "Photo" ADD COLUMN     "mercuryId" TEXT;

-- CreateTable
CREATE TABLE "MercuryMonitoring" (
    "id" TEXT NOT NULL,
    "jenisSampelId" TEXT,
    "bakuMutuLingkunganId" TEXT,
    "tahunPengambilan" TIMESTAMP(3) NOT NULL,
    "hasilKadar" VARCHAR(10) NOT NULL,
    "satuan" VARCHAR(10) NOT NULL,
    "tingkatKadar" VARCHAR(50) NOT NULL,
    "konsentrasi" VARCHAR(50) NOT NULL,
    "peskLocationId" TEXT,
    "warehouseLocationId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MercuryMonitoring_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JenisSample" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "deskripsi" TEXT NOT NULL,
    "typeId" TEXT NOT NULL,

    CONSTRAINT "JenisSample_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Location" (
    "id" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "description" VARCHAR(255),
    "provinceId" TEXT,
    "regencyId" TEXT,
    "districtId" TEXT,
    "villageId" TEXT,

    CONSTRAINT "Location_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JenisSampleType" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "deskripsi" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "JenisSampleType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reg_provinces" (
    "id" CHAR(2) NOT NULL,
    "name" VARCHAR(255) NOT NULL,

    CONSTRAINT "reg_provinces_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reg_regencies" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "provinceId" CHAR(250) NOT NULL,

    CONSTRAINT "reg_regencies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reg_districts" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "regencyId" CHAR(250) NOT NULL,

    CONSTRAINT "reg_districts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reg_village" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "districtId" CHAR(250) NOT NULL,

    CONSTRAINT "reg_village_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MercuryMonitoring_peskLocationId_key" ON "MercuryMonitoring"("peskLocationId");

-- CreateIndex
CREATE UNIQUE INDEX "MercuryMonitoring_warehouseLocationId_key" ON "MercuryMonitoring"("warehouseLocationId");

-- CreateIndex
CREATE UNIQUE INDEX "JenisSample_code_typeId_key" ON "JenisSample"("code", "typeId");

-- CreateIndex
CREATE UNIQUE INDEX "JenisSampleType_type_key" ON "JenisSampleType"("type");

-- AddForeignKey
ALTER TABLE "Photo" ADD CONSTRAINT "Photo_mercuryId_fkey" FOREIGN KEY ("mercuryId") REFERENCES "MercuryMonitoring"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MercuryMonitoring" ADD CONSTRAINT "MercuryMonitoring_jenisSampelId_fkey" FOREIGN KEY ("jenisSampelId") REFERENCES "JenisSample"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MercuryMonitoring" ADD CONSTRAINT "MercuryMonitoring_bakuMutuLingkunganId_fkey" FOREIGN KEY ("bakuMutuLingkunganId") REFERENCES "JenisSample"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MercuryMonitoring" ADD CONSTRAINT "MercuryMonitoring_peskLocationId_fkey" FOREIGN KEY ("peskLocationId") REFERENCES "Location"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MercuryMonitoring" ADD CONSTRAINT "MercuryMonitoring_warehouseLocationId_fkey" FOREIGN KEY ("warehouseLocationId") REFERENCES "Location"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JenisSample" ADD CONSTRAINT "JenisSample_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "JenisSampleType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Location" ADD CONSTRAINT "Location_provinceId_fkey" FOREIGN KEY ("provinceId") REFERENCES "reg_provinces"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Location" ADD CONSTRAINT "Location_regencyId_fkey" FOREIGN KEY ("regencyId") REFERENCES "reg_regencies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Location" ADD CONSTRAINT "Location_districtId_fkey" FOREIGN KEY ("districtId") REFERENCES "reg_districts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Location" ADD CONSTRAINT "Location_villageId_fkey" FOREIGN KEY ("villageId") REFERENCES "reg_village"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reg_regencies" ADD CONSTRAINT "reg_regencies_provinceId_fkey" FOREIGN KEY ("provinceId") REFERENCES "reg_provinces"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reg_districts" ADD CONSTRAINT "reg_districts_regencyId_fkey" FOREIGN KEY ("regencyId") REFERENCES "reg_regencies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reg_village" ADD CONSTRAINT "reg_village_districtId_fkey" FOREIGN KEY ("districtId") REFERENCES "reg_districts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
