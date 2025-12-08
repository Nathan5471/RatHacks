-- AlterTable
ALTER TABLE "public"."Email" ADD COLUMN     "sendFrom" TEXT;

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "emailLists" TEXT[];

-- CreateTable
CREATE TABLE "public"."EmailList" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "EmailList_pkey" PRIMARY KEY ("id")
);
