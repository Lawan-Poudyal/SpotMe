/*
  Warnings:

  - A unique constraint covering the columns `[public_id]` on the table `photo` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `public_id` to the `photo` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "photo" ADD COLUMN     "public_id" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "photo_public_id_key" ON "photo"("public_id");
