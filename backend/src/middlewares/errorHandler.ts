import type { Request, Response, NextFunction } from 'express';
import { AppError, ValidationError } from '../errors/Error';
import { ErrorResponse } from '../types/error.types';

export const globalErrorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const isDevelopment = process.env.NODE_ENV === 'development';

  console.log(err.stack)

  if (err instanceof AppError) {
    const response: ErrorResponse = {
      status: err.status,
      message: err.message,
    };

    if (err instanceof ValidationError && err.fields) {
      response.errors = err.fields;
    }

    res.status(err.status).json(response);
    return;
  }

  const response: ErrorResponse = {
    status: 500,
    message: isDevelopment ? err.message : 'An unexpected error occurred on the server.',
  };

  res.status(500).json(response);
};
