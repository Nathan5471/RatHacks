/*
  Warnings:

  - You are about to drop the column `sent` on the `Email` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Email" DROP COLUMN "sent",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "sendOnJoin" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "sentTimes" TIMESTAMP(3)[],
ADD COLUMN     "sentTo" TEXT[];
