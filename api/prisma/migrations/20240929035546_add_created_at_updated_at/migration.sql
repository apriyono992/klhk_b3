/*
  Warnings:

  - Added the required column `updatedAt` to the `DataBahanB3` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `DataPejabat` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `DataTembusan` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "DataBahanB3" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "DataPejabat" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "DataTembusan" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
