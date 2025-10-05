-- CreateTable
CREATE TABLE "public"."Invite" (
    "token" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" "public"."AccountType" NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Invite_pkey" PRIMARY KEY ("token")
);
