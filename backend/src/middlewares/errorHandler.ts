import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/Error';
import { ErrorResponse } from '../types/error.types';

export const globalErrorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  if (err instanceof AppError) {
    const response: ErrorResponse = {
      status: err.status,
      message: err.message,
    };

    res.status(err.status).json(response);
    return;
  }

  console.error('Unexpected error:', err);

  res.status(500).json({
    status: 500,
    message: err.message,
  } satisfies ErrorResponse);
};
