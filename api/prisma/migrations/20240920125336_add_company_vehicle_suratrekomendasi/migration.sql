-- CreateTable
CREATE TABLE "Company" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "penanggungJawab" TEXT NOT NULL,
    "alamatKantor" TEXT NOT NULL,
    "telpKantor" TEXT NOT NULL,
    "faxKantor" TEXT,
    "emailKantor" TEXT,
    "npwp" TEXT,
    "nomorInduk" TEXT,
    "kodeDBKlh" TEXT,
    "alamatPool" TEXT[],
    "bidangUsaha" TEXT,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vehicle" (
    "id" TEXT NOT NULL,
    "noPolisi" TEXT NOT NULL,
    "modelKendaraan" TEXT NOT NULL,
    "tahunPembuatan" INTEGER NOT NULL,
    "nomorRangka" TEXT NOT NULL,
    "nomorMesin" TEXT NOT NULL,
    "kepemilikan" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,

    CONSTRAINT "Vehicle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SuratRekomendasiB3" (
    "id" TEXT NOT NULL,
    "tipe" INTEGER NOT NULL,
    "kodePermohonanRekomendasi" TEXT NOT NULL,
    "tanggalMulai" TIMESTAMP(3) NOT NULL,
    "tanggalBerakhir" TIMESTAMP(3),
    "companyId" TEXT NOT NULL,

    CONSTRAINT "SuratRekomendasiB3_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SuratOnVehicle" (
    "suratId" TEXT NOT NULL,
    "vehicleId" TEXT NOT NULL,

    CONSTRAINT "SuratOnVehicle_pkey" PRIMARY KEY ("suratId","vehicleId")
);

-- AddForeignKey
ALTER TABLE "Vehicle" ADD CONSTRAINT "Vehicle_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SuratRekomendasiB3" ADD CONSTRAINT "SuratRekomendasiB3_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SuratOnVehicle" ADD CONSTRAINT "SuratOnVehicle_suratId_fkey" FOREIGN KEY ("suratId") REFERENCES "SuratRekomendasiB3"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SuratOnVehicle" ADD CONSTRAINT "SuratOnVehicle_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
