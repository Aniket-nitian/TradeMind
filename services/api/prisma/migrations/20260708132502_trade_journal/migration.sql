-- CreateEnum
CREATE TYPE "TradeSide" AS ENUM ('BUY', 'SELL');

-- CreateEnum
CREATE TYPE "TradeSegment" AS ENUM ('EQUITY', 'FUTURES', 'OPTIONS', 'CURRENCY', 'COMMODITY');

-- CreateEnum
CREATE TYPE "TradeProduct" AS ENUM ('CNC', 'MIS', 'NRML');

-- CreateEnum
CREATE TYPE "TradeStatus" AS ENUM ('OPEN', 'CLOSED');

-- CreateEnum
CREATE TYPE "Emotion" AS ENUM ('CONFIDENT', 'FEAR', 'GREED', 'FOMO', 'REVENGE', 'DISCIPLINED', 'HESITATION');

-- CreateTable
CREATE TABLE "Trade" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "broker" TEXT,
    "symbol" TEXT NOT NULL,
    "exchange" TEXT,
    "segment" "TradeSegment" NOT NULL,
    "product" "TradeProduct" NOT NULL,
    "side" "TradeSide" NOT NULL,
    "status" "TradeStatus" NOT NULL DEFAULT 'CLOSED',
    "quantity" INTEGER NOT NULL,
    "entryPrice" DOUBLE PRECISION NOT NULL,
    "exitPrice" DOUBLE PRECISION,
    "stopLoss" DOUBLE PRECISION,
    "target" DOUBLE PRECISION,
    "brokerage" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "taxes" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "grossPnl" DOUBLE PRECISION,
    "netPnl" DOUBLE PRECISION,
    "riskAmount" DOUBLE PRECISION,
    "rewardAmount" DOUBLE PRECISION,
    "rrRatio" DOUBLE PRECISION,
    "confidence" INTEGER,
    "strategy" TEXT,
    "notes" TEXT,
    "lessons" TEXT,
    "aiReview" TEXT,
    "aiScore" DOUBLE PRECISION,
    "emotionBefore" "Emotion",
    "emotionAfter" "Emotion",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Trade_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TradeImage" (
    "id" TEXT NOT NULL,
    "tradeId" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TradeImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TradeTag" (
    "id" TEXT NOT NULL,
    "tradeId" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "TradeTag_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Trade" ADD CONSTRAINT "Trade_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TradeImage" ADD CONSTRAINT "TradeImage_tradeId_fkey" FOREIGN KEY ("tradeId") REFERENCES "Trade"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TradeTag" ADD CONSTRAINT "TradeTag_tradeId_fkey" FOREIGN KEY ("tradeId") REFERENCES "Trade"("id") ON DELETE CASCADE ON UPDATE CASCADE;
