-- CreateTable
CREATE TABLE "photo_face" (
    "id" TEXT NOT NULL,
    "photo_id" TEXT NOT NULL,
    "face_index" INTEGER NOT NULL,
    "embedding" vector(512) NOT NULL,
    "bbox" JSONB,
    "det_score" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "photo_face_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "photo_face_photo_id_idx" ON "photo_face"("photo_id");

-- AddForeignKey
ALTER TABLE "photo_face" ADD CONSTRAINT "photo_face_photo_id_fkey" FOREIGN KEY ("photo_id") REFERENCES "photo"("id") ON DELETE CASCADE ON UPDATE CASCADE;
