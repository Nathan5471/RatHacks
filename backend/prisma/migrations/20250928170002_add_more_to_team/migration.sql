-- AlterTable
ALTER TABLE "public"."Team" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "project" TEXT,
ADD COLUMN     "submittedProject" BOOLEAN NOT NULL DEFAULT false;
