/*
  Warnings:

  - You are about to drop the column `peskLocationId` on the `MercuryMonitoring` table. All the data in the column will be lost.
  - You are about to drop the column `warehouseLocationId` on the `MercuryMonitoring` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "MercuryMonitoring" DROP CONSTRAINT "MercuryMonitoring_peskLocationId_fkey";

-- DropForeignKey
ALTER TABLE "MercuryMonitoring" DROP CONSTRAINT "MercuryMonitoring_warehouseLocationId_fkey";

-- DropIndex
DROP INDEX "MercuryMonitoring_peskLocationId_key";

-- DropIndex
DROP INDEX "MercuryMonitoring_warehouseLocationId_key";

-- AlterTable
ALTER TABLE "MercuryMonitoring" DROP COLUMN "peskLocationId",
DROP COLUMN "warehouseLocationId";
