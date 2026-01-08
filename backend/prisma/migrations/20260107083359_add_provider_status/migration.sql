-- CreateEnum
CREATE TYPE "ProviderStatus" AS ENUM ('NONE', 'DRAFT', 'LIMITED', 'ACTIVE', 'SUSPENDED');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "providerStatus" "ProviderStatus" NOT NULL DEFAULT 'NONE',
ADD COLUMN     "providerStatusChangedAt" TIMESTAMP(3),
ADD COLUMN     "providerStatusReason" TEXT;
