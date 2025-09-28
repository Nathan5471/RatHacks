-- AlterTable
ALTER TABLE "public"."Project" ALTER COLUMN "submittedBy" DROP NOT NULL,
ALTER COLUMN "submittedAt" DROP NOT NULL,
ALTER COLUMN "submittedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "contactFirstName" TEXT,
ADD COLUMN     "contactLastName" TEXT,
ADD COLUMN     "contactPhoneNumber" TEXT,
ADD COLUMN     "contactRelationship" TEXT;
