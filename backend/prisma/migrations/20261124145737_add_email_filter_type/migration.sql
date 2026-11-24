-- CreateEnum
CREATE TYPE "FilterBy" AS ENUM ('Event', 'Workshop', 'GradeLevel', 'School', 'AccountType', 'EmailList');

-- CreateTable
CREATE TABLE "EmailFilter" (
    "id" TEXT NOT NULL,
    "filterBy" "FilterBy" NOT NULL,
    "eventId" TEXT,
    "workshopId" TEXT,
    "emailListId" TEXT,
    "subFilterBy" TEXT,
    "emailId" TEXT NOT NULL,

    CONSTRAINT "EmailFilter_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EmailFilter_emailId_key" ON "EmailFilter"("emailId");

-- AddForeignKey
ALTER TABLE "EmailFilter" ADD CONSTRAINT "EmailFilter_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmailFilter" ADD CONSTRAINT "EmailFilter_workshopId_fkey" FOREIGN KEY ("workshopId") REFERENCES "Workshop"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmailFilter" ADD CONSTRAINT "EmailFilter_emailListId_fkey" FOREIGN KEY ("emailListId") REFERENCES "EmailList"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmailFilter" ADD CONSTRAINT "EmailFilter_emailId_fkey" FOREIGN KEY ("emailId") REFERENCES "Email"("id") ON DELETE CASCADE ON UPDATE CASCADE;
