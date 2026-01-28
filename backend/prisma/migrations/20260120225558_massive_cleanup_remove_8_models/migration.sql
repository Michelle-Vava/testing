/*
  Warnings:

  - You are about to drop the column `isMobileService` on the `provider_profiles` table. All the data in the column will be lost.
  - You are about to drop the column `isShopService` on the `provider_profiles` table. All the data in the column will be lost.
  - You are about to drop the column `onboardingComplete` on the `provider_profiles` table. All the data in the column will be lost.
  - You are about to drop the column `serviceRadius` on the `provider_profiles` table. All the data in the column will be lost.
  - You are about to drop the `activities` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `audit_logs` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `maintenance_records` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `owner_profiles` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `part_inventory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `quote_parts` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `service_categories` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `services` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `externalAuthId` on table `users` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "activities" DROP CONSTRAINT "activities_userId_fkey";

-- DropForeignKey
ALTER TABLE "maintenance_records" DROP CONSTRAINT "maintenance_records_vehicleId_fkey";

-- DropForeignKey
ALTER TABLE "owner_profiles" DROP CONSTRAINT "owner_profiles_userId_fkey";

-- DropForeignKey
ALTER TABLE "part_inventory" DROP CONSTRAINT "part_inventory_providerId_fkey";

-- DropForeignKey
ALTER TABLE "quote_parts" DROP CONSTRAINT "quote_parts_partId_fkey";

-- DropForeignKey
ALTER TABLE "quote_parts" DROP CONSTRAINT "quote_parts_quoteId_fkey";

-- AlterTable
ALTER TABLE "provider_profiles" DROP COLUMN "isMobileService",
DROP COLUMN "isShopService",
DROP COLUMN "onboardingComplete",
DROP COLUMN "serviceRadius",
ADD COLUMN     "statusChangedAt" TIMESTAMP(3),
ADD COLUMN     "statusReason" TEXT;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "address" TEXT,
ADD COLUMN     "city" TEXT,
ADD COLUMN     "state" TEXT,
ADD COLUMN     "zipCode" TEXT,
ALTER COLUMN "externalAuthId" SET NOT NULL;

-- DropTable
DROP TABLE "activities";

-- DropTable
DROP TABLE "audit_logs";

-- DropTable
DROP TABLE "maintenance_records";

-- DropTable
DROP TABLE "owner_profiles";

-- DropTable
DROP TABLE "part_inventory";

-- DropTable
DROP TABLE "quote_parts";

-- DropTable
DROP TABLE "service_categories";

-- DropTable
DROP TABLE "services";

-- DropEnum
DROP TYPE "PartCondition";

-- CreateTable
CREATE TABLE "OwnerProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "onboardingComplete" BOOLEAN NOT NULL DEFAULT false,
    "address" TEXT,
    "city" TEXT,
    "state" TEXT,
    "zipCode" TEXT,
    "avatarUrl" TEXT,
    "bio" TEXT,
    "stripeCardId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "stripeCustomerId" TEXT,

    CONSTRAINT "OwnerProfile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "OwnerProfile_userId_key" ON "OwnerProfile"("userId");

-- AddForeignKey
ALTER TABLE "OwnerProfile" ADD CONSTRAINT "OwnerProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
