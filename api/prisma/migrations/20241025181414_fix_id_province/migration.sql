/*
  Warnings:

  - The primary key for the `reg_provinces` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "reg_provinces" DROP CONSTRAINT "reg_provinces_pkey",
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "reg_provinces_pkey" PRIMARY KEY ("id");
