/*
  Warnings:

  - You are about to drop the `_Participant` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."_Participant" DROP CONSTRAINT "_Participant_A_fkey";

-- DropForeignKey
ALTER TABLE "public"."_Participant" DROP CONSTRAINT "_Participant_B_fkey";

-- AlterTable
ALTER TABLE "public"."Event" ADD COLUMN     "participants" TEXT[];

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "events" TEXT[];

-- DropTable
DROP TABLE "public"."_Participant";
