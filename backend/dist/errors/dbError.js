"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DbKeyNotFoundError = exports.DbForeignKeyConstraintViolationError = exports.DbUniqueConstraintViolationError = exports.DbError = exports.ZodValidationError = void 0;
exports.mapPrismaError = mapPrismaError;
// this is for the db Error thing right now .
const Error_1 = require("./Error");
const dbErrorHash_1 = __importDefault(require("../utils/dbErrorHash"));
class ZodValidationError extends Error {
    status;
    options;
    constructor(message, status, options) {
        super(message);
        this.status = status;
        this.options = options;
    }
}
exports.ZodValidationError = ZodValidationError;
class DbError extends Error_1.AppError {
    payload;
    constructor(message, status, options) {
        super(message, status);
        this.payload = options?.payload;
    }
}
exports.DbError = DbError;
class DbUniqueConstraintViolationError extends DbError {
    constructor(message, options) {
        super(message, 409, options);
    }
}
exports.DbUniqueConstraintViolationError = DbUniqueConstraintViolationError;
class DbForeignKeyConstraintViolationError extends DbError {
    constructor(message, options) {
        super(message, 401, options);
    }
}
exports.DbForeignKeyConstraintViolationError = DbForeignKeyConstraintViolationError;
class DbKeyNotFoundError extends DbError {
    constructor(message, options) {
        super(message, 404, options);
    }
}
exports.DbKeyNotFoundError = DbKeyNotFoundError;
function mapPrismaError(err) {
    const type = dbErrorHash_1.default[err.code];
    let options = {
        payload: {
            success: false,
            err: {
                name: "",
                message: ""
            }
        }
    };
    switch (type) {
        case 'UniqueConstraintViolation':
            options.payload.err.name = "Conflict Exists";
            options.payload.err.message = "Duplicate values can't be pushed";
            return new DbUniqueConstraintViolationError('Conflict', options);
        case 'ForeignKeyConstraintViolation':
            options.payload.err.name = "Unaunthenticated access";
            options.payload.err.message = "You are not authenticated";
            return new DbForeignKeyConstraintViolationError('Unauthorized', options);
        case "KeyNotFoundError":
            options.payload.err.name = "Not found";
            options.payload.err.message = "Key not found";
            return new DbKeyNotFoundError('Not found', options);
        default:
            return new Error_1.AppError(`Unhandled database error (${err.code})`, 500, 'DatabaseError');
    }
}
//# sourceMappingURL=dbError.js.map