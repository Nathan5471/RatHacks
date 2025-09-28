-- AlterTable
ALTER TABLE "public"."Project" ALTER COLUMN "submittedBy" DROP NOT NULL,
ALTER COLUMN "submittedAt" DROP NOT NULL,
ALTER COLUMN "submittedAt" DROP DEFAULT;
