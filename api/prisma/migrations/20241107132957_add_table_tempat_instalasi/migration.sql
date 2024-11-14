-- CreateTable
CREATE TABLE "TempatInstalasi" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "alamat" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TempatInstalasi_pkey" PRIMARY KEY ("id")
);
