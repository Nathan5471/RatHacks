/*
  Warnings:

  - You are about to drop the column `receiversEmails` on the `Email` table. All the data in the column will be lost.
  - You are about to drop the column `senderEmail` on the `Email` table. All the data in the column will be lost.
  - Added the required column `sendAll` to the `Email` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Email" DROP COLUMN "receiversEmails",
DROP COLUMN "senderEmail",
ADD COLUMN     "filterBy" TEXT,
ADD COLUMN     "sendAll" BOOLEAN NOT NULL,
ADD COLUMN     "subFilterBy" TEXT;
