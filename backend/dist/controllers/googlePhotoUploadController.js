"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPhotoHandler = void 0;
const client_1 = require("@prisma/client/runtime/client");
const prismaClientConfig_1 = require("../config/prismaClientConfig");
const dbErrorHash_1 = __importDefault(require("../utils/dbErrorHash"));
const cloudinary_1 = require("../lib/cloudinary");
const axios_1 = __importDefault(require("axios"));
const createPhotoHandler = async (req, res) => {
    try {
        const { validatedUserId } = req;
        let { eventId, ownerId, accessToken, driveFileIds } = req.body;
        if (!eventId || eventId.trim() === "") {
            return res.status(400).json({
                success: false,
                err: {
                    name: 'Bad request payload',
                    message: 'Missing event id in the request payload'
                }
            });
        }
        if (!ownerId || ownerId.trim() === "") {
            return res.status(400).json({
                success: false,
                err: {
                    name: 'Bad request payload',
                    message: 'Missing owner id in the request payload'
                }
            });
        }
        if (validatedUserId !== ownerId) {
            return res.status(403).json({
                success: false,
                err: {
                    name: 'Unauthorized action intended',
                    message: "You can't get someone elses events"
                }
            });
        }
        if (!accessToken || accessToken.trim() === "") {
            return res.status(400).json({
                success: false,
                err: {
                    name: 'Bad request payload',
                    message: 'Missing access token in request payload'
                }
            });
        }
        const googleDriveResponse = await Promise.all(driveFileIds.map(async (id) => {
            const response = await axios_1.default.get(`https://www.googleapis.com/drive/v3/files/${id}?alt=media`, {
                responseType: 'arraybuffer',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                }
            });
            const uploadResult = await new Promise((resolve, reject) => {
                cloudinary_1.cloudinary.uploader.upload_chunked_stream({ resource_type: "image", chunk_size: 5000000 }, (error, uploadResult) => {
                    if (error) {
                        return reject(error);
                    }
                    return resolve(uploadResult);
                }).end(response.data);
            });
            return uploadResult;
        }));
        const toInjectOnce = googleDriveResponse.map(item => {
            return { uploaded_by: ownerId, event_id: eventId, photo_url: item.secure_url, public_id: item.public_id, height: item.height, width: item.width };
        });
        try {
            await prismaClientConfig_1.prisma.$transaction([
                prismaClientConfig_1.prisma.photo.createMany({
                    data: toInjectOnce
                }),
                prismaClientConfig_1.prisma.event.update({
                    where: { id: eventId },
                    data: { photoCount: { increment: toInjectOnce.length } }
                })
            ]);
        }
        catch (dbError) {
            if (dbError instanceof client_1.PrismaClientKnownRequestError) {
                const dbErrorCode = dbError.code;
                const dbErrorName = dbErrorHash_1.default[dbErrorCode];
                if (dbErrorName === "ForeignKeyConstraintViolation") {
                    return res.status(401).json({
                        success: false,
                        err: {
                            name: "Owner or Event doesn't exist",
                            message: "The account or the event has been either deleted by the user or as per community guideline"
                        }
                    });
                }
                else if (dbErrorName === "UniqueConstraintViolation") {
                    return res.status(409).json({
                        success: false,
                        err: {
                            name: "Conflicting names exist",
                            message: "Try using a different name which doesn't already exist in your events"
                        }
                    });
                }
                else
                    throw dbError;
            }
            else
                throw dbError;
        }
        return res.status(200).json({
            success: true,
            data: { success: true }
        });
    }
    catch (err) {
        if (err instanceof Error) {
            return res.status(500).json({
                success: false,
                err: {
                    name: err.name,
                    message: err.message
                }
            });
        }
    }
};
exports.createPhotoHandler = createPhotoHandler;
//# sourceMappingURL=googlePhotoUploadController.js.map