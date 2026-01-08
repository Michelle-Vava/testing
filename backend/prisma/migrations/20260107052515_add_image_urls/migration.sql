-- AlterTable
ALTER TABLE "service_requests" ADD COLUMN     "imageUrls" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- AlterTable
ALTER TABLE "vehicles" ADD COLUMN     "imageUrls" TEXT[] DEFAULT ARRAY[]::TEXT[];
