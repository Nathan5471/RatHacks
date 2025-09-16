-- CreateEnum
CREATE TYPE "public"."AccountType" AS ENUM ('student', 'judge', 'organizer');

-- CreateEnum
CREATE TYPE "public"."GradeLevel" AS ENUM ('9', '10', '11', '12');

-- CreateTable
CREATE TABLE "public"."User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "emailToken" TEXT NOT NULL,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "lastResendEmailRequest" TIMESTAMP(3),
    "accountType" "public"."AccountType" NOT NULL DEFAULT 'student',
    "password" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "schoolDivision" TEXT NOT NULL,
    "gradeLevel" "public"."GradeLevel" NOT NULL,
    "isGovSchool" BOOLEAN NOT NULL,
    "validRefreshTokens" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");
