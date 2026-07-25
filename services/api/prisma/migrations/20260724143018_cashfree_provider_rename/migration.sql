/*
  Warnings:

  - You are about to drop the column `razorpayOrderId` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the column `razorpayPaymentId` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the column `razorpaySubscriptionId` on the `Subscription` table. All the data in the column will be lost.

*/
-- AlterEnum
ALTER TYPE "SubscriptionStatus" ADD VALUE 'INCOMPLETE';

-- AlterTable
ALTER TABLE "Payment" DROP COLUMN "razorpayOrderId",
DROP COLUMN "razorpayPaymentId",
ADD COLUMN     "providerOrderId" TEXT,
ADD COLUMN     "providerPaymentId" TEXT;

-- AlterTable
ALTER TABLE "Subscription" DROP COLUMN "razorpaySubscriptionId",
ADD COLUMN     "providerSubscriptionId" TEXT;
