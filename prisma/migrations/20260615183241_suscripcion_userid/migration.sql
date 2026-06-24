/*
  Warnings:

  - Made the column `startDate` on table `subscriptions` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "subscriptions_userId_key";

-- AlterTable
ALTER TABLE "subscriptions" ALTER COLUMN "startDate" SET NOT NULL;

-- CreateIndex
CREATE INDEX "subscriptions_userId_idx" ON "subscriptions"("userId");

-- CreateIndex
CREATE INDEX "subscriptions_status_idx" ON "subscriptions"("status");
