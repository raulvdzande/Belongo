-- CreateEnum
CREATE TYPE "MovingBudget" AS ENUM ('KRAP', 'GEMIDDELD', 'RUIM');

-- CreateEnum
CREATE TYPE "LanguageLevel" AS ENUM ('GEEN', 'BASIS', 'GEVORDERD', 'VLOEIEND');

-- AlterTable
ALTER TABLE "TestRun" ADD COLUMN     "budgetAllocation" JSONB,
ADD COLUMN     "hasKids" BOOLEAN,
ADD COLUMN     "languageLevel" "LanguageLevel",
ADD COLUMN     "movingBudget" "MovingBudget",
ADD COLUMN     "nationality" TEXT,
ADD COLUMN     "remoteWork" BOOLEAN;
