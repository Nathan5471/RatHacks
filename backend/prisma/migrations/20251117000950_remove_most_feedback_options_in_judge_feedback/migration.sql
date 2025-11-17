/*
  Warnings:

  - You are about to drop the column `creativityFeedback` on the `JudgeFeedback` table. All the data in the column will be lost.
  - You are about to drop the column `functionalityFeedback` on the `JudgeFeedback` table. All the data in the column will be lost.
  - You are about to drop the column `interfaceFeedback` on the `JudgeFeedback` table. All the data in the column will be lost.
  - You are about to drop the column `otherFeedback` on the `JudgeFeedback` table. All the data in the column will be lost.
  - You are about to drop the column `technicalityFeedback` on the `JudgeFeedback` table. All the data in the column will be lost.
  - Added the required column `feedback` to the `JudgeFeedback` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."JudgeFeedback" DROP COLUMN "creativityFeedback",
DROP COLUMN "functionalityFeedback",
DROP COLUMN "interfaceFeedback",
DROP COLUMN "otherFeedback",
DROP COLUMN "technicalityFeedback",
ADD COLUMN     "feedback" TEXT NOT NULL;
