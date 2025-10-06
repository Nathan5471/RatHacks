-- AlterTable
ALTER TABLE "public"."Event" ADD COLUMN     "releasedJuding" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "public"."Project" ADD COLUMN     "judgeFeedback" TEXT[],
ADD COLUMN     "ranking" INTEGER;

-- CreateTable
CREATE TABLE "public"."JudgeFeedback" (
    "id" TEXT NOT NULL,
    "judgeId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "themeScore" INTEGER NOT NULL,
    "themeFeedback" TEXT NOT NULL,
    "creativityScore" INTEGER NOT NULL,
    "creativityFeedback" TEXT NOT NULL,
    "functionalityScore" INTEGER NOT NULL,
    "functionalityFeedback" TEXT NOT NULL,
    "technicalityScore" INTEGER NOT NULL,
    "technicalityFeedback" TEXT NOT NULL,
    "interfaceScore" INTEGER NOT NULL,
    "interfaceFeedback" TEXT NOT NULL,
    "polishScore" INTEGER NOT NULL,
    "polishFeedback" TEXT NOT NULL,
    "otherFeedback" TEXT NOT NULL,
    "totalScore" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "JudgeFeedback_pkey" PRIMARY KEY ("id")
);
