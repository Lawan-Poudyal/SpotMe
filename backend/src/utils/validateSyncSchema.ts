// src/utils/validateData.ts
import { ZodSchema, ZodError } from 'zod';
import type { Response } from 'express';
export function validateData<T>(schema: ZodSchema<T>, data: unknown , res : Response){
  const result = schema.safeParse(data);

  if (!result.success) {
    const zodErr = result.error as ZodError;
    return res.status(400).json({
      success: false,
      err: {
        name: 'Bad request payload',
        message: zodErr.issues[0]?.message ?? 'Invalid request payload',
        details: zodErr.issues.map((i) => ({
          path: i.path.join('.'),
          message: i.message,
        })),
      },
    });
  }

  return result.data
}
