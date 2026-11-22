-- CreateTable
CREATE TABLE "EmailList" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "EmailList_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ImportedEmail" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "emailListId" TEXT NOT NULL,

    CONSTRAINT "ImportedEmail_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ImportedEmail" ADD CONSTRAINT "ImportedEmail_emailListId_fkey" FOREIGN KEY ("emailListId") REFERENCES "EmailList"("id") ON DELETE CASCADE ON UPDATE CASCADE;
