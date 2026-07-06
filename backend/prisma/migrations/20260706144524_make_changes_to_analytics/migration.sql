/*
  Warnings:

  - Made the column `sessionEnd` on table `Session` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Session" ADD COLUMN     "deviceId" TEXT,
ALTER COLUMN "sessionEnd" SET NOT NULL,
ALTER COLUMN "sessionEnd" SET DEFAULT CURRENT_TIMESTAMP;
