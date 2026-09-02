"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generatedEmbedding = generatedEmbedding;
const prismaClientConfig_1 = require("../../config/prismaClientConfig");
const redisConfig_1 = require("../../config/redisConfig");
const faceService_1 = require("../../lib/faceService");
async function generatedEmbedding(job) {
    const { photoURL, photoId, eventId, ownerId } = job.data;
    try {
        console.log('Generating the embeddings');
        await prismaClientConfig_1.prisma.referenceFace.update({
            where: { id: photoId },
            data: {
                status: 'PROCESSING',
                statusUpdatedAt: new Date(),
                retry_count: { increment: 1 },
            },
        });
        const result = await (0, faceService_1.generateSelfieEmbedding)(photoId, photoURL, eventId);
        if (result.status === 'error' || !result.embedding) {
            console.log('Face service returned error:', JSON.stringify(result));
            throw new Error(result.error || 'face_service_error');
        }
        await prismaClientConfig_1.prisma.$executeRaw `
      UPDATE "reference_face"
      SET "status" = 'DONE', "embedding" = ${JSON.stringify(result.embedding)}::vector
      WHERE "id" = ${photoId}
    `;
        await redisConfig_1.redis.publish('reference_embedding_news', JSON.stringify({ success: true, photoId, eventId, ownerId }));
        console.log(`embeddings generated for ${photoId}`);
    }
    catch (err) {
        await prismaClientConfig_1.prisma.referenceFace.update({
            where: { id: photoId },
            data: { status: 'FAILED', statusUpdatedAt: new Date() },
        });
        await redisConfig_1.redis.publish('reference_embedding_news', JSON.stringify({ success: false, photoId, eventId, ownerId }));
        console.log('thrown error from embedding generation queue');
        if (err instanceof Error) {
            console.log(err.name);
            console.log(err.stack);
            throw err;
        }
    }
}
//# sourceMappingURL=generate_reference_embeddings.processor.js.map