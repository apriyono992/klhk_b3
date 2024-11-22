-- CreateTable
CREATE TABLE "ValidasiTeknisRegistrasi" (
    "id" TEXT NOT NULL,
    "documen_ada" INTEGER NOT NULL,
    "jawaban_pertanyaan" TEXT NOT NULL,
    "keterangan" TEXT NOT NULL,
    "makna_pertanyaan" TEXT NOT NULL,
    "pertanyaan_teks" TEXT NOT NULL,
    "validasi_valid" INTEGER NOT NULL,
    "nomor_registrasi" TEXT NOT NULL,

    CONSTRAINT "ValidasiTeknisRegistrasi_pkey" PRIMARY KEY ("id")
);
