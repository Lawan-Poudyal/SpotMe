"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.processPhotoJob = processPhotoJob;
const client_1 = require("@prisma/client/runtime/client");
const prismaClientConfig_1 = require("../../config/prismaClientConfig");
const dbErrorHash_1 = __importDefault(require("../../utils/dbErrorHash"));
const axios_1 = __importDefault(require("axios"));
const cloudinary_1 = require("../..//lib/cloudinary");
const redisConfig_1 = require("../../config/redisConfig");
const generate_embeddings_queue_1 = require("../../queues/generate_embeddings.queue");
async function processPhotoJob(job) {
    try {
        console.log('processing');
        const { eventId, ownerId, accessToken, driveFileId } = job.data;
        let photoData;
        let photoId;
        const driveResponse = await axios_1.default.get(`https://www.googleapis.com/drive/v3/files/${driveFileId}?alt=media`, {
            responseType: 'arraybuffer',
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        const uploadResult = (await new Promise((resolve, reject) => {
            cloudinary_1.cloudinary.uploader
                .upload_chunked_stream({ resource_type: 'image', chunk_size: 5000000 }, (error, uploadResult) => {
                if (error) {
                    return reject(error);
                }
                return resolve(uploadResult);
            })
                .end(driveResponse.data);
        }));
        try {
            photoData = await prismaClientConfig_1.prisma.$transaction(async (tx) => {
                let data = await tx.photo.create({
                    data: {
                        uploaded_by: ownerId,
                        event_id: eventId,
                        photo_url: uploadResult.secure_url,
                        public_id: uploadResult.public_id,
                        height: Number(uploadResult.height),
                        width: Number(uploadResult.width),
                    },
                    select: {
                        uploaded_by: true,
                        event_id: true,
                        photo_url: true,
                        public_id: true,
                        height: true,
                        width: true,
                        id: true,
                    }
                });
                await tx.event.update({
                    where: { id: eventId },
                    data: {
                        photoCount: { increment: 1 },
                    },
                });
                return data;
            });
        }
        catch (dbError) {
            if (dbError instanceof client_1.PrismaClientKnownRequestError) {
                const dbErrorCode = dbError.code;
                const dbErrorName = dbErrorHash_1.default[dbErrorCode];
                if (dbErrorName === 'ForeignKeyConstraintViolation') {
                    console.log('The account or the event has been either deleted by the user or as per community guideline');
                    await redisConfig_1.redis.publish('image_news', JSON.stringify({ success: false, driveFileId: driveFileId }));
                    throw dbError;
                }
                else if (dbErrorName === 'UniqueConstraintViolation') {
                    console.log("Try using a different name which doesn't already exist in your events");
                    await redisConfig_1.redis.publish('image_news', JSON.stringify({ userId: ownerId, success: false, driveFileId: driveFileId }));
                    throw dbError;
                }
                else {
                    await redisConfig_1.redis.publish('image_news', JSON.stringify({ userId: ownerId, success: false, driveFileId: driveFileId }));
                    throw dbError;
                }
            }
            else {
                await redisConfig_1.redis.publish('image_news', JSON.stringify({ userId: ownerId, success: false, driveFileId: driveFileId }));
                throw dbError;
            }
        }
        await redisConfig_1.redis.publish('image_news', JSON.stringify({ userId: ownerId, success: true, driveFileId: driveFileId, photoData: photoData }));
        await generate_embeddings_queue_1.embeddingQueue
            .add('generate_embeddings', {
            photoURL: photoData.photo_url,
            photoId: photoData.public_id,
            eventId: eventId,
        })
            .catch((err) => {
            console.error('Error queuing embedding jobs:', err);
        });
        console.log(`The processing is completed for ${driveFileId}`);
    }
    catch (err) {
        console.log('thrown error');
        if (err instanceof Error) {
            console.log(err.name);
            console.log(err.stack);
            throw err;
        }
    }
}
//# sourceMappingURL=photo.processor.js.map