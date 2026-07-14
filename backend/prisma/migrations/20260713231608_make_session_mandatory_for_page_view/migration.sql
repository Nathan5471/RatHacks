/*
  Warnings:

  - Made the column `sessionId` on table `PageView` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "PageView" DROP CONSTRAINT "PageView_sessionId_fkey";

-- AlterTable
ALTER TABLE "PageView" ALTER COLUMN "sessionId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "PageView" ADD CONSTRAINT "PageView_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "Session"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
