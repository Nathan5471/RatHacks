/*
  Warnings:

  - You are about to drop the column `sentTimes` on the `Email` table. All the data in the column will be lost.
  - You are about to drop the column `sentToIds` on the `Email` table. All the data in the column will be lost.
  - You are about to drop the column `checkedInIds` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `participantIds` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `projectIds` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `teamIds` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `judgeFeedbackIds` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `memberIds` on the `Team` table. All the data in the column will be lost.
  - You are about to drop the column `projectId` on the `Team` table. All the data in the column will be lost.
  - You are about to drop the column `eventIds` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `teamId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `workshopIds` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `participantIds` on the `Workshop` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Email" DROP COLUMN "sentTimes",
DROP COLUMN "sentToIds";

-- AlterTable
ALTER TABLE "Event" DROP COLUMN "checkedInIds",
DROP COLUMN "participantIds",
DROP COLUMN "projectIds",
DROP COLUMN "teamIds";

-- AlterTable
ALTER TABLE "Project" DROP COLUMN "judgeFeedbackIds";

-- AlterTable
ALTER TABLE "Team" DROP COLUMN "memberIds",
DROP COLUMN "projectId";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "eventIds",
DROP COLUMN "teamId",
DROP COLUMN "workshopIds";

-- AlterTable
ALTER TABLE "Workshop" DROP COLUMN "participantIds";
