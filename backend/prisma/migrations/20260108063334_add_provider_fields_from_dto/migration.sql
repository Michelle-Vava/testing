/*
  Warnings:

  - You are about to drop the column `address` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `avatarUrl` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `bio` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `businessName` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `certifications` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `city` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `isMobileService` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `isShopService` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `isVerified` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `onboardingComplete` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `providerOnboardingComplete` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `providerStatus` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `providerStatusChangedAt` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `providerStatusReason` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `rating` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `reviewCount` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `serviceArea` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `serviceTypes` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `shopAddress` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `shopCity` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `shopPhotos` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `shopState` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `shopZipCode` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `state` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `yearsInBusiness` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `zipCode` on the `users` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "users_businessName_key";

-- DropIndex
DROP INDEX "users_providerOnboardingComplete_idx";

-- DropIndex
DROP INDEX "users_providerOnboardingComplete_rating_idx";

-- DropIndex
DROP INDEX "users_rating_idx";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "address",
DROP COLUMN "avatarUrl",
DROP COLUMN "bio",
DROP COLUMN "businessName",
DROP COLUMN "certifications",
DROP COLUMN "city",
DROP COLUMN "isMobileService",
DROP COLUMN "isShopService",
DROP COLUMN "isVerified",
DROP COLUMN "onboardingComplete",
DROP COLUMN "providerOnboardingComplete",
DROP COLUMN "providerStatus",
DROP COLUMN "providerStatusChangedAt",
DROP COLUMN "providerStatusReason",
DROP COLUMN "rating",
DROP COLUMN "reviewCount",
DROP COLUMN "serviceArea",
DROP COLUMN "serviceTypes",
DROP COLUMN "shopAddress",
DROP COLUMN "shopCity",
DROP COLUMN "shopPhotos",
DROP COLUMN "shopState",
DROP COLUMN "shopZipCode",
DROP COLUMN "state",
DROP COLUMN "yearsInBusiness",
DROP COLUMN "zipCode";

-- CreateTable
CREATE TABLE "owner_profiles" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "onboardingComplete" BOOLEAN NOT NULL DEFAULT false,
    "address" TEXT,
    "city" TEXT,
    "state" TEXT,
    "zipCode" TEXT,
    "avatarUrl" TEXT,
    "bio" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "owner_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "provider_profiles" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "onboardingComplete" BOOLEAN NOT NULL DEFAULT false,
    "status" "ProviderStatus" NOT NULL DEFAULT 'NONE',
    "statusReason" TEXT,
    "statusChangedAt" TIMESTAMP(3),
    "businessName" TEXT,
    "serviceTypes" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "yearsInBusiness" INTEGER,
    "certifications" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "shopAddress" TEXT,
    "shopCity" TEXT,
    "shopState" TEXT,
    "shopZipCode" TEXT,
    "serviceArea" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "isMobileService" BOOLEAN NOT NULL DEFAULT false,
    "isShopService" BOOLEAN NOT NULL DEFAULT false,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "hourlyRate" DECIMAL(10,2),
    "website" TEXT,
    "insuranceInfo" TEXT,
    "shopPhotos" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "rating" DECIMAL(3,2),
    "reviewCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "provider_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "owner_profiles_userId_key" ON "owner_profiles"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "provider_profiles_userId_key" ON "provider_profiles"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "provider_profiles_businessName_key" ON "provider_profiles"("businessName");

-- CreateIndex
CREATE INDEX "provider_profiles_status_idx" ON "provider_profiles"("status");

-- CreateIndex
CREATE INDEX "provider_profiles_rating_idx" ON "provider_profiles"("rating");

-- CreateIndex
CREATE INDEX "provider_profiles_serviceTypes_idx" ON "provider_profiles" USING GIN ("serviceTypes");

-- AddForeignKey
ALTER TABLE "owner_profiles" ADD CONSTRAINT "owner_profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "provider_profiles" ADD CONSTRAINT "provider_profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
