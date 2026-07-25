-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "Emotion" ADD VALUE 'CALM';
ALTER TYPE "Emotion" ADD VALUE 'ANXIOUS';
ALTER TYPE "Emotion" ADD VALUE 'FOCUSED';
ALTER TYPE "Emotion" ADD VALUE 'BORED';

-- AlterTable
ALTER TABLE "Trade" ADD COLUMN     "followedPlan" BOOLEAN,
ADD COLUMN     "reasonForEntry" TEXT,
ADD COLUMN     "reasonForExit" TEXT;
