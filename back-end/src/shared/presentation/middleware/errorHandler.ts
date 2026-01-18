import { Request, Response, NextFunction } from 'express';
import { ValidationError } from '@shared/errors/ValidationError';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error('Error:', err);

  // Handle ValidationError
  if (err instanceof ValidationError) {
    res.status(400).json({
      errors: err.errors
    });
    return;
  }

  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
};
