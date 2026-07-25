-- AlterTable
ALTER TABLE "User" ADD COLUMN     "brokerSyncLookbackDays" INTEGER DEFAULT 30,
ADD COLUMN     "defaultAccountSize" DOUBLE PRECISION,
ADD COLUMN     "defaultRiskPercent" DOUBLE PRECISION;
