"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createReferencePhotoHandler = exports.createPhotoHandler = void 0;
const photos_queue_1 = require("../queues/photos.queue");
const reference_photo_queue_1 = require("../queues/reference_photo.queue");
const createPhotoHandler = async (req, res) => {
    try {
        let { eventId, ownerId, accessToken, driveFileIds } = req.body;
        const { validatedUserId } = req;
        if (validatedUserId !== ownerId) {
            return res.status(403).json({
                success: false,
                err: {
                    name: 'Unauthorized action intended',
                    message: "You can't get someone elses events"
                }
            });
        }
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
        if (!accessToken || accessToken.trim() === "") {
            return res.status(400).json({
                success: false,
                err: {
                    name: 'Bad request payload',
                    message: 'Missing access token in request payload'
                }
            });
        }
        await Promise.all(driveFileIds.map(async (driveFileId) => {
            await photos_queue_1.photoQueue.add("process-photo", {
                eventId: eventId,
                ownerId: ownerId,
                accessToken: accessToken,
                driveFileId: driveFileId,
            });
        }));
        return res.status(200).json({
            success: true,
            data: { success: true }
        });
    }
    catch (err) {
        if (err instanceof Error) {
            console.log(err.stack);
            console.log(err.message);
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
const createReferencePhotoHandler = async (req, res) => {
    try {
        let { eventId, ownerId, accessToken, driveFileId, existingPhotoId } = req.body;
        const { validatedUserId } = req;
        if (validatedUserId !== ownerId) {
            return res.status(403).json({
                success: false,
                err: {
                    name: 'Unauthorized action intended',
                    message: "You can't get someone elses events"
                }
            });
        }
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
        if (!accessToken || accessToken.trim() === "") {
            return res.status(400).json({
                success: false,
                err: {
                    name: 'Bad request payload',
                    message: 'Missing access token in request payload'
                }
            });
        }
        await reference_photo_queue_1.referencePhotoQueue.add("reference-photo", {
            eventId: eventId,
            ownerId: ownerId,
            accessToken: accessToken,
            driveFileId: driveFileId,
            existingPhotoId: existingPhotoId
        });
        return res.status(200).json({
            success: true,
            data: { success: true }
        });
    }
    catch (err) {
        if (err instanceof Error) {
            console.log(err.stack);
            console.log(err.message);
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
exports.createReferencePhotoHandler = createReferencePhotoHandler;
//# sourceMappingURL=asyncGooglePhotoUploadController.js.map