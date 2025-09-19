/*
  Warnings:

  - The values [9,10,11,12] on the enum `GradeLevel` will be removed. If these variants are still used in the database, this will fail.

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
ALTER TABLE "public"."User" ADD COLUMN     "validAccessTokens" TEXT[];
