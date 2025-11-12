-- CreateEnum
CREATE TYPE "public"."Theme" AS ENUM ('default', 'spooky');

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "theme" "public"."Theme" NOT NULL DEFAULT 'default';
