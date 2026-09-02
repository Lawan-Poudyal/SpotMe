"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePhotoSchema = exports.saveUploadSingularSchema = exports.saveUploadSchema = exports.referencePhotoSchema = exports.eventSchema = void 0;
const zod_1 = require("zod");
exports.eventSchema = zod_1.z.object({
    eventId: zod_1.z.string().trim().uuid('Invalid eventId format'),
});
exports.referencePhotoSchema = zod_1.z.object({
    eventId: zod_1.z.string().min(1, 'Missing or invalid eventId in the request '),
    userId: zod_1.z.string().min(1, 'Missing or invalid userId in the request '),
});
exports.saveUploadSchema = zod_1.z.object({
    eventId: zod_1.z.string().min(1, 'Missing or invalid eventId in the request '),
    photos: zod_1.z
        .array(zod_1.z.object({
        url: zod_1.z.string().trim().url(),
        publicId: zod_1.z.string().trim().min(1).max(255),
        width: zod_1.z.number().int().positive(),
        height: zod_1.z.number().int().positive(),
    }))
        .min(1)
        .max(30),
});
exports.saveUploadSingularSchema = zod_1.z.object({
    userId: zod_1.z.string().min(1, 'Missing userId in the request body'),
    eventId: zod_1.z.string().min(1, 'Missing or invalid eventId in the request body'),
    photo: zod_1.z.object({
        url: zod_1.z.string().url(),
        publicId: zod_1.z.string().min(1).max(255),
        width: zod_1.z.number().int().positive(),
        height: zod_1.z.number().int().positive(),
    }),
    existingPhotoId: zod_1.z.string().min(1, 'Missing existingPhotoId in the request'),
});
exports.deletePhotoSchema = zod_1.z.object({
    photoId: zod_1.z.string().trim().uuid('Missing or invalid photoId in the request '),
    eventId: zod_1.z.string().trim().uuid('Missing or invalid eventId in the request '),
});
//# sourceMappingURL=upload.validation.js.map