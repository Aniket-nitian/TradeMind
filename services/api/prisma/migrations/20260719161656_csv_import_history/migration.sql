-- CreateEnum
CREATE TYPE "CsvImportStatus" AS ENUM ('PENDING', 'COMPLETED', 'PARTIAL', 'FAILED');

-- CreateTable
CREATE TABLE "CsvImport" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "broker" "Broker",
    "status" "CsvImportStatus" NOT NULL DEFAULT 'PENDING',
    "totalRows" INTEGER NOT NULL,
    "validRows" INTEGER NOT NULL,
    "invalidRows" INTEGER NOT NULL,
    "duplicateRows" INTEGER NOT NULL,
    "importedRows" INTEGER NOT NULL DEFAULT 0,
    "rows" JSONB NOT NULL,
    "errors" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CsvImport_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CsvImport_userId_idx" ON "CsvImport"("userId");

-- CreateIndex
CREATE INDEX "CsvImport_status_idx" ON "CsvImport"("status");

-- AddForeignKey
ALTER TABLE "CsvImport" ADD CONSTRAINT "CsvImport_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
