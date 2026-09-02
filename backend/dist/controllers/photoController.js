"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteThumbnailHandler = exports.getMyPhotosHandler = exports.getSingularPhotoHandler = exports.deletePhotoHandler = exports.getPhotoHandler = void 0;
const asyncHandler_1 = require("../utils/asyncHandler");
const Error_1 = require("../errors/Error");
const prismaClientConfig_1 = require("../config/prismaClientConfig");
const cloudinary_1 = require("../lib/cloudinary");
const validateSchema_1 = require("../utils/validateSchema");
const upload_validation_1 = require("../validations/upload.validation");
const isThumbnail_1 = require("../utils/isThumbnail");
const getPhotoHandler = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const eventId = req.eventId;
    const photos = await prismaClientConfig_1.prisma.photo.findMany({
        where: {
            event_id: eventId,
        },
        select: {
            id: true,
            photo_url: true,
            event_id: true,
            uploaded_at: true,
            uploaded_by: true,
            width: true,
            public_id: true,
            height: true,
        },
    });
    res.status(200).json({
        success: true,
        data: photos,
    });
});
exports.getPhotoHandler = getPhotoHandler;
const getSingularPhotoHandler = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { validatedUserId } = req;
    const { eventId, userId } = (0, validateSchema_1.validateSchema)(upload_validation_1.referencePhotoSchema, req.query);
    if (validatedUserId !== userId)
        throw new Error_1.ForbiddenError(`You can't access it`);
    const photo = await prismaClientConfig_1.prisma.referenceFace.findUnique({
        where: {
            eventId_userId: {
                eventId: eventId,
                userId: userId,
            },
        },
        select: {
            id: true,
            photo_url: true,
            public_id: true,
            width: true,
            height: true,
            status: true,
        },
    });
    res.status(200).json({
        success: true,
        data: photo,
    });
});
exports.getSingularPhotoHandler = getSingularPhotoHandler;
const deletePhotoHandler = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { validatedUserId } = req;
    const { photoId, eventId } = (0, validateSchema_1.validateSchema)(upload_validation_1.deletePhotoSchema, req.query);
    const thumbnailed = await (0, isThumbnail_1.isThumbnail)(eventId, photoId);
    if (thumbnailed)
        throw new Error_1.ForbiddenError('User doesnot have permission to delete this photo');
    const dbPhoto = await prismaClientConfig_1.prisma.photo.findUnique({
        where: { id: photoId },
        include: {
            event: {
                select: {
                    userId: true,
                    photoCount: true,
                },
            },
        },
    });
    if (!dbPhoto)
        throw new Error_1.NotFoundError('Photo');
    const isUploader = dbPhoto.uploaded_by === validatedUserId;
    const isEventOwner = dbPhoto.event?.userId === validatedUserId;
    if (!isUploader && !isEventOwner) {
        throw new Error_1.ForbiddenError('User does not have permission to delete this photo');
    }
    const newPhotoCount = Math.max(0, (dbPhoto.event?.photoCount ?? 1) - 1);
    await prismaClientConfig_1.prisma.$transaction([
        prismaClientConfig_1.prisma.photo.delete({ where: { id: photoId } }),
        prismaClientConfig_1.prisma.event.update({
            where: { id: dbPhoto.event_id },
            data: { photoCount: newPhotoCount },
        }),
    ]);
    res.status(200).json({ success: true, message: 'Photo deleted successfully' });
    cloudinary_1.cloudinary.uploader.destroy(dbPhoto.public_id).catch((err) => {
        console.error(`Failed to delete Cloudinary asset ${dbPhoto.public_id}:`, err);
    });
});
exports.deletePhotoHandler = deletePhotoHandler;
const deleteThumbnailHandler = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { validatedUserId } = req;
    const { photoId, eventId } = (0, validateSchema_1.validateSchema)(upload_validation_1.deletePhotoSchema, req.query);
    const thumbnailed = await (0, isThumbnail_1.isThumbnail)(eventId, photoId);
    if (!thumbnailed)
        throw new Error_1.NotFoundError(`The thumbnail can't be found`);
    const dbPhoto = await prismaClientConfig_1.prisma.photo.findUnique({
        where: { id: photoId },
        include: {
            event: {
                select: {
                    userId: true,
                    photoCount: true,
                },
            },
        },
    });
    if (!dbPhoto)
        throw new Error_1.NotFoundError('Photo');
    const isUploader = dbPhoto.uploaded_by === validatedUserId;
    const isEventOwner = dbPhoto.event?.userId === validatedUserId;
    if (!isUploader && !isEventOwner) {
        throw new Error_1.ForbiddenError('User does not have permission to delete this photo');
    }
    const newPhotoCount = Math.max(0, (dbPhoto.event?.photoCount ?? 1) - 1);
    await prismaClientConfig_1.prisma.$transaction([
        prismaClientConfig_1.prisma.photo.delete({ where: { id: photoId } }),
        prismaClientConfig_1.prisma.event.update({
            where: { id: dbPhoto.event_id },
            data: { photoCount: newPhotoCount },
        }),
    ]);
    res.status(200).json({ success: true, message: 'Photo deleted successfully' });
    cloudinary_1.cloudinary.uploader.destroy(dbPhoto.public_id).catch((err) => {
        console.error(`Failed to delete Cloudinary asset ${dbPhoto.public_id}:`, err);
    });
});
exports.deleteThumbnailHandler = deleteThumbnailHandler;
const getMyPhotosHandler = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { validatedUserId } = req;
    const { eventId, userId } = (0, validateSchema_1.validateSchema)(upload_validation_1.referencePhotoSchema, req.query);
    if (validatedUserId !== userId)
        throw new Error_1.ForbiddenError(`You can't access it`);
    const referenceFace = await prismaClientConfig_1.prisma.referenceFace.findUnique({
        where: { eventId_userId: { eventId, userId } },
        select: { id: true, status: true },
    });
    if (!referenceFace)
        throw new Error_1.NotFoundError('Reference face');
    if (referenceFace.status !== 'DONE') {
        res.status(202).json({
            success: true,
            message: 'Your reference photo is still processing, please check back shortly',
            data: [],
        });
    }
    const SIMILARITY_THRESHOLD = 0.5;
    const matchedPhotos = await prismaClientConfig_1.prisma.$queryRaw `
    SELECT DISTINCT p.id, p.photo_url, p.public_id, p.width, p.height, p.uploaded_at
    FROM photo_face pf
    JOIN photo p ON p.id = pf.photo_id
    JOIN reference_face rf ON rf."eventId" = p.event_id
    WHERE rf."eventId" = ${eventId}
      AND rf."userId" = ${userId}
      AND p.event_id = ${eventId}
      AND (1 - (pf.embedding <=> rf.embedding)) > ${SIMILARITY_THRESHOLD}
    ORDER BY p.uploaded_at DESC
  `;
    res.status(200).json({
        success: true,
        data: matchedPhotos,
    });
});
exports.getMyPhotosHandler = getMyPhotosHandler;
//# sourceMappingURL=photoController.js.map