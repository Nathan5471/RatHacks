/*
  Warnings:

  - You are about to drop the column `emailLists` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "emailLists",
ADD COLUMN     "emailListIds" TEXT[];
