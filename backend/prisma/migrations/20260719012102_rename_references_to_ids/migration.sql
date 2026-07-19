-- AlterTable
ALTER TABLE "Email" RENAME COLUMN "sentTo" TO "sentToIds";

-- AlterTable
ALTER TABLE "Event" RENAME COLUMN "checkedIn" TO "checkedInIds";
ALTER TABLE "Event" RENAME COLUMN "createdBy" TO "createdById";
ALTER TABLE "Event" RENAME COLUMN "participants" TO "participantIds";
ALTER TABLE "Event" RENAME COLUMN "projects" TO "projectIds";
ALTER TABLE "Event" RENAME COLUMN "teams" TO "teamIds";

-- AlterTable
ALTER TABLE "Project" RENAME COLUMN "judgeFeedback" TO "judgeFeedbackIds";
ALTER TABLE "Project" RENAME COLUMN "submittedBy" TO "submittedById";

-- AlterTable
ALTER TABLE "Team" RENAME COLUMN "members" TO "memberIds";
ALTER TABLE "Team" RENAME COLUMN "project" TO "projectId";

-- AlterTable
ALTER TABLE "User" RENAME COLUMN "events" TO "eventIds";
ALTER TABLE "User" RENAME COLUMN "workshops" TO "workshopIds";

-- AlterTable
ALTER TABLE "Workshop" RENAME COLUMN "organizer" TO "organizerId";
ALTER TABLE "Workshop" RENAME COLUMN "participants" TO "participantIds";
