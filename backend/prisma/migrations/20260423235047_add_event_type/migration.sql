-- CreateEnum
CREATE TYPE "EventType" AS ENUM ('hackathon', 'ctf');

-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "type" "EventType" NOT NULL DEFAULT 'hackathon';
