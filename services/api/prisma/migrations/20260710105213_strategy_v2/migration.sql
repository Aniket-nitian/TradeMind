-- AlterTable
ALTER TABLE "Strategy" ADD COLUMN     "entryRules" TEXT,
ADD COLUMN     "exitRules" TEXT,
ADD COLUMN     "market" TEXT,
ADD COLUMN     "riskRules" TEXT,
ADD COLUMN     "setupRules" TEXT,
ADD COLUMN     "timeframe" TEXT;
