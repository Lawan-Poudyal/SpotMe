-- CreateIndex
CREATE INDEX "photo_id_status_idx" ON "photo"("id", "status");

-- CreateIndex
CREATE INDEX "reference_face_id_status_idx" ON "reference_face"("id", "status");
