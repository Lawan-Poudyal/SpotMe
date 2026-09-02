import { AppError } from "./Error";
import { ApiFailurePayload } from "../types/apiFailurePayloadType";
import type { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";
import type { validationFailurePayloadType } from "../types/validationFailurePayloadType";
export declare class ZodValidationError extends Error {
    status: number;
    options: validationFailurePayloadType;
    constructor(message: string, status: number, options?: validationFailurePayloadType);
}
export declare class DbError extends AppError {
    payload?: ApiFailurePayload;
    constructor(message: string, status: number, options?: {
        payload: ApiFailurePayload;
    });
}
export declare class DbUniqueConstraintViolationError extends DbError {
    constructor(message: string, options?: {
        payload: ApiFailurePayload;
    });
}
export declare class DbForeignKeyConstraintViolationError extends DbError {
    constructor(message: string, options?: {
        payload: ApiFailurePayload;
    });
}
export declare class DbKeyNotFoundError extends DbError {
    constructor(message: string, options?: {
        payload: ApiFailurePayload;
    });
}
export declare function mapPrismaError(err: PrismaClientKnownRequestError): AppError;
//# sourceMappingURL=dbError.d.ts.map