/*
  Warnings:

  - You are about to drop the column `description` on the `Group` table. All the data in the column will be lost.
  - You are about to drop the column `likes` on the `Group` table. All the data in the column will be lost.
  - You are about to drop the column `memories` on the `Group` table. All the data in the column will be lost.
  - The `badges` column on the `Group` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `introduction` to the `Group` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Group" DROP COLUMN "description",
DROP COLUMN "likes",
DROP COLUMN "memories",
ADD COLUMN     "introduction" TEXT NOT NULL,
ADD COLUMN     "likeCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "postCount" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "isPublic" DROP DEFAULT,
DROP COLUMN "badges",
ADD COLUMN     "badges" TEXT[];

-- CreateTable
CREATE TABLE "Post" (
    "id" SERIAL NOT NULL,
    "nickname" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "postPassword" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "tags" TEXT[],
    "location" TEXT,
    "moment" TIMESTAMP(3) NOT NULL,
    "isPublic" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "groupId" INTEGER NOT NULL,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
