-- AlterTable
ALTER TABLE "users" ADD COLUMN     "address" TEXT,
ADD COLUMN     "businessName" TEXT,
ADD COLUMN     "city" TEXT,
ADD COLUMN     "serviceTypes" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "state" TEXT,
ADD COLUMN     "yearsInBusiness" INTEGER,
ADD COLUMN     "zipCode" TEXT;
