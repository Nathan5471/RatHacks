/*
  Warnings:

  - Made the column `deviceId` on table `Session` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Session" ALTER COLUMN "deviceId" SET NOT NULL;
