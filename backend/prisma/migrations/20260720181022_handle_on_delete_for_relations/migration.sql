-- DropForeignKey
ALTER TABLE "EmailReceipt" DROP CONSTRAINT "EmailReceipt_emailId_fkey";

-- DropForeignKey
ALTER TABLE "EmailReceipt" DROP CONSTRAINT "EmailReceipt_userId_fkey";

-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_createdById_fkey";

-- DropForeignKey
ALTER TABLE "JudgeFeedback" DROP CONSTRAINT "JudgeFeedback_judgeId_fkey";

-- DropForeignKey
ALTER TABLE "JudgeFeedback" DROP CONSTRAINT "JudgeFeedback_projectId_fkey";

-- DropForeignKey
ALTER TABLE "PageView" DROP CONSTRAINT "PageView_sessionId_fkey";

-- DropForeignKey
ALTER TABLE "Project" DROP CONSTRAINT "Project_teamId_fkey";

-- DropForeignKey
ALTER TABLE "Team" DROP CONSTRAINT "Team_eventId_fkey";

-- DropForeignKey
ALTER TABLE "Workshop" DROP CONSTRAINT "Workshop_organizerId_fkey";

-- AlterTable
ALTER TABLE "Event" ALTER COLUMN "createdById" DROP NOT NULL;

-- AlterTable
ALTER TABLE "JudgeFeedback" ALTER COLUMN "judgeId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Workshop" ALTER COLUMN "organizerId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Team" ADD CONSTRAINT "Team_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JudgeFeedback" ADD CONSTRAINT "JudgeFeedback_judgeId_fkey" FOREIGN KEY ("judgeId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JudgeFeedback" ADD CONSTRAINT "JudgeFeedback_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Workshop" ADD CONSTRAINT "Workshop_organizerId_fkey" FOREIGN KEY ("organizerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmailReceipt" ADD CONSTRAINT "EmailReceipt_emailId_fkey" FOREIGN KEY ("emailId") REFERENCES "Email"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmailReceipt" ADD CONSTRAINT "EmailReceipt_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PageView" ADD CONSTRAINT "PageView_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "Session"("id") ON DELETE CASCADE ON UPDATE CASCADE;
