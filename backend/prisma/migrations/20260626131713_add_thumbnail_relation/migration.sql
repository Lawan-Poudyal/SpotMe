/*
  Warnings:

  - A unique constraint covering the columns `[thumbnailId]` on the table `event` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "event" ADD COLUMN     "photoCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "thumbnailId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "event_thumbnailId_key" ON "event"("thumbnailId");

-- AddForeignKey
ALTER TABLE "event" ADD CONSTRAINT "event_thumbnailId_fkey" FOREIGN KEY ("thumbnailId") REFERENCES "photo"("id") ON DELETE SET NULL ON UPDATE CASCADE;
