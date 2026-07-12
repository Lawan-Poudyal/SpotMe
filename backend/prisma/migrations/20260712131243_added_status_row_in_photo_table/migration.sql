-- CreateEnum
CREATE TYPE "ProcessingStatus" AS ENUM ('PENDING', 'PROCESSING', 'DONE', 'FAILED');

-- AlterTable
ALTER TABLE "photo" ADD COLUMN     "status" "ProcessingStatus" NOT NULL DEFAULT 'PENDING';
