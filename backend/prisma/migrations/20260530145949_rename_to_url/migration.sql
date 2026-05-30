/*
  Warnings:

  - You are about to drop the column `screenshotPath` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `videoPath` on the `Project` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Project" RENAME COLUMN "screenshotPath" TO "screenshotURL";
ALTER TABLE "Project" RENAME COLUMN "videoPath" TO "videoURL";