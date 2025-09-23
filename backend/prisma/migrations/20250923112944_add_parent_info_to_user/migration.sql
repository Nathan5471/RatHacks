/*
  Warnings:

  - The values [organizer,judge] on the enum `GradeLevel` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "public"."GradeLevel_new" AS ENUM ('nine', 'ten', 'eleven', 'twelve');
ALTER TABLE "public"."User" ALTER COLUMN "gradeLevel" TYPE "public"."GradeLevel_new" USING ("gradeLevel"::text::"public"."GradeLevel_new");
ALTER TYPE "public"."GradeLevel" RENAME TO "GradeLevel_old";
ALTER TYPE "public"."GradeLevel_new" RENAME TO "GradeLevel";
DROP TYPE "public"."GradeLevel_old";
COMMIT;

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "parentEmail" TEXT,
ADD COLUMN     "parentFirstName" TEXT,
ADD COLUMN     "parentLastName" TEXT,
ADD COLUMN     "parentPhoneNumber" TEXT,
ADD COLUMN     "previousHackathon" BOOLEAN,
ADD COLUMN     "techStack" TEXT,
ALTER COLUMN "schoolDivision" DROP NOT NULL,
ALTER COLUMN "gradeLevel" DROP NOT NULL,
ALTER COLUMN "isGovSchool" DROP NOT NULL;
