-- CreateTable
CREATE TABLE "PenyimpananB3History" (
    "id" TEXT NOT NULL,
    "penyimpananB3Id" TEXT NOT NULL,
    "statusPengajuan" TEXT NOT NULL,
    "tanggalPengajuan" TIMESTAMP(3) NOT NULL,
    "tanggalPenyelesaian" TIMESTAMP(3),
    "catatanAdmin" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PenyimpananB3History_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PenyimpananB3History" ADD CONSTRAINT "PenyimpananB3History_penyimpananB3Id_fkey" FOREIGN KEY ("penyimpananB3Id") REFERENCES "PenyimpananB3"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
