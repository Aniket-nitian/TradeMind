-- AlterTable
ALTER TABLE "BrokerAccount" ADD COLUMN     "tokenExpiresAt" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "BrokerSyncLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "brokerAccountId" TEXT NOT NULL,
    "broker" "Broker" NOT NULL,
    "status" "CsvImportStatus" NOT NULL DEFAULT 'PENDING',
    "fromDate" TIMESTAMP(3) NOT NULL,
    "toDate" TIMESTAMP(3) NOT NULL,
    "totalFetched" INTEGER NOT NULL,
    "matchedTrades" INTEGER NOT NULL,
    "importedRows" INTEGER NOT NULL DEFAULT 0,
    "duplicateRows" INTEGER NOT NULL DEFAULT 0,
    "errors" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BrokerSyncLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "BrokerSyncLog_userId_idx" ON "BrokerSyncLog"("userId");

-- CreateIndex
CREATE INDEX "BrokerSyncLog_brokerAccountId_idx" ON "BrokerSyncLog"("brokerAccountId");

-- AddForeignKey
ALTER TABLE "BrokerSyncLog" ADD CONSTRAINT "BrokerSyncLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BrokerSyncLog" ADD CONSTRAINT "BrokerSyncLog_brokerAccountId_fkey" FOREIGN KEY ("brokerAccountId") REFERENCES "BrokerAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE;
