-- AlterTable
ALTER TABLE "quotes" ADD COLUMN     "description" TEXT,
ADD COLUMN     "includesWarranty" BOOLEAN NOT NULL DEFAULT false;
