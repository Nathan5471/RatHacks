-- CreateEnum
CREATE TYPE "public"."Status" AS ENUM ('upcoming', 'ongoing', 'completed');

-- AlterTable
ALTER TABLE "public"."Event" ADD COLUMN     "status" "public"."Status" NOT NULL DEFAULT 'upcoming';

-- AlterTable
ALTER TABLE "public"."Workshop" ADD COLUMN     "status" "public"."Status" NOT NULL DEFAULT 'upcoming';
