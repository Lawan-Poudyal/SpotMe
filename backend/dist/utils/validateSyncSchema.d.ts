import { ZodSchema } from 'zod';
import type { Response } from 'express';
export declare function validateData<T>(schema: ZodSchema<T>, data: unknown, res: Response): T;
//# sourceMappingURL=validateSyncSchema.d.ts.map