-- CreateTable
CREATE TABLE "DataPelabuhan" (
    "id" TEXT NOT NULL,
    "id_lokasi" TEXT NOT NULL,
    "nm_lokasi" TEXT NOT NULL,
    "kd_kantor" TEXT NOT NULL,
    "nm_kantor_pendek" TEXT NOT NULL,

    CONSTRAINT "DataPelabuhan_pkey" PRIMARY KEY ("id")
);
