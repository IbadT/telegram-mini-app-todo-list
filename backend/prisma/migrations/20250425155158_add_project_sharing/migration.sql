/*
  Warnings:

  - You are about to drop the column `userId` on the `projects` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[shareCode]` on the table `projects` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `ownerId` to the `projects` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "project_shares" (
    "id" SERIAL NOT NULL,
    "projectId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "project_shares_pkey" PRIMARY KEY ("id")
);

-- AlterTable
ALTER TABLE "projects" 
    ADD COLUMN "shareCode" TEXT,
    ADD COLUMN "ownerId" INTEGER;

-- Update existing projects to set ownerId equal to userId
UPDATE "projects" SET "ownerId" = "userId";

-- RenameForeignKey (для поддержки нового названия отношения)
ALTER TABLE "projects" DROP CONSTRAINT IF EXISTS "projects_userId_fkey";

-- Make ownerId required
ALTER TABLE "projects" 
    ALTER COLUMN "ownerId" SET NOT NULL;

-- Add new foreign key
ALTER TABLE "projects" 
    ADD CONSTRAINT "projects_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- DropColumn
ALTER TABLE "projects" DROP COLUMN IF EXISTS "userId";

-- CreateIndex
CREATE UNIQUE INDEX "projects_shareCode_key" ON "projects"("shareCode");

-- CreateIndex
CREATE UNIQUE INDEX "project_shares_projectId_userId_key" ON "project_shares"("projectId", "userId");

-- AddForeignKey
ALTER TABLE "project_shares" ADD CONSTRAINT "project_shares_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_shares" ADD CONSTRAINT "project_shares_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
