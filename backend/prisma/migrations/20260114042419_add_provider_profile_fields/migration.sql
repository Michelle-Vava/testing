-- AlterTable
ALTER TABLE "provider_profiles" ADD COLUMN     "hourlyRate" DECIMAL(10,2),
ADD COLUMN     "isMobileService" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isShopService" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "serviceArea" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "shopAddress" TEXT,
ADD COLUMN     "shopZipCode" TEXT,
ADD COLUMN     "website" TEXT,
ADD COLUMN     "yearsInBusiness" INTEGER;
