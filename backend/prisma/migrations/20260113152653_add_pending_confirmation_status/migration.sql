/*
  Warnings:

  - You are about to drop the `payments` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `reviews` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
ALTER TYPE "JobStatus" ADD VALUE 'pending_confirmation';

-- DropForeignKey
ALTER TABLE "payments" DROP CONSTRAINT "payments_jobId_fkey";

-- DropForeignKey
ALTER TABLE "payments" DROP CONSTRAINT "payments_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "payments" DROP CONSTRAINT "payments_providerId_fkey";

-- DropForeignKey
ALTER TABLE "reviews" DROP CONSTRAINT "reviews_jobId_fkey";

-- DropForeignKey
ALTER TABLE "reviews" DROP CONSTRAINT "reviews_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "reviews" DROP CONSTRAINT "reviews_providerId_fkey";

-- AlterTable
ALTER TABLE "owner_profiles" ADD COLUMN     "stripeCardId" TEXT,
ADD COLUMN     "stripeCustomerId" TEXT;

-- AlterTable
ALTER TABLE "provider_profiles" ADD COLUMN     "stripeAccountId" TEXT;

-- DropTable
DROP TABLE "payments";

-- DropTable
DROP TABLE "reviews";

-- DropEnum
DROP TYPE "PaymentStatus";

-- CreateTable
CREATE TABLE "parts" (
    "id" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "make" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "yearFrom" INTEGER NOT NULL,
    "yearTo" INTEGER NOT NULL,
    "condition" TEXT NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "location" TEXT,
    "notes" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "parts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "service_categories" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "description" TEXT,
    "icon" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "service_categories_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "parts_providerId_idx" ON "parts"("providerId");

-- CreateIndex
CREATE INDEX "parts_make_model_idx" ON "parts"("make", "model");

-- CreateIndex
CREATE UNIQUE INDEX "service_categories_slug_key" ON "service_categories"("slug");

-- AddForeignKey
ALTER TABLE "parts" ADD CONSTRAINT "parts_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
