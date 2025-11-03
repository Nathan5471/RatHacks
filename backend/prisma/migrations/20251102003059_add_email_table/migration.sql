-- CreateTable
CREATE TABLE "public"."Email" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "messageSubject" TEXT NOT NULL,
    "messageBody" TEXT NOT NULL,
    "senderEmail" TEXT NOT NULL,
    "receiversEmails" TEXT[],
    "sent" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Email_pkey" PRIMARY KEY ("id")
);
