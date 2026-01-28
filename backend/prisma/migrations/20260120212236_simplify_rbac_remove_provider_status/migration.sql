/*
  Warnings:

  - You are about to drop the column `status` on the `provider_profiles` table. All the data in the column will be lost.
  - You are about to drop the column `statusChangedAt` on the `provider_profiles` table. All the data in the column will be lost.
  - You are about to drop the column `statusReason` on the `provider_profiles` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "provider_profiles_status_idx";

-- AlterTable
ALTER TABLE "provider_profiles" DROP COLUMN "status",
DROP COLUMN "statusChangedAt",
DROP COLUMN "statusReason",
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT false;

-- DropEnum
DROP TYPE "ProviderStatus";

-- CreateIndex
CREATE INDEX "provider_profiles_isActive_idx" ON "provider_profiles"("isActive");
