/*
  Warnings:

  - You are about to drop the column `projectId` on the `categories` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `categories` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "categories" DROP CONSTRAINT "categories_projectId_fkey";

-- AlterTable
ALTER TABLE "categories" DROP COLUMN "projectId";

-- CreateIndex
CREATE UNIQUE INDEX "categories_name_key" ON "categories"("name");
