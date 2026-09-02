"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateData = validateData;
const dbError_1 = require("../errors/dbError");
function validateData(schema, data, res) {
    const result = schema.safeParse(data);
    if (!result.success) {
        const zodErr = result.error;
        const toSendPayload = {
            success: false,
            err: {
                name: 'Bad request payload',
                message: zodErr.issues[0]?.message ?? 'Invalid request payload',
                details: zodErr.issues.map((i) => ({
                    path: i.path.join('.'),
                    message: i.message,
                })),
            },
        };
        throw new dbError_1.ZodValidationError('ValidationError', 400, toSendPayload);
    }
    return result.data;
}
//# sourceMappingURL=validateSyncSchema.js.map