-- CreateTable
CREATE TABLE "CasbinRule" (
    "id" SERIAL NOT NULL,
    "ptype" TEXT,
    "v0" TEXT,
    "v1" TEXT,
    "v2" TEXT,
    "v3" TEXT,
    "v4" TEXT,
    "v5" TEXT,

    CONSTRAINT "CasbinRule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserRole" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "scope" TEXT,

    CONSTRAINT "UserRole_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CasbinRule_ptype_v0_v1_v2_v3_v4_v5_idx" ON "CasbinRule"("ptype", "v0", "v1", "v2", "v3", "v4", "v5");
