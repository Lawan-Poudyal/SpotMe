-- AlterTable
ALTER TABLE "photo" ADD COLUMN     "retry_count" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "reference_face" ADD COLUMN     "retry_count" INTEGER NOT NULL DEFAULT 0;
