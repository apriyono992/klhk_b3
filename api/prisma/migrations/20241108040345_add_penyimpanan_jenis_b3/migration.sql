-- CreateTable
CREATE TABLE "PenyimpananB3" (
    "id" TEXT NOT NULL,
    "alamatGudang" TEXT NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "luasArea" DOUBLE PRECISION NOT NULL,
    "companyId" TEXT NOT NULL,
    "isApproved" BOOLEAN,
    "approvedAt" TIMESTAMP(3),
    "status" TEXT NOT NULL,
    "approvedById" TEXT,

    CONSTRAINT "PenyimpananB3_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PenyimpananB3Persyaratan" (
    "id" TEXT NOT NULL,
    "tipeDokumen" TEXT NOT NULL,
    "notes" TEXT,
    "isApproved" BOOLEAN,
    "approvedById" TEXT,
    "penyimpananB3Id" TEXT,

    CONSTRAINT "PenyimpananB3Persyaratan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PhotoPenyimpananB3" (
    "id" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "originalFileName" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "penyimpananB3PersyaratanId" TEXT NOT NULL,

    CONSTRAINT "PhotoPenyimpananB3_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Approval" (
    "id" TEXT NOT NULL,
    "approvedById" TEXT NOT NULL,
    "approvedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Approval_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PenyimpananB3" ADD CONSTRAINT "PenyimpananB3_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PenyimpananB3" ADD CONSTRAINT "PenyimpananB3_approvedById_fkey" FOREIGN KEY ("approvedById") REFERENCES "Approval"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PenyimpananB3Persyaratan" ADD CONSTRAINT "PenyimpananB3Persyaratan_approvedById_fkey" FOREIGN KEY ("approvedById") REFERENCES "Approval"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PenyimpananB3Persyaratan" ADD CONSTRAINT "PenyimpananB3Persyaratan_penyimpananB3Id_fkey" FOREIGN KEY ("penyimpananB3Id") REFERENCES "PenyimpananB3"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PhotoPenyimpananB3" ADD CONSTRAINT "PhotoPenyimpananB3_penyimpananB3PersyaratanId_fkey" FOREIGN KEY ("penyimpananB3PersyaratanId") REFERENCES "PenyimpananB3Persyaratan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Approval" ADD CONSTRAINT "Approval_approvedById_fkey" FOREIGN KEY ("approvedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
