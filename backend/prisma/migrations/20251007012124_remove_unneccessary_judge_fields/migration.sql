/*
  Warnings:

  - You are about to drop the column `polishFeedback` on the `JudgeFeedback` table. All the data in the column will be lost.
  - You are about to drop the column `polishScore` on the `JudgeFeedback` table. All the data in the column will be lost.
  - You are about to drop the column `themeFeedback` on the `JudgeFeedback` table. All the data in the column will be lost.
  - You are about to drop the column `themeScore` on the `JudgeFeedback` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."JudgeFeedback" DROP COLUMN "polishFeedback",
DROP COLUMN "polishScore",
DROP COLUMN "themeFeedback",
DROP COLUMN "themeScore";
