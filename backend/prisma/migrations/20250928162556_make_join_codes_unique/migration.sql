/*
  Warnings:

  - A unique constraint covering the columns `[joinCode]` on the table `Team` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Team_joinCode_key" ON "public"."Team"("joinCode");
