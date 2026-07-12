-- CreateTable
CREATE TABLE "reference_face" (
    "id" TEXT NOT NULL,
    "photo_url" TEXT NOT NULL,
    "public_id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reference_face_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "reference_face_public_id_key" ON "reference_face"("public_id");

-- CreateIndex
CREATE UNIQUE INDEX "reference_face_eventId_userId_key" ON "reference_face"("eventId", "userId");

-- AddForeignKey
ALTER TABLE "reference_face" ADD CONSTRAINT "reference_face_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reference_face" ADD CONSTRAINT "reference_face_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
