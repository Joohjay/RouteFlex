import type { ErrorRequestHandler, NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { config } from '@/config/index.js';
import { AppError, ValidationError } from '@/utils/errors.js';
import { errorResponse } from '@/utils/response.js';
import { logger } from '@/lib/logger.js';

function formatZodError(error: ZodError): ValidationError {
  const details = error.issues.map((issue) => ({
    field: issue.path.join('.'),
    message: issue.message,
  }));
  return new ValidationError(details);
}

export const errorHandler: ErrorRequestHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  let appError: AppError;

  if (err instanceof ZodError) {
    appError = formatZodError(err);
  } else if (err instanceof AppError) {
    appError = err;
  } else {
    appError = new AppError(
      err.message || 'An unexpected error occurred',
      500,
      'INTERNAL_ERROR',
      false
    );
  }

  if (!appError.isOperational) {
    logger.error('Unexpected error:', err);
  } else if (appError.statusCode >= 500) {
    logger.error('Server error:', err);
  } else {
    logger.warn('Client error:', { message: appError.message, code: appError.code });
  }

  const response = errorResponse(
    {
      code: appError.code,
      message: config.NODE_ENV === 'production' && !appError.isOperational
        ? 'Internal server error'
        : appError.message,
      ...(appError instanceof ValidationError ? { details: appError.details } : {}),
    },
    appError.message
  );

  res.status(appError.statusCode).json(response);
};
