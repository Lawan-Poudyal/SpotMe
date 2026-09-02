"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateSchema = validateSchema;
const Error_1 = require("../errors/Error");
function validateSchema(schema, data) {
    const result = schema.safeParse(data);
    if (!result.success) {
        const fieldErrors = {};
        result.error.errors.forEach((err) => {
            const fieldName = err.path.join('.');
            fieldErrors[fieldName] = err.message;
        });
        throw new Error_1.ValidationError('Validation failed', fieldErrors);
    }
    return result.data;
}
//# sourceMappingURL=validateSchema.js.map