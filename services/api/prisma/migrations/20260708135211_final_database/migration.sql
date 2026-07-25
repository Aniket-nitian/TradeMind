/*
  Warnings:

  - The `broker` column on the `Trade` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `exchange` column on the `Trade` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "Broker" AS ENUM ('ZERODHA', 'ANGEL_ONE', 'UPSTOX', 'GROWW', 'DHAN', 'FYERS', 'ICICI_DIRECT');

-- CreateEnum
CREATE TYPE "Exchange" AS ENUM ('NSE', 'BSE', 'NFO', 'CDS', 'MCX');

-- AlterTable
ALTER TABLE "Trade" DROP COLUMN "broker",
ADD COLUMN     "broker" "Broker",
DROP COLUMN "exchange",
ADD COLUMN     "exchange" "Exchange";
