-- CreateTable
CREATE TABLE "SearchMetric" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "keyword" TEXT,
    "categoryName" TEXT,
    "type" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SearchMetric_pkey" PRIMARY KEY ("id")
);
