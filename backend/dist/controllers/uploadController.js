"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveUploadRequestSingular = exports.saveUploadRequest = exports.signedUploadRequest = void 0;
const asyncHandler_1 = require("../utils/asyncHandler");
const cloudinary_1 = require("../lib/cloudinary");
const Error_1 = require("../errors/Error");
const prismaClientConfig_1 = require("../config/prismaClientConfig");
const upload_validation_1 = require("../validations/upload.validation");
const generate_embeddings_queue_1 = require("../queues/generate_embeddings.queue");
const validateSchema_1 = require("../utils/validateSchema");
const generate_reference_embeddings_queue_1 = require("../queues/generate_reference_embeddings.queue");
const server_1 = require("../server");
const signedUploadRequest = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const timestamp = Math.floor(Date.now() / 1000);
    const eventId = req.eventId;
    const folderName = `SpotMe/events/${eventId}/photos`;
    const params = { timestamp, folder: folderName };
    const signature = cloudinary_1.cloudinary.utils.api_sign_request(params, process.env.CLOUDINARY_API_SECRET);
    res.status(200).json({
        success: true,
        data: {
            signature,
            timestamp,
            folder: folderName,
            apiKey: process.env.CLOUDINARY_API_KEY,
            cloudName: process.env.CLOUDINARY_CLOUD_NAME,
        },
    });
});
exports.signedUploadRequest = signedUploadRequest;
const saveUploadRequest = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { validatedUserId } = req;
    const { eventId, photos } = (0, validateSchema_1.validateSchema)(upload_validation_1.saveUploadSchema, req.body);
    const event = await prismaClientConfig_1.prisma.event.findUnique({ where: { id: eventId } });
    if (!event)
        throw new Error_1.NotFoundError(`Event with id "${eventId}" not found`);
    const saved = await prismaClientConfig_1.prisma.photo.createManyAndReturn({
        data: photos.map((p) => ({
            event_id: eventId,
            uploaded_by: validatedUserId,
            photo_url: p.url,
            public_id: p.publicId,
            width: p.width,
            height: p.height,
        })),
    });
    res.status(201).json({ success: true, data: saved });
    await prismaClientConfig_1.prisma.event
        .update({
        where: { id: eventId },
        data: { photoCount: { increment: photos.length } },
    })
        .catch((err) => {
        console.error('Error in post-update cleanup:', err);
    });
    let { io, idMap } = (0, server_1.getIO)();
    io.to(eventId).except(validatedUserId).emit("dynamic_image", saved);
    await Promise.all(saved.map((photo) => generate_embeddings_queue_1.embeddingQueue.add('generate_embedding', {
        photoId: photo.id,
        photoURL: photo.photo_url,
        eventId: eventId,
    }))).catch((err) => {
        console.error('Error queuing embedding jobs:', err);
    });
});
exports.saveUploadRequest = saveUploadRequest;
const saveUploadRequestSingular = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { validatedUserId } = req;
    const { userId, eventId, photo, existingPhotoId } = (0, validateSchema_1.validateSchema)(upload_validation_1.saveUploadSingularSchema, req.body);
    if (userId !== validatedUserId)
        throw new Error_1.ForbiddenError('You are forbidden');
    const event = await prismaClientConfig_1.prisma.event.findUnique({ where: { id: eventId } });
    if (!event)
        throw new Error_1.NotFoundError(`Event with id "${eventId}" not found`);
    const saved = await prismaClientConfig_1.prisma.referenceFace.upsert({
        where: {
            eventId_userId: {
                eventId: eventId,
                userId: userId,
            },
        },
        update: {
            photo_url: photo.url,
            public_id: photo.publicId,
        },
        create: {
            photo_url: photo.url,
            eventId: eventId,
            public_id: photo.publicId,
            width: photo.width,
            height: photo.height,
            userId: userId,
        },
    });
    if (!existingPhotoId) {
        cloudinary_1.cloudinary.uploader.destroy(existingPhotoId).catch((err) => {
            console.error('Problem deleting the image');
        });
    }
    await generate_reference_embeddings_queue_1.referenceEmbeddingQueue
        .add('generate_reference_embeddings', {
        photoId: saved.id,
        photoURL: saved.photo_url,
        eventId: saved.eventId,
        ownerId: saved.userId,
    })
        .catch((err) => {
        console.error(`The error is ${err}`);
    });
    res.status(201).json({ success: true, data: saved });
});
exports.saveUploadRequestSingular = saveUploadRequestSingular;
//# sourceMappingURL=uploadController.js.map