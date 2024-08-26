/*
  Warnings:

  - You are about to drop the column `badges` on the `Group` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Group" DROP COLUMN "badges";

-- CreateTable
CREATE TABLE "Badge" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Badge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GroupBadge" (
    "id" SERIAL NOT NULL,
    "groupId" INTEGER NOT NULL,
    "bageId" INTEGER NOT NULL,
    "acquiredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GroupBadge_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "GroupBadge" ADD CONSTRAINT "GroupBadge_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupBadge" ADD CONSTRAINT "GroupBadge_bageId_fkey" FOREIGN KEY ("bageId") REFERENCES "Badge"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
