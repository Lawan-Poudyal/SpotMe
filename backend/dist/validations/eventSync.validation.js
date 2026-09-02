"use strict";
// This is my schema one 
Object.defineProperty(exports, "__esModule", { value: true });
exports.getParticipantsSchema = exports.deleteEventSchema = exports.getEventSchema = exports.createEventSchema = exports.eventBaseSchema = void 0;
const zod_1 = require("zod");
// The full shape — single source of truth for the Event resource
exports.eventBaseSchema = zod_1.z.object({
    eventName: zod_1.z
        .string({ required_error: 'Missing event name in the request payload' })
        .trim()
        .min(1, 'Missing event name in the request payload'),
    ownerId: zod_1.z
        .string({ required_error: 'Missing owner id in the request payload' })
        .trim()
        .min(1, 'Missing owner id in the request payload'),
    thumbNailId: zod_1.z
        .string({ required_error: 'Missing location in the request payload' })
        .trim()
        .min(1, 'Missing location in the request payload'),
    eventId: zod_1.z
        .string({ required_error: 'Missing eventId in the request payoad' })
        .trim()
        .min(1, 'Missing eventId in the request payoad'),
});
exports.createEventSchema = exports.eventBaseSchema.pick({
    eventName: true,
    ownerId: true
});
exports.getEventSchema = exports.eventBaseSchema.pick({
    ownerId: true,
});
exports.deleteEventSchema = exports.eventBaseSchema.pick({
    ownerId: true,
    eventName: true,
    eventId: true
});
exports.getParticipantsSchema = exports.eventBaseSchema.pick({
    eventId: true,
    ownerId: true,
});
//# sourceMappingURL=eventSync.validation.js.map