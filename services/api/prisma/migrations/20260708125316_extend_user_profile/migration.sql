/*
  Warnings:

  - A unique constraint covering the columns `[username]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "avatarUrl" TEXT,
ADD COLUMN     "bio" TEXT,
ADD COLUMN     "currency" TEXT DEFAULT 'INR',
ADD COLUMN     "preferredBroker" TEXT,
ADD COLUMN     "riskProfile" TEXT,
ADD COLUMN     "subscription" TEXT NOT NULL DEFAULT 'FREE',
ADD COLUMN     "timezone" TEXT DEFAULT 'Asia/Kolkata',
ADD COLUMN     "tradingExperience" TEXT,
ADD COLUMN     "tradingStyle" TEXT,
ADD COLUMN     "username" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
