"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prismaClientConfig_1 = require("../../config/prismaClientConfig");
const generate_reference_embeddings_queue_1 = require("../../queues/generate_reference_embeddings.queue");
const node_cron_1 = __importDefault(require("node-cron"));
node_cron_1.default.schedule('*/1 * * * * ', async () => {
    console.log("CRON JOB INITIATED FOR UPLOAD FACE EMBEDDINGS <=========================>");
    const staleDate = new Date(Date.now() - 1 * 60 * 1000);
    const failed_photos = await prismaClientConfig_1.prisma.referenceFace.findMany({
        where: {
            OR: [
                { status: "PROCESSING", statusUpdatedAt: { lt: staleDate } },
                { status: "FAILED" }
            ],
            retry_count: { lt: 6 }
        },
        take: 10,
        include: {
            event: true
        }
    });
    if (!failed_photos || failed_photos.length === 0)
        return;
    await Promise.all(failed_photos.map((photo) => {
        generate_reference_embeddings_queue_1.referenceEmbeddingQueue.add("generate_reference_embeddings", {
            eventId: photo.event.id,
            ownerId: photo.userId,
            photoURL: photo.photo_url,
            photoId: photo.id
        });
    }));
}, {
    timezone: 'Asia/Kathmandu'
});
//# sourceMappingURL=schedule_reference_embeddings.js.map