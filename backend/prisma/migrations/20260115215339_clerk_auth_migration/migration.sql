/*
  Warnings:

  - You are about to drop the column `emailVerificationToken` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `emailVerified` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `resetToken` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `resetTokenExpiry` on the `users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[externalAuthId]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "emailVerificationToken",
DROP COLUMN "emailVerified",
DROP COLUMN "password",
DROP COLUMN "resetToken",
DROP COLUMN "resetTokenExpiry",
ADD COLUMN     "authProvider" TEXT NOT NULL DEFAULT 'clerk',
ADD COLUMN     "avatarUrl" TEXT,
ADD COLUMN     "externalAuthId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "users_externalAuthId_key" ON "users"("externalAuthId");

-- CreateIndex
CREATE INDEX "users_externalAuthId_idx" ON "users"("externalAuthId");

-- CreateIndex
CREATE INDEX "users_authProvider_idx" ON "users"("authProvider");
