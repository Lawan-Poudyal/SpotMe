"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalErrorHandler = void 0;
const Error_1 = require("../errors/Error");
const globalErrorHandler = (err, req, res, next) => {
    const isDevelopment = process.env.NODE_ENV === 'development';
    console.log(err.stack);
    if (err instanceof Error_1.AppError) {
        const response = {
            status: err.status,
            message: err.message,
        };
        if (err instanceof Error_1.ValidationError && err.fields) {
            response.errors = err.fields;
        }
        res.status(err.status).json(response);
        return;
    }
    const response = {
        status: 500,
        message: isDevelopment ? err.message : 'An unexpected error occurred on the server.',
    };
    res.status(500).json(response);
};
exports.globalErrorHandler = globalErrorHandler;
//# sourceMappingURL=errorHandler.js.map