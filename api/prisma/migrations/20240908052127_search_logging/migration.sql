/*
  Warnings:

  - The `categoryName` column on the `SearchMetric` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `type` to the `SearchMetric` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SearchMetric" DROP COLUMN "categoryName",
ADD COLUMN     "categoryName" TEXT[],
DROP COLUMN "type",
ADD COLUMN     "type" "CategoryType" NOT NULL;
