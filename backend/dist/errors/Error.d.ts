export declare class AppError extends Error {
    status: number;
    constructor(message: string, status?: number, name?: string);
}
export declare class NotFoundError extends AppError {
    constructor(resource?: string);
}
export declare class ValidationError extends AppError {
    fields?: Record<string, string> | undefined;
    constructor(message: string, fields?: Record<string, string>);
}
export declare class UnauthorizedError extends AppError {
    constructor(message?: string);
}
export declare class ForbiddenError extends AppError {
    constructor(message?: string);
}
//# sourceMappingURL=Error.d.ts.map