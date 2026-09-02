"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inviteLinkSchema = void 0;
const zod_1 = require("zod");
exports.inviteLinkSchema = zod_1.z.object({
    token: zod_1.z.string().trim().min(1, 'token cannot be empty'),
});
//# sourceMappingURL=inviteLink.validation.js.map