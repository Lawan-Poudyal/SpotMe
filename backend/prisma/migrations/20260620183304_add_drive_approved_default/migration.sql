/*
  Warnings:

  - You are about to drop the column `driveApproved` on the `event` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "account" ADD COLUMN     "driveApproved" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "event" DROP COLUMN "driveApproved";
