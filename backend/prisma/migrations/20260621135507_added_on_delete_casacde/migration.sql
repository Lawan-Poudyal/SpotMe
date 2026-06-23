-- DropForeignKey
ALTER TABLE "photo" DROP CONSTRAINT "photo_uploaded_by_fkey";

-- AddForeignKey
ALTER TABLE "photo" ADD CONSTRAINT "photo_uploaded_by_fkey" FOREIGN KEY ("uploaded_by") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
