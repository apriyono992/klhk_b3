-- CreateTable
CREATE TABLE "RegistrasiTembusan" (
    "id" TEXT NOT NULL,
    "registrasiId" TEXT NOT NULL,
    "dataTembusanId" TEXT NOT NULL,
    "index" INTEGER NOT NULL,

    CONSTRAINT "RegistrasiTembusan_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RegistrasiTembusan_registrasiId_dataTembusanId_key" ON "RegistrasiTembusan"("registrasiId", "dataTembusanId");

-- AddForeignKey
ALTER TABLE "RegistrasiTembusan" ADD CONSTRAINT "RegistrasiTembusan_registrasiId_fkey" FOREIGN KEY ("registrasiId") REFERENCES "Registrasi"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RegistrasiTembusan" ADD CONSTRAINT "RegistrasiTembusan_dataTembusanId_fkey" FOREIGN KEY ("dataTembusanId") REFERENCES "DataTembusan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
