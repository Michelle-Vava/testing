/*
  Warnings:

  - The `status` column on the `jobs` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `status` column on the `payments` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `certifications` on the `provider_profiles` table. All the data in the column will be lost.
  - You are about to drop the column `insuranceInfo` on the `provider_profiles` table. All the data in the column will be lost.
  - You are about to drop the column `isVerified` on the `provider_profiles` table. All the data in the column will be lost.
  - The `status` column on the `quotes` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `status` column on the `service_requests` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "RequestStatus" AS ENUM ('open', 'quoted', 'accepted', 'in_progress', 'completed', 'cancelled');

-- CreateEnum
CREATE TYPE "QuoteStatus" AS ENUM ('pending', 'accepted', 'rejected', 'expired');

-- CreateEnum
CREATE TYPE "JobStatus" AS ENUM ('pending', 'in_progress', 'completed', 'cancelled');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('pending', 'processing', 'succeeded', 'failed', 'refunded');

-- AlterTable
ALTER TABLE "jobs" DROP COLUMN "status",
ADD COLUMN     "status" "JobStatus" NOT NULL DEFAULT 'pending';

-- AlterTable
ALTER TABLE "payments" DROP COLUMN "status",
ADD COLUMN     "status" "PaymentStatus" NOT NULL DEFAULT 'pending';

-- AlterTable
ALTER TABLE "provider_profiles" DROP COLUMN "certifications",
DROP COLUMN "insuranceInfo",
DROP COLUMN "isVerified";

-- AlterTable
ALTER TABLE "quotes" DROP COLUMN "status",
ADD COLUMN     "status" "QuoteStatus" NOT NULL DEFAULT 'pending';

-- AlterTable
ALTER TABLE "service_requests" DROP COLUMN "status",
ADD COLUMN     "status" "RequestStatus" NOT NULL DEFAULT 'open';

-- CreateIndex
CREATE INDEX "notifications_userId_isRead_idx" ON "notifications"("userId", "isRead");

-- CreateIndex
CREATE INDEX "service_requests_status_idx" ON "service_requests"("status");

-- CreateIndex
CREATE INDEX "service_requests_status_createdAt_idx" ON "service_requests"("status", "createdAt");
