/*
  Warnings:

  - You are about to drop the `_emailSentTo` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_emailSentTo" DROP CONSTRAINT "_emailSentTo_A_fkey";

-- DropForeignKey
ALTER TABLE "_emailSentTo" DROP CONSTRAINT "_emailSentTo_B_fkey";

-- DropTable
DROP TABLE "_emailSentTo";

-- CreateTable
CREATE TABLE "EmailReceipt" (
    "id" TEXT NOT NULL,
    "emailId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "sentAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "seen" BOOLEAN NOT NULL DEFAULT false,
    "seenAt" TIMESTAMP(3),

    CONSTRAINT "EmailReceipt_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "EmailReceipt" ADD CONSTRAINT "EmailReceipt_emailId_fkey" FOREIGN KEY ("emailId") REFERENCES "Email"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmailReceipt" ADD CONSTRAINT "EmailReceipt_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
