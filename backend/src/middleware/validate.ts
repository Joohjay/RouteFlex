import type { NextFunction, Request, Response } from 'express';
import { ZodSchema } from 'zod';
import { BadRequestError } from '@/utils/errors.js';

export function validate<T>(schema: ZodSchema<T>, source: 'body' | 'query' | 'params' = 'body') {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req[source]);

    if (!result.success) {
      const details = result.error.issues.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message,
      }));
      return next(new BadRequestError(details.map((d) => `${d.field}: ${d.message}`).join('; ')));
    }

    // Store validated data for downstream handlers
    const key = `validated${source.charAt(0).toUpperCase() + source.slice(1)}` as const;
    (req as unknown as Record<string, unknown>)[key] = result.data;
    next();
  };
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      validatedBody?: unknown;
      validatedQuery?: unknown;
      validatedParams?: unknown;
    }
  }
}
