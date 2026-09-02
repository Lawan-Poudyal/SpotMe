"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generatedEmbedding = generatedEmbedding;
const prismaClientConfig_1 = require("../../config/prismaClientConfig");
const redisConfig_1 = require("../../config/redisConfig");
const faceService_1 = require("../../lib/faceService");
const crypto_1 = require("crypto");
async function generatedEmbedding(job) {
    const { photoURL, photoId, eventId } = job.data;
    try {
        console.log("Generating the embeddings");
        await prismaClientConfig_1.prisma.photo.update({
            where: { id: photoId },
            data: {
                status: "PROCESSING",
                statusUpdatedAt: new Date(),
                retry_count: { increment: 1 }
            }
        });
        const result = await (0, faceService_1.generateEmbeddings)(photoId, photoURL);
        if (result.status === 'error') {
            throw new Error(result.error || 'face_service_error');
        }
        await prismaClientConfig_1.prisma.$transaction(async (tx) => {
            for (const face of result.faces) {
                await tx.$executeRaw `
          INSERT INTO "photo_face" ("id", "photo_id", "face_index", "embedding", "bbox", "det_score")
          VALUES (
            ${(0, crypto_1.randomUUID)()},
            ${photoId},
            ${face.face_index},
            ${JSON.stringify(face.embedding)}::vector,
            ${JSON.stringify(face.bbox)}::jsonb,
            ${face.det_score}
            )
        `;
            }
            await tx.photo.update({
                where: { id: photoId },
                data: { status: 'DONE', statusUpdatedAt: new Date() },
            });
        });
        await redisConfig_1.redis.publish('embedding_news', JSON.stringify({ success: true, photoId, eventId, facesFound: result.faces.length }));
        console.log(`embeddings generated for ${photoId}: ${result.faces.length} face(s)`);
    }
    catch (err) {
        await prismaClientConfig_1.prisma.photo.update({
            where: { id: photoId },
            data: { status: 'FAILED', statusUpdatedAt: new Date() },
        });
        await redisConfig_1.redis.publish('embedding_news', JSON.stringify({ success: false, photoId, eventId }));
        console.log('thrown error from embedding generation queue');
        if (err instanceof Error) {
            console.log(err.name);
            console.log(err.stack);
            throw err;
        }
    }
}
//# sourceMappingURL=generate_embeddings.processor.js.map