/*
  Warnings:

  - You are about to drop the `parts` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "PartCondition" AS ENUM ('OEM', 'AFTERMARKET', 'USED');

-- DropForeignKey
ALTER TABLE "parts" DROP CONSTRAINT "parts_providerId_fkey";

-- DropTable
DROP TABLE "parts";

-- CreateTable
CREATE TABLE "part_inventory" (
    "id" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT,
    "condition" "PartCondition" NOT NULL DEFAULT 'AFTERMARKET',
    "price" DECIMAL(10,2) NOT NULL,
    "notes" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "part_inventory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quote_parts" (
    "id" TEXT NOT NULL,
    "quoteId" TEXT NOT NULL,
    "partId" TEXT,
    "name" TEXT NOT NULL,
    "condition" "PartCondition" NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "quote_parts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "part_inventory_providerId_idx" ON "part_inventory"("providerId");

-- CreateIndex
CREATE INDEX "part_inventory_category_idx" ON "part_inventory"("category");

-- CreateIndex
CREATE INDEX "quote_parts_quoteId_idx" ON "quote_parts"("quoteId");

-- CreateIndex
CREATE INDEX "quote_parts_partId_idx" ON "quote_parts"("partId");

-- AddForeignKey
ALTER TABLE "part_inventory" ADD CONSTRAINT "part_inventory_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quote_parts" ADD CONSTRAINT "quote_parts_quoteId_fkey" FOREIGN KEY ("quoteId") REFERENCES "quotes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quote_parts" ADD CONSTRAINT "quote_parts_partId_fkey" FOREIGN KEY ("partId") REFERENCES "part_inventory"("id") ON DELETE SET NULL ON UPDATE CASCADE;
