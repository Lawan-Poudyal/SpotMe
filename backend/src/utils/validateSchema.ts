import { ZodSchema } from 'zod';
import { ValidationError } from '../errors/Error';

export function validateSchema<T>(schema: ZodSchema<T>, data: unknown): T {
  const result = schema.safeParse(data);

  if (!result.success) {
    const fieldErrors: Record<string, string> = {};

    result.error.errors.forEach((err) => {
      const fieldName = err.path.join('.');
      fieldErrors[fieldName] = err.message;
    });

    throw new ValidationError('Validation failed', fieldErrors);
  }

  return result.data;
}
