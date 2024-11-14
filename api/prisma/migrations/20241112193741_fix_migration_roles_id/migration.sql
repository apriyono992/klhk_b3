-- AlterTable
ALTER TABLE "User" ADD COLUMN     "rolesId" TEXT NOT NULL DEFAULT 'a6ff2d5c-aa09-4951-ad53-e52f7efdfbd1';

-- CreateTable
CREATE TABLE "Roles" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Roles_pkey" PRIMARY KEY ("id")
);
