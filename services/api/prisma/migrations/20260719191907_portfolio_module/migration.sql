-- CreateEnum
CREATE TYPE "CapitalTransactionType" AS ENUM ('DEPOSIT', 'WITHDRAWAL');

-- AlterTable
ALTER TABLE "PortfolioSnapshot" ALTER COLUMN "unrealizedPnl" DROP NOT NULL;

-- CreateTable
CREATE TABLE "CapitalTransaction" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "CapitalTransactionType" NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "note" TEXT,
    "transactionDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "CapitalTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CapitalTransaction_userId_idx" ON "CapitalTransaction"("userId");

-- CreateIndex
CREATE INDEX "CapitalTransaction_transactionDate_idx" ON "CapitalTransaction"("transactionDate");

-- AddForeignKey
ALTER TABLE "CapitalTransaction" ADD CONSTRAINT "CapitalTransaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
