-- CreateTable
CREATE TABLE "ApiResponse" (
    "id" SERIAL NOT NULL,
    "data" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ApiResponse_pkey" PRIMARY KEY ("id")
);
