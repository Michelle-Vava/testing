-- DropIndex
DROP INDEX "vehicles_vin_key";

-- AlterTable
ALTER TABLE "vehicles" ALTER COLUMN "vin" DROP NOT NULL;
