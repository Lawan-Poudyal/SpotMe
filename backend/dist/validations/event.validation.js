"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateEventSchema = void 0;
const zod_1 = require("zod");
exports.updateEventSchema = zod_1.z.object({
    eventId: zod_1.z.string().trim().uuid('Invalid eventId format'),
    eventName: zod_1.z.string().trim().min(1, 'Invalid eventName format').optional(),
    thumbNailId: zod_1.z.string().trim().uuid('Invalid thumbNailId format').optional(),
});
//# sourceMappingURL=event.validation.js.map