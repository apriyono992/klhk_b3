/*
  Warnings:

  - Added the required column `provinceId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "provinceId" TEXT NOT NULL;
