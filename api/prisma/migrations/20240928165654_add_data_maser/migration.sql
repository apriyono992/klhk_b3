-- Create Cititext
CREATE EXTENSION IF NOT EXISTS citext;

-- CreateTable
CREATE TABLE "DataBahanB3" (
    "id" TEXT NOT NULL,
    "casNumber" CITEXT NOT NULL,
    "namaBahanKimia" TEXT NOT NULL,
    "namaDagang" CITEXT NOT NULL,
    "tipeBahan" TEXT NOT NULL,

    CONSTRAINT "DataBahanB3_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DataPejabat" (
    "id" TEXT NOT NULL,
    "nip" CITEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "jabatan" TEXT NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "DataPejabat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DataTembusan" (
    "id" TEXT NOT NULL,
    "nama" CITEXT NOT NULL,
    "tipe" TEXT NOT NULL,

    CONSTRAINT "DataTembusan_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DataBahanB3_casNumber_namaDagang_key" ON "DataBahanB3"("casNumber", "namaDagang");

-- CreateIndex
CREATE UNIQUE INDEX "DataPejabat_nip_key" ON "DataPejabat"("nip");

-- CreateIndex
CREATE UNIQUE INDEX "DataTembusan_nama_key" ON "DataTembusan"("nama");
