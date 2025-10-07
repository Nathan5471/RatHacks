/*
  Warnings:

  - You are about to drop the column `releasedJuding` on the `Event` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Event" DROP COLUMN "releasedJuding",
ADD COLUMN     "releasedJudging" BOOLEAN NOT NULL DEFAULT false;
