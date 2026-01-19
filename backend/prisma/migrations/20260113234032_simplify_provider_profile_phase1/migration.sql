/*
  Warnings:

  - You are about to drop the column `hourlyRate` on the `provider_profiles` table. All the data in the column will be lost.
  - You are about to drop the column `isMobileService` on the `provider_profiles` table. All the data in the column will be lost.
  - You are about to drop the column `isShopService` on the `provider_profiles` table. All the data in the column will be lost.
  - You are about to drop the column `rating` on the `provider_profiles` table. All the data in the column will be lost.
  - You are about to drop the column `reviewCount` on the `provider_profiles` table. All the data in the column will be lost.
  - You are about to drop the column `serviceArea` on the `provider_profiles` table. All the data in the column will be lost.
  - You are about to drop the column `shopAddress` on the `provider_profiles` table. All the data in the column will be lost.
  - You are about to drop the column `shopPhotos` on the `provider_profiles` table. All the data in the column will be lost.
  - You are about to drop the column `shopZipCode` on the `provider_profiles` table. All the data in the column will be lost.
  - You are about to drop the column `stripeAccountId` on the `provider_profiles` table. All the data in the column will be lost.
  - You are about to drop the column `website` on the `provider_profiles` table. All the data in the column will be lost.
  - You are about to drop the column `yearsInBusiness` on the `provider_profiles` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "provider_profiles_rating_idx";

-- AlterTable
ALTER TABLE "provider_profiles" DROP COLUMN "hourlyRate",
DROP COLUMN "isMobileService",
DROP COLUMN "isShopService",
DROP COLUMN "rating",
DROP COLUMN "reviewCount",
DROP COLUMN "serviceArea",
DROP COLUMN "shopAddress",
DROP COLUMN "shopPhotos",
DROP COLUMN "shopZipCode",
DROP COLUMN "stripeAccountId",
DROP COLUMN "website",
DROP COLUMN "yearsInBusiness",
ADD COLUMN     "serviceRadius" INTEGER;
