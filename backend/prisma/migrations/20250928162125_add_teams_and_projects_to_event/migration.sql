-- AlterTable
ALTER TABLE "public"."Event" ADD COLUMN     "projects" TEXT[],
ADD COLUMN     "teams" TEXT[];

-- CreateTable
CREATE TABLE "public"."Team" (
    "id" TEXT NOT NULL,
    "joinCode" TEXT NOT NULL,
    "members" TEXT[],
    "eventId" TEXT NOT NULL,

    CONSTRAINT "Team_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Project" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "codeURL" TEXT,
    "screenshotPath" TEXT,
    "videoPath" TEXT,
    "demoURL" TEXT,
    "eventId" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "submittedBy" TEXT NOT NULL,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);
